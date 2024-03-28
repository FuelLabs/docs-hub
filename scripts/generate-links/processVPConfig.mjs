import { EOL } from 'os';

import { getFile } from './getFile.mjs';

const tsAPIOrderFile = getFile(
  './fuels-ts/apps/docs/.typedoc/api-links.json',
  'default',
  true
);
const nightlyTsAPIOrderFile = getFile(
  './fuels-ts/apps/docs/.typedoc/api-links.json',
  'nightly',
  true
);
const beta4TsAPIOrderFile = getFile(
  './fuels-ts/apps/docs/.typedoc/api-links.json',
  'beta-4',
  true
);

function extractData(inputString) {
  // used for api.json order
  const regex = /"([^"]+)":\s*"([^"]+)"/g;
  const match = regex.exec(inputString);
  if (match !== null) {
    return match[2];
  }
  return null;
}

function handleVPLine(
  trimmedLine,
  lines,
  index,
  thisOrder,
  thisCat,
  isNightly,
  isBeta4
) {
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
    const linkMatches = regex.exec(lines[index + 1].trimStart());
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
    let apiJSON;
    if (isNightly) {
      apiJSON = nightlyTsAPIOrderFile;
    } else if (isBeta4) {
      apiJSON = beta4TsAPIOrderFile;
    } else {
      apiJSON = tsAPIOrderFile;
    }
    const apiLines = JSON.stringify(apiJSON, null, 2).split(EOL);
    apiLines.forEach((apiLine, apiIndex) => {
      const trimmedAPILine = apiLine.trimStart();
      const results = handleVPLine(
        trimmedAPILine,
        apiLines,
        apiIndex,
        newVPOrder,
        category,
        isNightly,
        isBeta4
      );
      category = results.category;
      newVPOrder = results.newVPOrder;
    });
  }

  return { newVPOrder, category };
}

export function processVPConfig(lines, isNightly, isBeta4) {
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
        isNightly,
        isBeta4
      );
      tsOrder = newVPOrder;
      currentCategory = category;
    } else if (trimmedLine === 'sidebar: [') {
      foundStart = true;
    }
  });

  return { order: tsOrder };
}
