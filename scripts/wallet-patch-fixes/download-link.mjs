import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { join } from 'path';

const constantsPath = join(
  process.cwd(),
  'docs/fuels-wallet/packages/docs/src/constants.ts'
);
const nightlyConstantsPath =
  'docs/nightly/fuels-wallet/packages/docs/src/constants.ts';
const beta5ConstantsPath =
  'docs/beta-5/fuels-wallet/packages/docs/src/constants.ts';

const downloadVarName = 'DOWNLOAD_LINK';

function handleConstantsFile(filePath, version) {
  const file = readFileSync(filePath, 'utf8');

  const lines = file.split(EOL);
  let start;
  let end;

  for (let i = 0; i < lines.length; i++) {
    if (!start) {
      if (lines[i].includes(downloadVarName)) {
        start = i;
      }
    } else if (!end) {
      if (lines[i].endsWith(';')) {
        end = i;
      }
    }
  }

  if (start !== undefined && end !== undefined) {
    const downloadLink =
      'https://wallet.fuel.network/app/fuel-wallet-0.16.1.zip';
    const modifiedContent = `export const DOWNLOAD_LINK = '${downloadLink}';`;
    lines.splice(start, end - start + 1, modifiedContent);
    const newFileContent = lines.join(EOL);
    writeFileSync(filePath, newFileContent, 'utf8');

    console.log('File modified successfully');
  } else {
    console.log('Variable definition not found or incomplete.');
  }
}

export default function patchFixWalletDownloadLink() {
  handleConstantsFile(constantsPath, 'default');
  handleConstantsFile(nightlyConstantsPath, 'nightly');
  handleConstantsFile(beta5ConstantsPath, 'beta-5');
}
