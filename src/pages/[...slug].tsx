import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import type { MdDoc } from '../../.contentlayer/generated';
import { allMdDocs } from '../../.contentlayer/generated';
import { DOCS_DIRECTORY } from '../config/constants';
import useTheme from '../hooks/useTheme';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';
import { getFuelCoreVersion, getVersions } from '../lib/versions';
import { DocScreen } from '../screens/DocPage';
import type { DocType, NavOrder, SidebarLinkItem, Versions } from '../types';

export type DocPageProps = {
  allNavs: NavOrder[];
  allLatestNavs: NavOrder[];
  code: string;
  md: MdDoc;
  doc: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
  theme: string;
  versions: Versions;
  latestVersions: Versions;
  fuelCoreVersion?: string;
};

export default function DocPage(props: DocPageProps) {
  const { theme } = useTheme();
  return <DocScreen {...props} theme={theme} />;
}

export function getStaticPaths() {
  const paths = Docs.getAllPaths(allMdDocs);
  return { paths, fallback: false };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const slugArray = params?.slug as string[];
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
  let fuelCoreVersion;

  if (slug.includes('guides/')) {
    fuelCoreVersion = getFuelCoreVersion();
  }

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
      fuelCoreVersion,
    },
  };
};
