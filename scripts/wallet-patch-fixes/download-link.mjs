import { readFileSync, writeFileSync } from 'fs';
import { EOL } from 'os';
import { join } from 'path';

const constantsPath = join(
  process.cwd(),
  'docs/fuels-wallet/packages/docs/src/constants.ts'
);
const nightlyConstantsPath =
  'docs/nightly/fuels-wallet/packages/docs/src/constants.ts';

const downloadVarName = 'DOWNLOAD_LINK';

function getWalletVersion(isNightly) {
  const file = readFileSync(
    join(
      process.cwd(),
      `docs/${
        isNightly ? 'nightly/' : ''
      }fuels-wallet/packages/app/package.json`
    ),
    'utf-8'
  );
  const json = JSON.parse(file);
  return json.version;
}

function handleConstantsFile(filePath, isNightly) {
  const file = readFileSync(filePath, 'utf8');

  let lines = file.split(EOL);
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

  const walletVersion = getWalletVersion(isNightly);

  if (start !== undefined && end !== undefined && walletVersion) {
    let modifiedContent = `export const DOWNLOAD_LINK = 'https://next-wallet.fuel.network/app/fuel-wallet-${walletVersion}.zip';`;
    lines.splice(start, end - start + 1, modifiedContent);
    const newFileContent = lines.join(EOL);
    writeFileSync(filePath, newFileContent, 'utf8');

    console.log('File modified successfully');
  } else {
    console.log('Variable definition not found or incomplete.');
  }
}

export default function patchFixWalletDownloadLink() {
  handleConstantsFile(constantsPath, false);
  handleConstantsFile(nightlyConstantsPath, true);
}
