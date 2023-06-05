export function removeDocsPath(path: string) {
  let newPath = path
    .replace('docs/', '')
    .replace('/book/', '/')
    .replace('/packages/', '/')
    .replace('/fuels-wallet/docs/', '/fuels-wallet/')
    .replace('/apps/', '/')
    .replace('/src/', '/')
    .replace('/index.md', '')
    .replace('/README.md', '');

  const paths = newPath.split('/');
  const length = paths.length - 1;
  const last = paths[length].split('.')[0];
  const cat = paths[length - 1];
  if (last === cat) {
    paths.pop();
    newPath = `${paths.join('/')}/`;
  }

  return newPath;
}
