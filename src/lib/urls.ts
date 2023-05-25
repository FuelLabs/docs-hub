export function removeDocsPath(path: string) {
  const newPath = path
    .replace('docs/', '')
    .replace('/book/', '/')
    .replace('/src/', '/');
  return newPath;
}
