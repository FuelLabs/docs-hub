import fs from 'fs';
import path from 'path';

const examplesPath = './docs/fuels-wallet/packages/docs/examples';
const latestExamplesPath = './docs/latest/fuels-wallet/packages/docs/examples';

const propToReplace = 'onPress';
const replacementProp = 'onClick';

const pattern = new RegExp(`\\b${propToReplace}\\s*=\\s*\\{([^}]+)\\}`, 'g');

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(pattern, `${replacementProp}={$1}`);
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

processDirectory(examplesPath);
processDirectory(latestExamplesPath);
