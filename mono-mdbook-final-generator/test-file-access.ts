import * as fs from 'fs';
import * as path from 'path';

const workspaceRoot = path.resolve(__dirname, '..');
const swayFilePath = path.join(workspaceRoot, 'mono-mdbook-final/fuels-ts/src/sway/configurable-pin/src/main.sw');

console.log(`Testing file access for: ${swayFilePath}`);

// Check if the file exists (fs.existsSync)
const exists = fs.existsSync(swayFilePath);
console.log(`File exists (fs.existsSync): ${exists}`);

// Try to access file stats
try {
  const stats = fs.statSync(swayFilePath);
  console.log(`File stats: isFile=${stats.isFile()}, size=${stats.size}, permissions=${stats.mode.toString(8)}`);
} catch (error) {
  console.error(`Error accessing file stats:`, error);
}

// Try to read the file
try {
  const content = fs.readFileSync(swayFilePath, 'utf-8');
  console.log(`File content (first 50 chars): ${content.substring(0, 50)}`);
} catch (error) {
  console.error(`Error reading file:`, error);
}

// Try with fs-extra pathExists and readFile
const fsExtra = require('fs-extra');
async function testFsExtra() {
  try {
    const pathExists = await fsExtra.pathExists(swayFilePath);
    console.log(`File exists (fs-extra pathExists): ${pathExists}`);

    if (pathExists) {
      const content = await fsExtra.readFile(swayFilePath, 'utf-8');
      console.log(`File content (fs-extra, first 50 chars): ${content.substring(0, 50)}`);
    }
  } catch (error) {
    console.error(`Error with fs-extra:`, error);
  }
}

testFsExtra(); 