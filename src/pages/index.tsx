import { readFileSync } from 'fs';
import { join } from 'path';
import type { GetStaticProps } from 'next';

import { allMdDocs } from '../../.contentlayer/generated';
import { DOCS_DIRECTORY } from '../config/constants';
import { Doc } from '../lib/md-doc';
import { getVersions } from '../lib/versions';

import type { DocPageProps } from './[...slug]';
import DocPage from './[...slug]';

export default function HomePage(props: DocPageProps) {
  return <DocPage {...props} />;
}

// biome-ignore lint/suspicious/noExplicitAny:
export const getStaticProps: GetStaticProps<any> = async () => {
  const slugArray = ['docs', 'intro', 'what-is-fuel'];
  const doc = new Doc(slugArray, allMdDocs);
  const slug = slugArray.join('/');
  const { light, dark } = await doc.getCode();
  const allNavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-orders.json',
  );
  const allnightlyNavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-nightly-orders.json',
  );
  const allBeta4NavsPath = join(
    DOCS_DIRECTORY,
    '../src/generated/sidebar-links/all-beta-4-orders.json',
  );
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allNightlyNavs = JSON.parse(readFileSync(allnightlyNavsPath, 'utf8'));
  const allBeta4Navs = JSON.parse(readFileSync(allBeta4NavsPath, 'utf8'));
  const versions = getVersions('default');
  const nightlyVersions = getVersions('nightly');
  const beta4Versions = getVersions('beta-4');

  return {
    props: {
      allNavs,
      allNightlyNavs,
      allBeta4Navs,
      codeLight: light,
      codeDark: dark,
      md: doc.md,
      doc: doc.item,
      links: doc.sidebarLinks(slug),
      docLink: doc.navLinks,
      versions,
      nightlyVersions,
      beta4Versions,
    },
  };
};
