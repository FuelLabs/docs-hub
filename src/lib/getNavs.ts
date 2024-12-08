import { readFileSync } from 'fs';
import { join } from 'path';
import { DOCS_DIRECTORY } from '../config/constants';

export class NavsSingleton {
  static #instance: NavsSingleton;
  #navs: { allNavs: any; allNightlyNavs: any };

  private constructor() {
    this.#navs = getGeneratedNavs();
  }

  public static get instance(): NavsSingleton {
    if (!NavsSingleton.#instance) {
      NavsSingleton.#instance = new NavsSingleton();
    }

    return NavsSingleton.#instance;
  }

  public getNavs() {
    return this.#navs;
  }
}

export function getGeneratedNavs() {
  const allNavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-orders.json'
  );
  const allnightlyNavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-nightly-orders.json'
  );
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allNightlyNavs = JSON.parse(readFileSync(allnightlyNavsPath, 'utf8'));

  return { allNavs, allNightlyNavs };
}
