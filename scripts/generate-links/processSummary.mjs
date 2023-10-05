export default function processSummary(lines, docsName) {
  let order = { menu: [docsName] };
  let forcLines = [];
  let currentCategory;
  lines.forEach((line) => {
    const { currentOrder, currentForcLines, currentCat } = handleLine(
      line,
      docsName,
      currentCategory,
      order,
      forcLines
    );
    order = currentOrder;
    forcLines = currentForcLines;
    currentCategory = currentCat;
  });
  return { order, forcLines };
}

function handleLine(line, docsName, currentCategory, order, forcLines) {
  let currentOrder = order;
  let currentForcLines = forcLines;
  let currentCat = currentCategory;
  const paths = line.split('/');
  const newPaths = paths[0].split('(');
  if (line.includes('.md')) {
    if (docsName === 'sway' && line.includes('/forc/')) {
      // handle forc docs separately
      currentForcLines.push(line);
    } else if (line[0] === '-') {
      const handled = handlePath(
        paths,
        currentCat,
        docsName,
        newPaths,
        currentOrder
      );
      currentOrder = handled.order;
      currentCat = handled.currentCategory;
    } else if (currentCat) {
      currentOrder = handleSubPaths(currentOrder, paths, currentCat);
    }
  }
  return { currentOrder, currentForcLines, currentCat };
}

function handlePath(paths, currentCat, docsName, newPaths, currentOrder) {
  const order = currentOrder;
  let currentCategory = currentCat;
  const thisCat = currentCat;
  // handle top-level items
  if (paths.length > 2) {
    currentCategory = handleNavItem(docsName, paths, currentCategory);
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

  return { order, currentCategory };
}

function handleSubPaths(thisOrder, paths, currentCategory) {
  const order = thisOrder;
  const fileName = paths[paths.length - 1].replace('.md)', '');
  if (!order[currentCategory]) order[currentCategory] = [];
  if (fileName !== 'index') order[currentCategory].push(fileName);
  return order;
}

function handleNavItem(docsName, paths, currentCat) {
  let currentCategory = currentCat;
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
  return currentCategory;
}
