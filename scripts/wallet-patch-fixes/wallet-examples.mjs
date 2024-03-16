import fs from 'fs';
import path from 'path';

const examplesPath = './docs/fuels-wallet/packages/docs/examples';
const nightlyExamplesPath =
  './docs/nightly/fuels-wallet/packages/docs/examples';
const beta4ExamplesPath = './docs/beta-4/fuels-wallet/packages/docs/examples';

const propToReplace = 'onPress';
const replacementProp = 'onClick';

const pattern = new RegExp(`\\b${propToReplace}\\s*=\\s*\\{([^}]+)\\}`, 'g');
const removeExamplesPattern = /<Examples\.[^\s>]+(\s+[^>]+)?\/>/g;

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(pattern, `${replacementProp}={$1}`);
  if (filePath.includes('/nightly/')) {
    newContent = newContent.replace(removeExamplesPattern, '');
  }
  fs.writeFileSync(filePath, newContent);
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (fileName.endsWith('.tsx')) {
      replaceInFile(filePath);
    }
  });
}

export default function patchFixWalletExamples() {
  processDirectory(examplesPath);
  processDirectory(nightlyExamplesPath);
  processDirectory(beta4ExamplesPath);
}
