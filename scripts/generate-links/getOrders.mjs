import { EOL } from 'os';

import { getFile } from './getFile.mjs';
import processSummary from './processSummary.mjs';
import { processVPConfig } from './processVPConfig.mjs';

const CONFIG = {
  'migrations-and-disclosures': {
    type: 'mdbook',
    path: './migrations-and-disclosures/docs/src/SUMMARY.md',
  },
  'fuel-book': {
    type: 'mdbook',
    path: './fuel-book/docs/src/SUMMARY.md',
  },
  'node-operator': {
    type: 'mdbook',
    path: './node-operator/docs/src/SUMMARY.md',
  },
  'security-best-practices': {
    type: 'mdbook',
    path: './security-best-practices/docs/src/SUMMARY.md',
  },
  'integration-docs': {
    type: 'mdbook',
    path: './integration-docs/docs/src/SUMMARY.md',
  },
  'fuel-token-overview': {
    type: 'mdbook',
    path: './fuel-token-overview/docs/src/SUMMARY.md',
  },
  'verified-addresses': {
    type: 'mdbook',
    path: './verified-addresses/docs/src/SUMMARY.md',
  },
  ai: {
    type: 'mdbook',
    path: './ai/docs/src/SUMMARY.md',
  },
  sway: {
    type: 'mdbook',
    path: './sway/docs/book/src/SUMMARY.md',
  },
  'sway-libs': {
    type: 'mdbook',
    path: './sway-libs/docs/book/src/SUMMARY.md',
  },
  'sway-standards': {
    type: 'mdbook',
    path: './sway-standards/docs/src/SUMMARY.md',
  },
  'sway-by-example-lib': {
    type: 'mdbook',
    path: './sway-by-example-lib/docs/src/SUMMARY.md',
  },
  'fuels-rs': {
    type: 'mdbook',
    path: './fuels-rs/docs/src/SUMMARY.md',
  },
  'fuels-ts': {
    type: 'vp',
    path: './fuels-ts/apps/docs/.vitepress/config.ts',
  },
  specs: {
    type: 'mdbook',
    path: './fuel-specs/src/SUMMARY.md',
  },
  graphql: {
    type: 'json',
    path: './fuel-graphql-docs/src/nav.json',
  },
  wallet: {
    type: 'json',
    path: './fuels-wallet/packages/docs/src/nav.json',
  },
  guides: {
    type: 'json',
    path: './guides/docs/nav.json',
  },
  intro: {
    type: 'json',
    path: './intro/nav.json',
  },
  contributing: {
    type: 'json',
    path: './contributing/nav.json',
  },
};

const forcLines = [];
const nightlyForcLines = [];

function handleOrder(orderType, filepath, orderName) {
  let betaOrders;
  let nightlyOrders;
  const isJSON = orderType === 'json';
  const orderFile = getFile(filepath, 'default', isJSON);
  const nightlyOrderFile = getFile(filepath, 'nightly', isJSON);

  if (isJSON) {
    betaOrders = { order: orderFile };
    nightlyOrders = { order: nightlyOrderFile };
  } else if (orderType === 'mdbook') {
    if (orderName === 'forc') {
      // FORC ORDER
      const newForcLines = forcLines.map(handleForcLines);
      const newNightlyForcLines = nightlyForcLines.map(handleForcLines);
      betaOrders = processSummary(newForcLines, 'forc');
      nightlyOrders = processSummary(newNightlyForcLines, 'forc');
    } else {
      betaOrders = processSummary(orderFile.split(EOL), orderName);
      nightlyOrders = processSummary(nightlyOrderFile.split(EOL), orderName);
    }
  } else if (orderType === 'vp') {
    betaOrders = processVPConfig(orderFile.split(EOL), false, false);
    nightlyOrders = processVPConfig(nightlyOrderFile.split(EOL), true, false);
  }

  return { betaOrders, nightlyOrders };
}

export async function getOrders() {
  const orders = {};

  Object.keys(CONFIG).forEach((key) => {
    const book = CONFIG[key];
    if (!['guides', 'intro', 'contributing'].includes(key)) {
      const bookOrder = handleOrder(book.type, book.path, key);
      orders[key] = bookOrder.betaOrders.order;
      orders[`nightly-${key}`] = bookOrder.nightlyOrders.order;

      if (key === 'sway') {
        forcLines.push(...bookOrder.betaOrders.forcLines);
        nightlyForcLines.push(...bookOrder.nightlyOrders.forcLines);
        const forcBookOrder = handleOrder(book.type, book.path, 'forc');
        orders.forc = forcBookOrder.betaOrders.order;
        orders['nightly-forc'] = forcBookOrder.nightlyOrders.order;
      }
    } else {
      orders[key] = getFile(book.path, false, true);
    }
  });

  return orders;
}

function handleForcLines(line) {
  return line.startsWith('-') ? line : line.slice(2, line.length);
}
