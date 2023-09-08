export default function processSummary(lines, docsName) {
  const order = { menu: [docsName] };
  const forcLines = [];
  let currentCategory;
  lines.forEach((line) => {
    const paths = line.split('/');
    const newPaths = paths[0].split('(');
    const thisCat = currentCategory;
    if (line.includes('.md')) {
      if (docsName === 'sway' && line.includes('/forc/')) {
        // handle forc docs separately
        forcLines.push(line);
      } else if (line[0] === '-') {
        // handle top-level items
        if (paths.length > 2) {
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
      } else if (currentCategory) {
        // handle sub-paths
        const fileName = paths[paths.length - 1].replace('.md)', '');
        if (!order[currentCategory]) order[currentCategory] = [];
        if (fileName !== 'index') order[currentCategory].push(fileName);
      }
    }
  });
  return { order, forcLines };
}
