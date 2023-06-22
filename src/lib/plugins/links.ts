/* eslint-disable @typescript-eslint/no-explicit-any */
export function handleLinks(node: any, dirname: string) {
  let newUrl: string | null = null;
  if (!node.url.includes('http')) {
    newUrl = node.url
      .replace('.md', '')
      .replace('/index', '')
      .replace('.html', '');
    const dir = dirname
      // sway
      .replace('/docs/book/src', '')
      // indexer
      .replace('/fuel-indexer/docs/src', '/fuel-indexer')
      // fuelup
      .replace('/fuelup/docs/src', '/fuelup')
      // rust sdk
      .replace('/fuels-rs/docs/src', '/fuels-rs')
      // specs
      .replace('/fuel-specs/src', '/fuel-specs')
      // ts sdk
      .replace('/fuels-ts/apps/docs/src', '/fuels-ts');
    if (node.url.startsWith('../')) {
      const folder = dirname.split('/').pop();
      newUrl = `/${dir.replace(folder!, '')}${newUrl!.replace('../', '')}`;
    } else if (node.url.startsWith('./') && !node.url.includes('index')) {
      newUrl = `/${dir.endsWith('/') ? dir : `${dir}/`}${newUrl!.replace(
        './',
        ''
      )}`;
    } else if (/^[a-zA-Z]/.test(node.url)) {
      newUrl = `/${dir}/${newUrl}`;
    }
    newUrl = newUrl!.replace('/sway/forc/', '/forc/');
  } else if (
    node.url.endsWith('CONTRIBUTING') &&
    node.url.includes('github.com')
  ) {
    newUrl = `${node.url}.md`;
  }
  return newUrl;
}
