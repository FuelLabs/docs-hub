import {
  BETA_5_DOCS_DIRECTORY,
  DOCS_DIRECTORY,
  NIGHTLY_DOCS_DIRECTORY,
} from '~/src/config/constants';

import { getRustSDKVersion } from '../versions';

// biome-ignore lint/suspicious/noExplicitAny:
export function handleRustVersion(node: any, dirname: string) {
  let versionSet = 'default';
  if (dirname.includes('/nightly/')) {
    versionSet = 'nightly';
  } else if (dirname.includes('/beta-5/')) {
    versionSet = 'beta-5';
  }

  let docsDir = DOCS_DIRECTORY;
  if (versionSet === 'nightly') {
    docsDir = NIGHTLY_DOCS_DIRECTORY;
  } else if (versionSet === 'beta-5') {
    docsDir = BETA_5_DOCS_DIRECTORY;
  }
  const version = getRustSDKVersion(docsDir);
  return node.value.replace('{{versions.fuels}}', version.version);
}
