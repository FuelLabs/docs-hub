import fs from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { EOL } from 'os';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './docs');
const swaySummaryPath = join(DOCS_DIRECTORY, './sway/docs/book/src/SUMMARY.md');
const rustSummaryPath = join(DOCS_DIRECTORY, './fuels-rs/docs/src/SUMMARY.md');
const fuelupSummaryPath = join(DOCS_DIRECTORY, './fuelup/docs/src/SUMMARY.md');
const indexerSummaryPath = join(
  DOCS_DIRECTORY,
  './fuel-indexer/docs/src/SUMMARY.md'
);
const specsSummaryPath = join(DOCS_DIRECTORY, './fuel-specs/src/SUMMARY.md');
// const nixSummaryPath = join(DOCS_DIRECTORY, './fuel-nix/book/src/SUMMARY.md');

const graphqlOrderPath = join(
  DOCS_DIRECTORY,
  './fuel-graphql-docs/src/nav.json'
);
const guidesOrderPath = join(DOCS_DIRECTORY, './guides/docs/nav.json');
const walletOrderPath = join(
  DOCS_DIRECTORY,
  './fuels-wallet/packages/docs/src/nav.json'
);
// const aboutFuelOrderPath = join(DOCS_DIRECTORY, '../docs/about-fuel/nav.json');
const tsConfigPath = join(
  DOCS_DIRECTORY,
  './fuels-ts/apps/docs/.vitepress/config.ts'
);

const tsAPIOrderPath = join(
  DOCS_DIRECTORY,
  './fuels-ts/apps/docs/.typedoc/api-links.json'
);

const swaySummaryFile = fs.readFileSync(swaySummaryPath, 'utf8');
const rustSummaryFile = fs.readFileSync(rustSummaryPath, 'utf8');
const fuelupSummaryFile = fs.readFileSync(fuelupSummaryPath, 'utf8');
const indexerSummaryFile = fs.readFileSync(indexerSummaryPath, 'utf8');
const specsSummaryFile = fs.readFileSync(specsSummaryPath, 'utf8');
const graphqlOrderFile = JSON.parse(fs.readFileSync(graphqlOrderPath, 'utf8'));
const guidesOrderFile = JSON.parse(fs.readFileSync(guidesOrderPath, 'utf8'));
const walletOrderFile = JSON.parse(fs.readFileSync(walletOrderPath, 'utf8'));
// const nixSummaryFile = fs.readFileSync(nixSummaryPath, 'utf8');

// const aboutFuelOrderFile = JSON.parse(
//   fs.readFileSync(aboutFuelOrderPath, 'utf8')
// );
const tsConfigFile = fs.readFileSync(tsConfigPath, 'utf8');
const tsAPIOrderFile = fs.readFileSync(tsAPIOrderPath, 'utf8');

const forcLines = [];

// GENERATES SIDEBAR LINKS
await main();

async function main() {
  const orders = await getOrders();

  await Promise.all(
    Object.keys(orders).map(async (key) => {
      const slugs = await getDocs(key, orders[key]);
      const final = slugs.map(({ slug }) => getDocBySlug(slug, slugs));
      let sortedLinks = getSortedLinks(orders[key], final);
      if (key === 'guides') {
        const newLinks = {};
        sortedLinks.forEach((link) => {
          newLinks[
            link.label.toLowerCase().replaceAll(' ', '_').replaceAll('-', '_')
          ] = link;
        });
        sortedLinks = newLinks;
      }
      const json = JSON.stringify(sortedLinks);
      const folderPath = 'src/generated/sidebar-links';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      fs.writeFileSync(`${folderPath}/${key}.json`, json, 'utf-8');
    })
  );
}
function extractData(inputString) {
  // used for api.json order
  const regex = /"([^"]+)":\s*"([^"]+)"/g;
  let match = regex.exec(inputString);
  if (match !== null) {
    return match[2];
  }
  return null;
}

function handleVPLine(trimmedLine, lines, index, thisOrder, thisCat) {
  const regex = /'([^']+)'/;
  // Create a shallow copy
  let newVPOrder = JSON.parse(JSON.stringify(thisOrder));
  let category = thisCat;
  if (
    trimmedLine.includes('collapsed:') ||
    trimmedLine.includes('"collapsed":')
  ) {
    // handle categories
    if (trimmedLine.includes('collapsed:')) {
      const matches = regex.exec(lines[index - 2]);
      category = matches[1];
    } else {
      category = extractData(lines[index - 2]);
    }
    if (newVPOrder.menu.includes(category)) {
      category = `API-${category}`;
    }
    newVPOrder.menu.push(category);
    newVPOrder[category] = [];
  } else if (
    // handle items
    trimmedLine.includes('text') &&
    !lines[index + 2].includes('collapsed:') &&
    !lines[index + 2].includes('"collapsed":')
  ) {
    const matches = regex.exec(trimmedLine);
    let linkMatches = regex.exec(lines[index + 1].trimStart());
    let link;
    let linkName;
    if (linkMatches && matches) {
      link = linkMatches[1];
      linkName = matches[1];
    } else {
      linkName = extractData(trimmedLine);
      link = extractData(lines[index + 1].trimStart());
    }
    if (link && linkName) {
      if (link.startsWith('/')) {
        link = link.replace('/', '');
      }
      const split = link.split('/');
      if (category && split.length !== 2 && split[1] !== '') {
        newVPOrder[category].push(linkName);
      } else {
        newVPOrder.menu.push(linkName);
      }
    }
  } else if (trimmedLine.startsWith('apiLinks')) {
    // handle API order
    newVPOrder.menu.push('API');
    const apiJSON = JSON.parse(tsAPIOrderFile);
    const apiLines = JSON.stringify(apiJSON, null, 2).split(EOL);
    apiLines.forEach((apiLine, apiIndex) => {
      const trimmedAPILine = apiLine.trimStart();
      const results = handleVPLine(
        trimmedAPILine,
        apiLines,
        apiIndex,
        newVPOrder,
        category
      );
      category = results.category;
      newVPOrder = results.newVPOrder;
    });
  }

  return { newVPOrder, category };
}

function processVPConfig(lines) {
  let tsOrder = { menu: ['fuels-ts'] };
  let currentCategory;
  let foundStart = false;
  lines.forEach((line, index) => {
    const trimmedLine = line.trimStart();
    if (foundStart) {
      const { newVPOrder, category } = handleVPLine(
        trimmedLine,
        lines,
        index,
        tsOrder,
        currentCategory
      );
      tsOrder = newVPOrder;
      currentCategory = category;
    } else if (trimmedLine === 'sidebar: [') {
      foundStart = true;
    }
  });

  return tsOrder;
}

function processSummary(lines, docsName) {
  const order = { menu: [docsName] };
  let currentCategory;
  lines.forEach((line) => {
    const paths = line.split('/');
    const newPaths = paths[0].split('(');
    const thisCat = currentCategory;
    if (line.includes('.md')) {
      if (docsName === 'sway' && line.includes('/forc/')) {
        // handle forc docs separately
        forcLines.push(line);
      } else if (line[0] === '-') {
        // handle top-level items
        if (paths.length > 2) {
          currentCategory = paths[paths.length - 2];
          // handle forc nav
          if (docsName === 'forc') {
            if (
              paths[paths.length - 2] === 'forc' &&
              paths[paths.length - 1] !== 'index.md'
            ) {
              currentCategory = paths[paths.length - 1];
            }
          }
        } else if (
          paths[paths.length - 1].includes('index.md') ||
          newPaths[newPaths.length - 1].endsWith('.md)')
        ) {
          currentCategory = newPaths[newPaths.length - 1];
        } else {
          currentCategory = paths[paths.length - 1];
        }
        const final = currentCategory.replace('.md)', '');
        if (thisCat === final) {
          const fileName = paths[paths.length - 1].replace('.md)', '');
          if (!order[currentCategory]) order[currentCategory] = [];
          order[currentCategory].push(fileName);
        } else if (final !== 'index') {
          order.menu.push(final);
        }
      } else if (currentCategory) {
        // handle sub-paths
        const fileName = paths[paths.length - 1].replace('.md)', '');
        if (!order[currentCategory]) order[currentCategory] = [];
        if (fileName !== 'index') order[currentCategory].push(fileName);
      }
    }
  });
  return order;
}

async function getOrders() {
  const orders = {};
  // SWAY ORDER
  orders.sway = processSummary(swaySummaryFile.split(EOL), 'sway');
  // FUELS-RS ORDER
  orders['fuels-rs'] = processSummary(rustSummaryFile.split(EOL), 'fuels-rs');
  // FUELUP ORDER
  orders.fuelup = processSummary(fuelupSummaryFile.split(EOL), 'fuelup');
  // INDEXER ORDER
  orders.indexer = processSummary(indexerSummaryFile.split(EOL), 'indexer');
  // SPECS ORDER
  orders.specs = processSummary(specsSummaryFile.split(EOL), 'specs');
  
  // orders.nix = processSummary(nixSummaryFile.split(EOL), 'specs'); 

  // GRAPHQL ORDER
  orders.graphql = graphqlOrderFile;

  // GUIDES ORDER
  orders.guides = guidesOrderFile;

  // ABOUT FUEL ORDER
  // orders['about-fuel'] = aboutFuelOrderFile;

  // WALLET ORDER
  orders.wallet = walletOrderFile;

  // FORC ORDER
  const newForcLines = forcLines.map((line) =>
    line.startsWith('-') ? line : line.slice(2, line.length)
  );
  orders.forc = processSummary(newForcLines, 'forc');

  orders['fuels-ts'] = processVPConfig(tsConfigFile.split(EOL));

  return orders;
}

function getSortedLinks(config, docs) {
  const links = [];
  const lcOrder = config.menu.map((o) =>
    o.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
  );

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    if (doc.category === 'forc_client') {
      doc.category = 'plugins';
    }

    if (doc.category === 'about fuel') {
      doc.category = 'src';
    }

    if (
      !doc.category ||
      doc.category === 'src' ||
      doc.category === 'forc' ||
      (doc.category === 'guide' && doc.title === 'guide') ||
      (doc.category === 'api' && doc.title === 'api')
    ) {
      let newLabel = doc.title;
      if (doc.title === 'index' || doc.title === 'README') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      links.push({ slug: doc.slug, label: newLabel });
      continue;
    }

    const categoryIdx = links.findIndex((l) => {
      return l?.label === doc.category;
    });
    /** Insert category item based on order prop */
    if (categoryIdx >= 0) {
      const submenu = links[categoryIdx]?.submenu || [];
      let newLabel = doc.title;
      if (doc.title === 'index') {
        const arr = doc.slug.split('/');
        newLabel = arr[arr.length - 1];
      }
      if (doc.category === doc.title || doc.title === 'index') {
        links[categoryIdx].hasIndex = true;
      }
      submenu.push({
        slug: doc.slug.toLowerCase(),
        label: newLabel,
      });
      continue;
    }
    let hasIndex = false;
    if (doc.category === doc.title) {
      hasIndex = true;
    }
    const subpath = doc.slug.split('/')[1];
    const submenu = [{ slug: doc.slug.toLowerCase(), label: doc.title }];
    links.push({
      subpath,
      label: doc.category,
      submenu,
      hasIndex,
    });
    /** Insert inside category submenu if category is already on array */
  }

  const sortedLinks = lcOrder
    ? links
        /** Sort first level links */
        .sort((a, b) => {
          const lowerA = a.label
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_');
          const lowerB = b.label
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_');
          const aIdx = lcOrder.indexOf(lowerA);
          const bIdx = lcOrder.indexOf(lowerB);

          if (!a.subpath && !b.subpath) {
            return aIdx - bIdx;
          }
          if (a.subpath && b.subpath) {
            const aFirst = lcOrder.filter((i) => i === lowerA)?.[0];
            const bFirst = lcOrder.filter((i) => i === lowerB)?.[0];
            return lcOrder.indexOf(aFirst) - lcOrder.indexOf(bFirst);
          }
          let category = a.subpath ? lowerA : lowerB;
          category = category.replace('-', '_');
          const first = lcOrder.filter((i) => i === category)?.[0];
          const idx = lcOrder.indexOf(first);
          return a.subpath ? idx - bIdx : aIdx - idx;
        })
        /** Sort categoried links */
        .map((link) => {
          if (!link.submenu) return link;
          let key = link.label
            .toLowerCase()
            .replaceAll(' ', '-')
            .replaceAll('_', '-');
          let catOrder = config[key];
          if (!catOrder) catOrder = config[key.replaceAll('-', '_')];
          if (!catOrder) {
            const regex = /\/([^/]+)\/[^/]+$/;
            const match = link.submenu[0].slug.match(regex);
            key = match[1];
            catOrder = config[key];
          }
          catOrder = catOrder?.map((title) =>
            title.toLowerCase().replaceAll('-', '_').replaceAll(' ', '_')
          );
          const submenu = link.submenu.sort((a, b) => {
            const lowerA = a.label
              .toLowerCase()
              .replaceAll(' ', '_')
              .replaceAll('-', '_');
            const lowerB = b.label
              .toLowerCase()
              .replaceAll(' ', '_')
              .replaceAll('-', '_');
            const aIdx = catOrder ? catOrder.indexOf(lowerA) : 0;
            const bIdx = catOrder ? catOrder.indexOf(lowerB) : 0;
            const result = aIdx - bIdx;
            return result;
          });
          return { ...link, submenu };
        })
    : links;

  return sortedLinks;
}

async function getDocs(key, order) {
  let paths = [];
  switch (key) {
    case 'sway':
      paths = [
        // SWAY DOCS
        './sway/docs/book/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
        // IGNORE FORC PAGES
        '!./sway/docs/book/src/forc/*.md',
        '!./sway/docs/book/src/forc/**/*.md',
      ];
      break;
    case 'forc':
      paths = [
        // FORC DOCS
        './sway/docs/book/src/forc/*.md',
        './sway/docs/book/src/forc/**/*.md',
        // REMOVE UNUSED FILES
        '!./sway/docs/book/src/forc/commands/forc_deploy.md',
        '!./sway/docs/book/src/forc/commands/forc_run.md',
      ];
      break;
    case 'fuels-rs':
      paths = [
        // RUST SDK DOCS
        './fuels-rs/docs/src/**/*.md',
        './fuels-rs/docs/src/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'fuels-ts':
      paths = [
        // TS SDK DOCS
        './fuels-ts/apps/docs/src/*.md',
        './fuels-ts/apps/docs/src/**/*.md',
        './fuels-ts/apps/docs/src/**/*.md',
      ];
      break;
    case 'wallet':
      paths = [
        // WALLET DOCS
        './fuels-wallet/packages/docs/docs/**/*.mdx',
        './fuels-wallet/packages/docs/docs/*.mdx',
      ];
      break;
    case 'graphql':
      paths = [
        // GRAPHQL DOCS
        './fuel-graphql-docs/docs/*.mdx',
        './fuel-graphql-docs/docs/**/*.mdx',
      ];
      break;
    case 'fuelup':
      paths = [
        // FUELUP DOCS
        './fuelup/docs/src/*.md',
        './fuelup/docs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'indexer':
      paths = [
        // INDEXER DOCS
        './fuel-indexer/docs/src/*.md',
        './fuel-indexer/docs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'specs':
      paths = [
        // SPECS DOCS
        './fuel-specs/src/*.md',
        './fuel-specs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    // case 'nix':
    //   paths = [
    //     // SPECS DOCS
    //     './fuel-nix/book/src/*.md',
    //     './fuel-nix/book/src/**/*.md',
    //     // IGNORE ALL SUMMARY PAGES
    //     '!**/SUMMARY.md',
    //   ];
      // break;
    // case 'about-fuel':
    //   paths = [
    //     // ABOUT FUEL DOCS
    //     './about-fuel/*.md',
    //     './about-fuel/**/*.md',
    //   ];
    //   break;
    default:
      paths = [
        // GUIDES
        './guides/**/*.mdx',
      ];
      break;
  }

  paths = await globby(paths, {
    cwd: DOCS_DIRECTORY,
  });

  const duplicateAPIItems = [];
  const duplicateAPICategories = [];
  order.menu.forEach((item) => {
    if (item.startsWith('API-')) {
      duplicateAPIItems.push(item);
    }
  });

  duplicateAPIItems.forEach((item) => {
    const split = item.split('-');
    split.shift();
    const category = split.join('-');
    duplicateAPICategories.push(category);
  });

  const final = paths.map((path) => {
    return {
      slug: removeDocsPath(path, duplicateAPICategories),
      path,
    };
  });
  return final;
}

function removeDocsPath(path, duplicateAPICategories) {
  // clean up the url paths
  const configPath = join(DOCS_DIRECTORY, `../src/config/paths.json`);
  const pathsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let newPath = path;
  duplicateAPICategories.forEach((category) => {
    const cat = category.replace(' ', '-');
    const apiPath = `/api/${cat}`;
    if (path.includes(apiPath)) {
      newPath = path.replace(category, `API-${category}`);
    }
  });

  Object.keys(pathsConfig).forEach((key) => {
    newPath = newPath.replaceAll(key, pathsConfig[key]);
  });

  // handle mdbooks folders that use a same name file instead of index.md
  if (
    newPath.includes('/sway/') ||
    newPath.includes('/fuels-rs/') ||
    newPath.includes('/forc/') ||
    newPath.includes('/indexer/') ||
    newPath.includes('/fuelup/') ||
    newPath.includes('/specs/')
  ) {
    const paths = newPath.split('/');
    const length = paths.length - 1;
    const last = paths[length].split('.')[0];
    const cat = paths[length - 1];
    if (last === cat) {
      paths.pop();
      newPath = `${paths.join('/')}/`;
    }
  }


  return newPath;
}

function getDocBySlug(slug, slugs) {
  let slugPath = slugs.find(
    ({ slug: pathSlug }) => pathSlug === `./${slug}.md`
  );
  if (!slugPath) {
    slugPath = slugs.find(({ slug: pathSlug }) => pathSlug.includes(slug));
  }
  if (!slugPath) {
    throw new Error(`${slug} not found`);
  }

  const fullpath = join(DOCS_DIRECTORY, slugPath.path);
  const document = fs.readFileSync(fullpath, 'utf8');
  const { data } = matter(document);
  if (!data.title) {
    const paths = fullpath.split('/');
    data.title = paths
      .pop()
      ?.replace(/\.(md|mdx)$/, '')
      .replaceAll(/[_-]/g, ' ');
    data.category = paths.pop()?.replaceAll('-', ' ');
  }

  const doc = {};
  const FIELDS = ['title', 'slug', 'content', 'category'];

  // Ensure only the minimal needed data is exposed
  FIELDS.forEach((field) => {
    if (field === 'slug') {
      doc[field] = data.slug || slug.replace(/(\.mdx|\.md)$/, '');
    }
    if (typeof data[field] !== 'undefined') {
      doc[field] = data[field];
    }
  });

  if (doc.category === 'forc_client') {
    doc.category = 'plugins';
  }
  if (doc.title === 'index') {
    doc.title =
      doc.category === 'src'
        ? slug.replace('./', '').replace('.md', '')
        : doc.category;
    if (slug.endsWith('/forc_client.md')) doc.title = 'forc_client';
  }

  if (doc.title === 'README') {
    const arr = doc.slug.split('/');
    const newLabel = arr[arr.length - 1];
    doc.title = newLabel;
  }

  if (doc.slug.includes('fuels-ts/API-')) {
    doc.category = `API-${doc.category}`;
  }

  return {
    ...doc,
  };
}
