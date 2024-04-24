import { EOL } from 'os';

import { getFile } from './getFile.mjs';
import processSummary from './processSummary.mjs';
import { processVPConfig } from './processVPConfig.mjs';

const CONFIG = {
  sway: {
    type: 'mdbook',
    path: './sway/docs/book/src/SUMMARY.md',
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
const beta5ForcLines = [];

function handleOrder(orderType, filepath, orderName) {
  let betaOrders;
  let nightlyOrders;
  let beta5Orders;
  const isJSON = orderType === 'json';
  const orderFile = getFile(filepath, 'default', isJSON);
  const nightlyOrderFile = getFile(filepath, 'nightly', isJSON);
  const beta5OrderFile = getFile(filepath, 'beta-5', isJSON);

  if (isJSON) {
    betaOrders = { order: orderFile };
    nightlyOrders = { order: nightlyOrderFile };
    beta5Orders = { order: beta5OrderFile };
  } else if (orderType === 'mdbook') {
    if (orderName === 'forc') {
      // FORC ORDER
      const newForcLines = forcLines.map(handleForcLines);
      const newNightlyForcLines = nightlyForcLines.map(handleForcLines);
      const newBeta5ForcLines = beta5ForcLines.map(handleForcLines);
      betaOrders = processSummary(newForcLines, 'forc');
      nightlyOrders = processSummary(newNightlyForcLines, 'forc');
      beta5Orders = processSummary(newBeta5ForcLines, 'forc');
    } else {
      betaOrders = processSummary(orderFile.split(EOL), orderName);
      nightlyOrders = processSummary(nightlyOrderFile.split(EOL), orderName);
      beta5Orders = processSummary(beta5OrderFile.split(EOL), orderName);
    }
  } else if (orderType === 'vp') {
    betaOrders = processVPConfig(orderFile.split(EOL), false, false);
    nightlyOrders = processVPConfig(nightlyOrderFile.split(EOL), true, false);
    beta5Orders = processVPConfig(beta5OrderFile.split(EOL), false, true);
  }

  return { betaOrders, nightlyOrders, beta5Orders };
}

export async function getOrders() {
  const orders = {};

  Object.keys(CONFIG).forEach((key) => {
    const book = CONFIG[key];
    if (!['guides', 'intro', 'contributing'].includes(key)) {
      const bookOrder = handleOrder(book.type, book.path, key);
      orders[key] = bookOrder.betaOrders.order;
      orders[`nightly-${key}`] = bookOrder.nightlyOrders.order;
      orders[`beta-5-${key}`] = bookOrder.beta5Orders.order;

      if (key === 'sway') {
        forcLines.push(...bookOrder.betaOrders.forcLines);
        nightlyForcLines.push(...bookOrder.nightlyOrders.forcLines);
        beta5ForcLines.push(...bookOrder.beta5Orders.forcLines);
        const forcBookOrder = handleOrder(book.type, book.path, 'forc');
        orders.forc = forcBookOrder.betaOrders.order;
        orders['nightly-forc'] = forcBookOrder.nightlyOrders.order;
        orders['beta-5-forc'] = forcBookOrder.beta5Orders.order;
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
