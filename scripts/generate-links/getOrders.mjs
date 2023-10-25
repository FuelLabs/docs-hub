import { EOL } from 'os';

import { getFile } from './getFile.mjs';
import processSummary from './processSummary.mjs';
import { processVPConfig } from './processVPConfig.mjs';

const CONFIG = {
  // sway: {
  //   type: 'mdbook',
  //   path: './sway/docs/book/src/SUMMARY.md',
  // },
  // 'fuels-rs': {
  //   type: 'mdbook',
  //   path: './fuels-rs/docs/src/SUMMARY.md',
  // },
  // 'fuels-ts': {
  //   type: 'vp',
  //   path: './fuels-ts/apps/docs/.vitepress/config.ts',
  // },
  // fuelup: {
  //   type: 'mdbook',
  //   path: './fuelup/docs/src/SUMMARY.md',
  // },
  // indexer: {
  //   type: 'mdbook',
  //   path: './fuel-indexer/docs/src/SUMMARY.md',
  // },
  // specs: {
  //   type: 'mdbook',
  //   path: './fuel-specs/src/SUMMARY.md',
  // },
  // graphql: {
  //   type: 'json',
  //   path: './fuel-graphql-docs/src/nav.json',
  // },
  // wallet: {
  //   type: 'json',
  //   path: './fuels-wallet/packages/docs/src/nav.json',
  // },
  guides: {
    type: 'json',
    path: './guides/docs/nav.json',
  },
  // 'about-fuel': {
  //   type: 'json',
  //   path: './about-fuel/nav.json',
  // },
};

const forcLines = [];
const latestForcLines = [];

function handleOrder(orderType, filepath, orderName) {
  let betaOrders;
  let latestOrders;
  const isJSON = orderType === 'json';
  const orderFile = getFile(filepath, false, isJSON);
  const latestOrderFile = getFile(filepath, true, isJSON);
  if (isJSON) {
    betaOrders = { order: orderFile };
    latestOrders = { order: latestOrderFile };
  } else if (orderType === 'mdbook') {
    if (orderName === 'forc') {
      // FORC ORDER
      const newForcLines = forcLines.map(handleForcLines);
      const newLatestForcLines = latestForcLines.map(handleForcLines);
      betaOrders = processSummary(newForcLines, 'forc');
      latestOrders = processSummary(newLatestForcLines, 'forc');
    } else {
      betaOrders = processSummary(orderFile.split(EOL), orderName);
      latestOrders = processSummary(latestOrderFile.split(EOL), orderName);
    }
  } else if (orderType === 'vp') {
    betaOrders = processVPConfig(orderFile.split(EOL));
    latestOrders = processVPConfig(latestOrderFile.split(EOL));
  }

  return { betaOrders, latestOrders };
}

export async function getOrders() {
  const orders = {};

  Object.keys(CONFIG).forEach((key) => {
    const book = CONFIG[key];
    if (key !== 'guides') {
      const bookOrder = handleOrder(book.type, book.path, key);
      orders[key] = bookOrder.betaOrders.order;
      orders[`latest-${key}`] = bookOrder.latestOrders.order;
      if (key === 'sway') {
        forcLines.push(...bookOrder.betaOrders.forcLines);
        latestForcLines.push(...bookOrder.latestOrders.forcLines);
        const forcBookOrder = handleOrder(book.type, book.path, 'forc');
        orders.forc = forcBookOrder.betaOrders.order;
        orders['latest-forc'] = forcBookOrder.latestOrders.order;
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
