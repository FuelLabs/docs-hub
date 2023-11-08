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
  const allLatestNavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-latest-orders.json`
  );
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allLatestNavs = JSON.parse(readFileSync(allLatestNavsPath, 'utf8'));
  const versions = getVersions(false);
  const latestVersions = getVersions(true);

  return {
    props: {
      allNavs,
      allLatestNavs,
      code,
      md: doc.md,
      doc: doc.item,
      links: doc.sidebarLinks(slug),
      docLink: doc.navLinks,
      versions,
      latestVersions,
    },
  };
};
