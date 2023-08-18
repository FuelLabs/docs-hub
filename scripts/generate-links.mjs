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

const swaySummaryFile = fs.readFileSync(swaySummaryPath, 'utf8');
const rustSummaryFile = fs.readFileSync(rustSummaryPath, 'utf8');
const fuelupSummaryFile = fs.readFileSync(fuelupSummaryPath, 'utf8');
const indexerSummaryFile = fs.readFileSync(indexerSummaryPath, 'utf8');
const specsSummaryFile = fs.readFileSync(specsSummaryPath, 'utf8');
const graphqlOrderFile = JSON.parse(fs.readFileSync(graphqlOrderPath, 'utf8'));
const guidesOrderFile = JSON.parse(fs.readFileSync(guidesOrderPath, 'utf8'));
const walletOrderFile = JSON.parse(fs.readFileSync(walletOrderPath, 'utf8'));
// const aboutFuelOrderFile = JSON.parse(
//   fs.readFileSync(aboutFuelOrderPath, 'utf8')
// );
const tsConfigFile = fs.readFileSync(tsConfigPath, 'utf8');

const forcLines = [];

// GENERATES SIDEBAR LINKS
await main();

async function main() {
  const orders = await getOrders();

  await Promise.all(
    Object.keys(orders).map(async (key) => {
      const slugs = await getDocs(key);
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

function processVPConfig(lines) {
  const order = { menu: ['fuels-ts'] };
  let currentCategory;
  let foundStart = false;
  const regex = /'([^']+)'/;
  lines.forEach((line, index) => {
    const trimmedLine = line.trimStart();
    if (foundStart) {
      if (trimmedLine.includes('collapsed:')) {
        const matches = regex.exec(lines[index - 2]);
        currentCategory = matches[1];
        order.menu.push(currentCategory);
        order[currentCategory] = [];
      }

      if (trimmedLine.includes('text')) {
        if (!lines[index + 2].includes('collapsed:')) {
          const matches = regex.exec(trimmedLine);
          if (currentCategory) {
            order[currentCategory].push(matches[1]);
          } else {
            order.menu.push(matches[1]);
          }
        }
      }
    } else if (trimmedLine === 'sidebar: [') {
      foundStart = true;
    }
  });

  return order;
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
  // GRAPHQL ORDER
  orders.graphql = graphqlOrderFile;

  // GUIDES ORDER
  orders.guides = guidesOrderFile;

  // ABOUT FUEL ORDER
  // orders['about-fuel'] = aboutFuelOrderFile;

  // WALLET ORDER
  orders.wallet = walletOrderFile;

  orders['fuels-ts'] = processVPConfig(tsConfigFile.split(EOL));

  // FORC ORDER
  const newForcLines = forcLines.map((line) =>
    line.startsWith('-') ? line : line.slice(2, line.length)
  );
  orders.forc = processSummary(newForcLines, 'forc');

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
      (doc.category === 'guide' && doc.title === 'guide')
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
        slug: doc.slug,
        label: newLabel,
      });
      continue;
    }
    let hasIndex = false;
    if (doc.category === doc.title) {
      hasIndex = true;
    }
    const subpath = doc.slug.split('/')[1];
    const submenu = [{ slug: doc.slug, label: doc.title }];
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
          const lowerA = a.label.toLowerCase().replaceAll(' ', '_');
          const lowerB = b.label.toLowerCase().replaceAll(' ', '_');
          const aIdx = lcOrder.indexOf(lowerA);
          const bIdx = lcOrder.indexOf(lowerB);

          if (!a.subpath && !b.subpath) {
            return aIdx - bIdx;
          }
          if (a.subpath && b.subpath) {
            const aFirst = lcOrder.filter((i) => i.startsWith(lowerA))?.[0];
            const bFirst = lcOrder.filter((i) => i.startsWith(lowerB))?.[0];
            return lcOrder.indexOf(aFirst) - lcOrder.indexOf(bFirst);
          }
          const category = a.subpath ? lowerA : lowerB;
          const first = lcOrder.filter((i) => i.startsWith(category))?.[0];
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

async function getDocs(key) {
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

  const final = paths.map((path) => {
    return {
      slug: removeDocsPath(path),
      path,
    };
  });
  return final;
}

function removeDocsPath(path) {
  // clean up the url paths
  const configPath = join(DOCS_DIRECTORY, `../src/config/paths.json`);
  const pathsConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let newPath = path;
  Object.keys(pathsConfig).forEach((key) => {
    newPath = newPath.replaceAll(key, pathsConfig[key]);
  });

  // handle mdbooks folders that use a same name file instead of index.md
  const paths = newPath.split('/');
  const length = paths.length - 1;
  const last = paths[length].split('.')[0];
  const cat = paths[length - 1];
  if (last === cat) {
    paths.pop();
    newPath = `${paths.join('/')}/`;
  }

  // move forc docs to their own section
  if (path.includes('/forc/')) {
    newPath = newPath.replace('sway/', '');
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

  return {
    ...doc,
  };
}
