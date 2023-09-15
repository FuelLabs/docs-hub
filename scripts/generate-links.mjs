import fs from 'fs';
import { globby } from 'globby';
import matter from 'gray-matter';
import { EOL } from 'os';
import { join } from 'path';

const DOCS_DIRECTORY = join(process.cwd(), './docs');
const LATEST_DOCS_DIRECTORY = join(process.cwd(), './docs/latest');

const swaySummaryFile = getFile('./sway/docs/book/src/SUMMARY.md');
const latestSwaySummaryFile = getFile('./sway/docs/book/src/SUMMARY.md', true);

const rustSummaryFile = getFile('./fuels-rs/docs/src/SUMMARY.md');
const latestRustSummaryFile = getFile('./fuels-rs/docs/src/SUMMARY.md', true);

const fuelupSummaryFile = getFile('./fuelup/docs/src/SUMMARY.md');
const latestFuelupSummaryFile = getFile('./fuelup/docs/src/SUMMARY.md', true);

const indexerSummaryFile = getFile('./fuel-indexer/docs/src/SUMMARY.md');
const latestIndexerSummaryFile = getFile(
  './fuel-indexer/docs/src/SUMMARY.md',
  true
);

const specsSummaryFile = getFile('./fuel-specs/src/SUMMARY.md');
const latestSpecsSummaryFile = getFile('./fuel-specs/src/SUMMARY.md', true);

const graphqlOrderFile = getFile(
  './fuel-graphql-docs/src/nav.json',
  false,
  true
);
const latestGraphqlOrderFile = getFile(
  './fuel-graphql-docs/src/nav.json',
  true,
  true
);

const walletOrderFile = getFile(
  './fuels-wallet/packages/docs/src/nav.json',
  false,
  true
);
const latestWalletOrderFile = getFile(
  './fuels-wallet/packages/docs/src/nav.json',
  true,
  true
);

const guidesOrderFile = getFile('./guides/docs/nav.json', false, true);
const latestGuidesOrderFile = getFile('./guides/docs/nav.json', true, true);

const tsConfigFile = getFile('./fuels-ts/apps/docs/.vitepress/config.ts');
const latestTsConfigFile = getFile(
  './fuels-ts/apps/docs/.vitepress/config.ts',
  true
);

const tsAPIOrderFile = getFile(
  './fuels-ts/apps/docs/.typedoc/api-links.json',
  false,
  true
);
const latestTsAPIOrderFile = getFile(
  './fuels-ts/apps/docs/.typedoc/api-links.json',
  true,
  true
);

// const aboutFuelOrderFile = getFile('./about-fuel/nav.json', false, true);
// const latestAboutFuelOrderFile = getFile('./about-fuel/nav.json', true, true);

const forcLines = [];
const latestForcLines = [];

// GENERATES SIDEBAR LINKS
await main();

async function main() {
  const orders = await getOrders();

  await Promise.all(
    Object.keys(orders).map(async (key) => {
      const slugs = await getDocs(key, orders[key]);
      const final = slugs.map(({ slug }) => getDocBySlug(slug, slugs));
      let sortedLinks = getSortedLinks(orders[key], final);
      if (key.includes('guides')) {
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

function getFile(path, isLatest = false, isJSON = false) {
  const docsDir = isLatest ? LATEST_DOCS_DIRECTORY : DOCS_DIRECTORY;
  const fullPath = join(docsDir, path);
  const file = fs.readFileSync(fullPath, 'utf8');
  if (isJSON) {
    return JSON.parse(file);
  }
  return file;
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

function handleVPLine(trimmedLine, lines, index, thisOrder, thisCat, isLatest) {
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
    const apiJSON = isLatest ? latestTsAPIOrderFile : tsAPIOrderFile;
    const apiLines = JSON.stringify(apiJSON, null, 2).split(EOL);
    apiLines.forEach((apiLine, apiIndex) => {
      const trimmedAPILine = apiLine.trimStart();
      const results = handleVPLine(
        trimmedAPILine,
        apiLines,
        apiIndex,
        newVPOrder,
        category,
        isLatest
      );
      category = results.category;
      newVPOrder = results.newVPOrder;
    });
  }

  return { newVPOrder, category };
}

function processVPConfig(lines, isLatest) {
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
        currentCategory,
        isLatest
      );
      tsOrder = newVPOrder;
      currentCategory = category;
    } else if (trimmedLine === 'sidebar: [') {
      foundStart = true;
    }
  });

  return tsOrder;
}

function processSummary(lines, docsName, isLatest = false) {
  const order = { menu: [docsName] };
  let currentCategory;
  lines.forEach((line) => {
    const paths = line.split('/');
    const newPaths = paths[0].split('(');
    const thisCat = currentCategory;
    if (line.includes('.md')) {
      if (docsName === 'sway' && line.includes('/forc/')) {
        // handle forc docs separately
        if (isLatest) {
          latestForcLines.push(line);
        } else {
          forcLines.push(line);
        }
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
  orders['latest-sway'] = processSummary(
    latestSwaySummaryFile.split(EOL),
    'sway',
    true
  );
  // FUELS-RS ORDER
  orders['fuels-rs'] = processSummary(rustSummaryFile.split(EOL), 'fuels-rs');
  orders['latest-fuels-rs'] = processSummary(
    latestRustSummaryFile.split(EOL),
    'fuels-rs',
    true
  );
  // FUELUP ORDER
  orders.fuelup = processSummary(fuelupSummaryFile.split(EOL), 'fuelup');
  orders['latest-fuelup'] = processSummary(
    latestFuelupSummaryFile.split(EOL),
    'fuelup',
    true
  );
  // INDEXER ORDER
  orders.indexer = processSummary(indexerSummaryFile.split(EOL), 'indexer');
  orders['latest-indexer'] = processSummary(
    latestIndexerSummaryFile.split(EOL),
    'indexer',
    true
  );
  // SPECS ORDER
  orders.specs = processSummary(specsSummaryFile.split(EOL), 'specs');
  orders['latest-specs'] = processSummary(
    latestSpecsSummaryFile.split(EOL),
    'specs',
    true
  );
  // GRAPHQL ORDER
  orders.graphql = graphqlOrderFile;
  orders['latest-graphql'] = latestGraphqlOrderFile;

  // GUIDES ORDER
  orders.guides = guidesOrderFile;
  orders['latest-guides'] = latestGuidesOrderFile;

  // ABOUT FUEL ORDER
  // orders['about-fuel'] = aboutFuelOrderFile;
  // orders['latest-about-fuel'] = latestAboutFuelOrderFile;

  // WALLET ORDER
  orders.wallet = walletOrderFile;
  orders['latest-wallet'] = latestWalletOrderFile;

  // FORC ORDER
  const newForcLines = forcLines.map(handleForcLines);
  orders.forc = processSummary(newForcLines, 'forc');

  const newLatestForcLines = latestForcLines.map(handleForcLines);
  orders['latest-forc'] = processSummary(newLatestForcLines, 'forc', true);

  // FUELS-TS ORDER
  orders['fuels-ts'] = processVPConfig(tsConfigFile.split(EOL));
  orders['latest-fuels-ts'] = processVPConfig(
    latestTsConfigFile.split(EOL),
    true
  );

  return orders;
}

function handleForcLines(line) {
  return line.startsWith('-') ? line : line.slice(2, line.length);
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

    const finalSlug = doc.slug
      .toLowerCase()
      .replace('latest/guides', 'guides/latest');

    if (
      !doc.category ||
      doc.category === 'src' ||
      doc.category === 'forc' ||
      (doc.category === 'guide' && doc.title === 'guide') ||
      (doc.category === 'api' && doc.title === 'api')
    ) {
      let newLabel = doc.title.replace('latest/', '');
      if (newLabel === 'index' || newLabel === 'README') {
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
        slug: finalSlug,
        label: newLabel,
      });
      continue;
    }
    let hasIndex = false;
    if (doc.category === doc.title) {
      hasIndex = true;
    }
    const splitSlug = doc.slug.split('/');
    let subpath =
      splitSlug[1] === 'latest' ? `latest/${splitSlug[2]}` : splitSlug[1];
    subpath = subpath.replace('latest/guides', 'guides/latest');
    const submenu = [{ slug: finalSlug, label: doc.title }];
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
    case 'latest-sway':
      paths = [
        // SWAY DOCS
        './latest/sway/docs/book/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
        // IGNORE FORC PAGES
        '!./latest/sway/docs/book/src/forc/*.md',
        '!./latest/sway/docs/book/src/forc/**/*.md',
      ];
      break;
    case 'forc':
      paths = [
        // FORC DOCS
        './sway/docs/book/src/forc/*.md',
        './sway/docs/book/src/forc/**/*.md',
      ];
      break;
    case 'latest-forc':
      paths = [
        // FORC DOCS
        './latest/sway/docs/book/src/forc/*.md',
        './latest/sway/docs/book/src/forc/**/*.md',
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
    case 'latest-fuels-rs':
      paths = [
        // RUST SDK DOCS
        './latest/fuels-rs/docs/src/**/*.md',
        './latest/fuels-rs/docs/src/*.md',
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
    case 'latest-fuels-ts':
      paths = [
        // TS SDK DOCS
        './latest/fuels-ts/apps/docs/src/*.md',
        './latest/fuels-ts/apps/docs/src/**/*.md',
        './latest/fuels-ts/apps/docs/src/**/*.md',
      ];
      break;
    case 'wallet':
      paths = [
        // WALLET DOCS
        './fuels-wallet/packages/docs/docs/**/*.mdx',
        './fuels-wallet/packages/docs/docs/*.mdx',
      ];
      break;
    case 'latest-wallet':
      paths = [
        // WALLET DOCS
        './latest/fuels-wallet/packages/docs/docs/**/*.mdx',
        './latest/fuels-wallet/packages/docs/docs/*.mdx',
      ];
      break;
    case 'graphql':
      paths = [
        // GRAPHQL DOCS
        './fuel-graphql-docs/docs/*.mdx',
        './fuel-graphql-docs/docs/**/*.mdx',
      ];
      break;
    case 'latest-graphql':
      paths = [
        // GRAPHQL DOCS
        './latest/fuel-graphql-docs/docs/*.mdx',
        './latest/fuel-graphql-docs/docs/**/*.mdx',
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
    case 'latest-fuelup':
      paths = [
        // FUELUP DOCS
        './latest/fuelup/docs/src/*.md',
        './latest/fuelup/docs/src/**/*.md',
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
    case 'latest-indexer':
      paths = [
        // INDEXER DOCS
        './latest/fuel-indexer/docs/src/*.md',
        './latest/fuel-indexer/docs/src/**/*.md',
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
    case 'latest-specs':
      paths = [
        // SPECS DOCS
        './latest/fuel-specs/src/*.md',
        './latest/fuel-specs/src/**/*.md',
        // IGNORE ALL SUMMARY PAGES
        '!**/SUMMARY.md',
      ];
      break;
    case 'guides':
      paths = [
        // GUIDES
        './guides/**/*.mdx',
      ];
      break;
    case 'latest-guides':
      paths = [
        // GUIDES
        './latest/guides/**/*.mdx',
      ];
      break;
    // case 'about-fuel':
    // case 'latest-about-fuel':
    //   paths = [
    //     // ABOUT FUEL DOCS
    //     './about-fuel/*.md',
    //     './about-fuel/**/*.md',
    //   ];
    //   break;
    default:
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
