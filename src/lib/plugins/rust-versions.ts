import { DOCS_DIRECTORY, NIGHTLY_DOCS_DIRECTORY } from '~/src/config/constants';

import { getRustSDKVersion } from '../versions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleRustVersion(node: any, dirname: string) {
  const isNightly = dirname.includes('/nightly/');
  const docsPath = isNightly ? NIGHTLY_DOCS_DIRECTORY : DOCS_DIRECTORY;
  const version = getRustSDKVersion(docsPath);
  return node.value.replace('{{versions.fuels}}', version.version);
}
