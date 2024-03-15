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
  // fuelup: {
  //   type: 'mdbook',
  //   path: './fuelup/docs/src/SUMMARY.md',
  // },
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
const beta4ForcLines = [];

function handleOrder(orderType, filepath, orderName) {
  let betaOrders;
  let nightlyOrders;
  let beta4Orders;
  const isJSON = orderType === 'json';
  const orderFile = getFile(filepath, 'default', isJSON);
  let nightlyOrderFile;
  let beta4OrderFile;
  if (orderName !== 'fuelup') {
    nightlyOrderFile = getFile(filepath, 'nightly', isJSON);
    beta4OrderFile = getFile(filepath, 'beta-4', isJSON);
  }

  if (isJSON) {
    betaOrders = { order: orderFile };
    nightlyOrders = { order: nightlyOrderFile };
    beta4Orders = { order: beta4OrderFile };
  } else if (orderType === 'mdbook') {
    if (orderName === 'forc') {
      // FORC ORDER
      const newForcLines = forcLines.map(handleForcLines);
      const newNightlyForcLines = nightlyForcLines.map(handleForcLines);
      const newBeta4ForcLines = beta4ForcLines.map(handleForcLines);
      betaOrders = processSummary(newForcLines, 'forc');
      nightlyOrders = processSummary(newNightlyForcLines, 'forc');
      beta4Orders = processSummary(newBeta4ForcLines, 'forc');
    } else {
      betaOrders = processSummary(orderFile.split(EOL), orderName);
      if (orderName !== 'fuelup') {
        nightlyOrders = processSummary(nightlyOrderFile.split(EOL), orderName);
        beta4Orders = processSummary(beta4OrderFile.split(EOL), orderName);
      }
    }
  } else if (orderType === 'vp') {
    betaOrders = processVPConfig(orderFile.split(EOL), false, false);
    nightlyOrders = processVPConfig(nightlyOrderFile.split(EOL), true, false);
    beta4Orders = processVPConfig(beta4OrderFile.split(EOL), false, true);
  }

  return { betaOrders, nightlyOrders, beta4Orders };
}

export async function getOrders() {
  const orders = {};

  Object.keys(CONFIG).forEach((key) => {
    const book = CONFIG[key];
    if (!['guides', 'intro', 'contributing'].includes(key)) {
      const bookOrder = handleOrder(book.type, book.path, key);
      orders[key] = bookOrder.betaOrders.order;
      if (key !== 'fuelup') {
        orders[`nightly-${key}`] = bookOrder.nightlyOrders.order;
        orders[`beta-4-${key}`] = bookOrder.beta4Orders.order;
      }

      if (key === 'sway') {
        forcLines.push(...bookOrder.betaOrders.forcLines);
        nightlyForcLines.push(...bookOrder.nightlyOrders.forcLines);
        beta4ForcLines.push(...bookOrder.beta4Orders.forcLines);
        const forcBookOrder = handleOrder(book.type, book.path, 'forc');
        orders.forc = forcBookOrder.betaOrders.order;
        orders['nightly-forc'] = forcBookOrder.nightlyOrders.order;
        orders['beta-4-forc'] = forcBookOrder.beta4Orders.order;
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
