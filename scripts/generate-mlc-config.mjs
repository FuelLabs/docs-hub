import fs from 'fs';

main();

function main() {
  const configPath = './mlc-config-test.json';
  const branchName = process.argv[2].replaceAll('/', '-').toLowerCase();
  console.log('BRANCH NAME:', branchName);
  const configFile = fs.readFileSync(configPath, 'utf-8');
  const newContent = configFile.replace('{{BRANCH}}', branchName);
  fs.writeFileSync(configPath, newContent);
}
