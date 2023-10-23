// import fs from 'fs';

main();

function main() {
  console.log('DEPLOYMENT STATE:', process.argv[2]);
  console.log('DEPLOYMENT URL:', process.argv[3]);
  //   const previewURL = process.argv[2];
  //   console.log('PREVIEW URL:', previewURL);
  //   const configPath = './mlc-config-test.json';
  //   const configFile = fs.readFileSync(configPath, 'utf-8');
  //   const newContent = configFile.replace('{{VERCEL_PREVIEW}}', previewURL);
  //   fs.writeFileSync(configPath, newContent);
}
