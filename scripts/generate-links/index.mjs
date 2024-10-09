import fs from 'fs';

import { getDocBySlug, getDocs } from './getDocs.mjs';
import { getOrders } from './getOrders.mjs';
import getSortedLinks from './getSortedLinks.mjs';
import { capitalize } from './str.mjs';

await main();

// GENERATES SIDEBAR LINKS
async function main() {
  const folderPath = 'src/generated/sidebar-links';
  const orders = await getOrders();
  const allOrders = [];
  const allNightlyOrders = [];

  await Promise.all(
    Object.keys(orders).map(async (key) => {
      const slugs = await getDocs(key, orders[key]);
      const final = slugs.map(({ slug }) => getDocBySlug(slug, slugs));
      let sortedLinks = getSortedLinks(orders[key], final);

      if (key.includes('guides')) {
        const newLinks = {};
        sortedLinks = sortedLinks.map((link) => {
          link.key = link.label
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_');
          return link;
        });
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
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      fs.writeFileSync(`${folderPath}/${key}.json`, json, 'utf-8');
      if (key !== 'contributing') {
        if (
          key.includes('nightly') ||
          ['guides', 'intro', 'contributing'].includes(key)
        ) {
          const cleanKey = key.replace('nightly-', '');
          allNightlyOrders.push({
            key: capitalize(cleanKey),
            sidebarName: getSidebarName(cleanKey),
            links: sortedLinks,
          });
        }
        if (!key.includes('nightly')) {
          allOrders.push({
            key: capitalize(key),
            sidebarName: getSidebarName(key),
            links: sortedLinks,
          });
        }
      }
    })
  );

  handleAllOrders(allOrders, folderPath, 'all-orders');
  handleAllOrders(allNightlyOrders, folderPath, 'all-nightly-orders');
}

function getSidebarName(key) {
  let newKey = key;
  switch (key) {
    case 'fuels-rs':
      newKey = 'Rust SDK';
      break;
    case 'fuels-ts':
      newKey = 'TypeScript SDK';
      break;
    case 'wallet':
      newKey = 'Wallet SDK';
      break;
    case 'graphql':
      newKey = 'GraphQL API';
      break;
    case 'specs':
      newKey = 'Specifications';
      break;
    case 'sway-libs':
      newKey = 'Sway Libraries';
      break;
    case 'sway-standards':
      newKey = 'Sway Standards';
      break;
    case 'sway-by-example-lib':
      newKey = 'Sway By Example';
      break;
    case 'migrations-and-disclosures':
      newKey = 'Migrations & Disclosures';
      break;
    case 'verified-addresses':
      newKey = 'Verified Addresses';
      break;
    case 'guides':
      newKey = 'Guides';
      break;
    case 'integration-docs':
      newKey = 'Integrations';
      break;
    default:
  }

  return capitalize(newKey);
}

function handleAllOrders(allOrders, folderPath, filename) {
  const correctOrder = [
    'migrations-and-disclosures',
    'intro',
    'verified-addresses',
    'guides',
    'sway',
    'sway-libs',
    'sway-standards',
    'sway-by-example-lib',
    'fuels-ts',
    'fuels-rs',
    'wallet',
    'graphql',
    'forc',
    'specs',
    'integration-docs',
  ];

  const finalAllOrders = allOrders.sort((a, b) => {
    const indexA = correctOrder.indexOf(a.key.toLowerCase());
    const indexB = correctOrder.indexOf(b.key.toLowerCase());
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const json = JSON.stringify(finalAllOrders);
  fs.writeFileSync(`${folderPath}/${filename}.json`, json, 'utf-8');
}
