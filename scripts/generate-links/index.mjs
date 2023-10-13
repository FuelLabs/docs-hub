import fs from 'fs';

import { getDocs, getDocBySlug } from './getDocs.mjs';
import { getOrders } from './getOrders.mjs';
import getSortedLinks from './getSortedLinks.mjs';
import { capitalize } from './str.mjs';

await main();

// GENERATES SIDEBAR LINKS
async function main() {
  const folderPath = 'src/generated/sidebar-links';
  const orders = await getOrders();
  const allOrders = [];
  const allLatestOrders = [];

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
      if (key !== 'guides') {
        if (key.includes('latest')) {
          allLatestOrders.push({
            key: capitalize(key.replace('latest-', '')),
            links: sortedLinks,
          });
        } else {
          allOrders.push({ key: capitalize(key), links: sortedLinks });
        }
      }
    })
  );

  handleAllOrders(allOrders, folderPath, 'all-orders');
  handleAllOrders(allLatestOrders, folderPath, 'all-latest-orders');
}

function handleAllOrders(allOrders, folderPath, filename) {
  const correctOrder = [
    'sway',
    'fuelup',
    'forc',
    'fuels-rs',
    'fuels-ts',
    'wallet',
    'indexer',
    'graphql',
    'specs',
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
