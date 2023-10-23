import fs from 'fs';

main();

const configPath = './mlc-config-test.json';

function main() {
  const deploymentState = process.argv[2];
  console.log('DEPLOYMENT STATE:', deploymentState);
  const deploymentURL = process.argv[3];
  console.log('DEPLOYMENT URL:', deploymentURL);

  if (deploymentState === 'success' && deploymentURL) {
    const configFile = fs.readFileSync(configPath, 'utf-8');
    const newContent = configFile.replace('{{VERCEL_PREVIEW}}', deploymentURL);
    fs.writeFileSync(configPath, newContent);
  } else {
    throw Error('MISSING VERCEL DEPLOYMENT');
  }
}
