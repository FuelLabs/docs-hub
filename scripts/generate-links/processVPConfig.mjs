function extractData(inputString) {
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
  isNightly
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
  }

  return { newVPOrder, category };
}

export function processVPConfig(lines, isNightly) {
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
        isNightly
      );
      tsOrder = newVPOrder;
      currentCategory = category;
    } else if (trimmedLine === 'sidebar: [') {
      foundStart = true;
    }
  });

  return { order: tsOrder };
}
