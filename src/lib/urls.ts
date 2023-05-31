export function removeDocsPath(path: string) {
  const newPath = path
    .replace('docs/', '')
    .replace('/book/', '/')
    .replace('/apps/', '/')
    .replace('/src/', '/');
  return newPath;
}
