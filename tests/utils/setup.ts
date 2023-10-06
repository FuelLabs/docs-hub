import type { Page } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

const START_SERVER_COMMAND = "pnpm pm2 start npm --name 'docs-hub' -- run dev";
const STOP_SERVERS = 'pnpm pm2 delete all';

export async function startServers(page: Page) {
  console.log('STARTING DEV SERVER');
  const startOutput = execSync(START_SERVER_COMMAND, {
    encoding: 'utf-8',
  });
  console.log('START SERVER OUTPUT:', startOutput);
  await page.waitForTimeout(10000);
  console.log('WAITED 10 SECONDS');
}

export function stopServers() {
  const isRunning = checkIfServersRunning();
  if (isRunning) {
    console.log('STOPPING SERVERS');
    // stop & delete pm2 servers
    execSync(STOP_SERVERS, {
      encoding: 'utf-8',
    });
    console.log('DONE STOPPING SERVERS');
  }
}

export function checkIfServersRunning() {
  try {
    const output = execSync('pm2 list --no-color').toString();
    return output.includes('online');
  } catch (error) {
    console.error('Error checking PM2 servers:', error);
    return false;
  }
}

export async function setupFolders(projectFolder: string) {
  console.log('SETTING UP FOLDERS');
  fs.mkdirSync('guides-testing', { recursive: true });
  const projectPath = `guides-testing/${projectFolder}`;
  if (fs.existsSync(projectPath)) {
    await fs.promises.rm(projectPath, {
      recursive: true,
      force: true,
    });
  }
}
