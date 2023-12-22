import patchFixWalletDownloadLink from './download-link.mjs';
import patchFixWalletExamples from './wallet-patch-fixes/index.mjs';

function main() {
  patchFixWalletExamples();
  patchFixWalletDownloadLink();
}

main();
