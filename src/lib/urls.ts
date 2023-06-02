export function removeDocsPath(path: string) {
  const newPath = path
    .replace('docs/', '')
    .replace('/book/', '/')
    .replace('/packages/', '/')
    .replace('/fuels-wallet/docs/', '/fuels-wallet/')
    .replace('/apps/', '/')
    .replace('/src/', '/');
  return newPath;
}
