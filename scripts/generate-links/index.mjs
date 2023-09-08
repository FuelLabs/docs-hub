import fs from 'fs';
import { EOL } from 'os';
import { join } from 'path';

import { getDocs, getDocBySlug } from './getDocs.mjs';
import getSortedLinks from './getSortedLinks.mjs';
import processSummary from './processSummary.mjs';
import processVPConfig from './processVPConfig.mjs';
import { capitalize } from './str.mjs';

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
      if (Array.isArray(sortedLinks)) {
        sortedLinks = sortedLinks.map((link) => {
          if (link.label) {
            link.label = capitalize(link.label.replaceAll('_', ' '));
          }
          return link;
        });
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

async function getOrders() {
  const orders = {};
  // SWAY ORDER
  const swaySummary = processSummary(swaySummaryFile.split(EOL), 'sway');
  orders.sway = swaySummary.order;

  // FUELS-RS ORDER
  orders['fuels-rs'] = processSummary(
    rustSummaryFile.split(EOL),
    'fuels-rs'
  ).order;

  // FUELUP ORDER
  orders.fuelup = processSummary(fuelupSummaryFile.split(EOL), 'fuelup').order;

  // INDEXER ORDER
  orders.indexer = processSummary(
    indexerSummaryFile.split(EOL),
    'indexer'
  ).order;

  // SPECS ORDER
  orders.specs = processSummary(specsSummaryFile.split(EOL), 'specs').order;

  // GRAPHQL ORDER
  orders.graphql = graphqlOrderFile;

  // GUIDES ORDER
  orders.guides = guidesOrderFile;

  // ABOUT FUEL ORDER
  // orders['about-fuel'] = aboutFuelOrderFile;

  // WALLET ORDER
  orders.wallet = walletOrderFile;

  // FORC ORDER
  const newForcLines = swaySummary.forcLines.map((line) =>
    line.startsWith('-') ? line : line.slice(2, line.length)
  );
  orders.forc = processSummary(newForcLines, 'forc').order;

  // FUELS-TS ORDER
  orders['fuels-ts'] = processVPConfig(tsConfigFile.split(EOL));

  return orders;
}
