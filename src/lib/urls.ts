export function removeDocsPath(path: string) {
  // clean up the url paths
  let newPath = path
    .replace('docs/', '')
    .replace('/book/', '/')
    .replace('/packages/', '/')
    .replace('/apps/', '/')
    .replace('/src/', '/')
    .replace('/index.md', '.md')
    .replace('/README.md', '.md')
    .replace('/fuel-graphql-docs/', '/graphql/')
    .replaceAll('/fuel-specs', '/specs')
    .replaceAll('/fuel-indexer', '/indexer')
    .replace('/fuels-wallet/docs/', '/wallet/')
    .replace('/guide/', '/');

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

  // remove forc_client subcategory in forc docs
  if (path.includes('/forc_client/')) {
    newPath = newPath.replace('/forc_client/', '/');
  }

  return newPath;
}
