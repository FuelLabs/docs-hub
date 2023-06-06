export function removeDocsPath(path: string) {
  // clean up the url paths
  let newPath = path
    .replace('docs/', '')
    .replace('/book/', '/')
    .replace('/packages/', '/')
    .replace('/fuels-wallet/docs/', '/fuels-wallet/')
    .replace('/apps/', '/')
    .replace('/src/', '/')
    .replace('/index.md', '.md')
    .replace('/README.md', '.md');

  // handle mdbooks folders that use a same name file instead of index.md
  const paths = newPath.split('/');
  const length = paths.length - 1;
  const last = paths[length].split('.')[0];
  const cat = paths[length - 1];
  if (last === cat) {
    paths.pop();
    newPath = `${paths.join('/')}/`;
  }

  // move forc docs to their own section
  if (path.includes('/forc/')) {
    newPath = newPath.replace('sway/', '');
  }

  // remove subcategory
  if (path.includes('/forc_client/')) {
    newPath = newPath.replace('/forc_client/', '/');
  }

  return newPath;
}
