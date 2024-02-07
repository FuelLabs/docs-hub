import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import { allMdDocs } from '../../.contentlayer/generated';
import { DOCS_DIRECTORY } from '../config/constants';
import { Doc } from '../lib/md-doc';
import { getVersions } from '../lib/versions';

import type { DocPageProps } from './[...slug]';
import DocPage from './[...slug]';

export default function HomePage(props: DocPageProps) {
  return <DocPage {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const slugArray = ['docs', 'intro', 'what-is-fuel'];
  const doc = new Doc(slugArray, allMdDocs);
  const slug = slugArray.join('/');
  const code = await doc.getCode();
  const allNavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-orders.json`
  );
  const allnightlyNavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-nightly-orders.json`
  );
  const allBeta4NavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-beta-4-orders.json`
  );
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allnightlyNavs = JSON.parse(readFileSync(allnightlyNavsPath, 'utf8'));
  const allBeta4Navs = JSON.parse(readFileSync(allBeta4NavsPath, 'utf8'));
  const versions = getVersions('default');
  const nightlyVersions = getVersions('nightly');
  const beta4Versions = getVersions('beta-4');

  return {
    props: {
      allNavs,
      allnightlyNavs,
      allBeta4Navs,
      code,
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
