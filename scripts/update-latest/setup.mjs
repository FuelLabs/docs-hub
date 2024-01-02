import { setupUser } from './gitUtils.mjs';

export async function setup() {
  // setup git
  await setupUser();
}
