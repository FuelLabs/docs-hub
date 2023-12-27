import patchFixWalletDownloadLink from './download-link.mjs';
import patchFixWalletExamples from './wallet-examples.mjs';

function main() {
  patchFixWalletExamples();
  patchFixWalletDownloadLink();
}

main();
