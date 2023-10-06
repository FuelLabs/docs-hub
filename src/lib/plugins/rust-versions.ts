import { DOCS_DIRECTORY, LATEST_DOCS_DIRECTORY } from '~/src/config/constants';

import { getRustSDKVersion } from '../versions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleRustVersion(node: any, dirname: string) {
  const isLatest = dirname.includes('/latest/');
  const docsPath = isLatest ? LATEST_DOCS_DIRECTORY : DOCS_DIRECTORY;
  const version = getRustSDKVersion(docsPath);
  return node.value.replace('{{versions.fuels}}', version.version);
}
