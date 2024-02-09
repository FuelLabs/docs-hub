import {
  DOCS_DIRECTORY,
  NIGHTLY_DOCS_DIRECTORY,
  BETA_4_DOCS_DIRECTORY,
} from '~/src/config/constants';

import { getRustSDKVersion } from '../versions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleRustVersion(node: any, dirname: string) {
  let versionSet = 'default';
  if (dirname.includes('/nightly/')) {
    versionSet = 'nightly';
  } else if (dirname.includes('/beta-4/')) {
    versionSet = 'beta-4';
  }

  let docsDir = DOCS_DIRECTORY;
  if (versionSet === 'nightly') {
    docsDir = NIGHTLY_DOCS_DIRECTORY;
  } else if (versionSet === 'beta-4') {
    docsDir = BETA_4_DOCS_DIRECTORY;
  }
  const version = getRustSDKVersion(docsDir);
  return node.value.replace('{{versions.fuels}}', version.version);
}
