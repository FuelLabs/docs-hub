import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import type { MdDoc } from '../../.contentlayer/generated';
import { allMdDocs } from '../../.contentlayer/generated';
import { DOCS_DIRECTORY } from '../config/constants';
import useTheme from '../hooks/useTheme';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';
import { getVersions } from '../lib/versions';
import { DocScreen } from '../screens/DocPage';
import type { DocType, SidebarLinkItem } from '../types';

import type { NavOrder } from './index';

export type VersionItem = {
  version: string;
  name: string;
  category: string;
  url: string;
};

export type Versions = {
  Forc: VersionItem;
  Sway: VersionItem;
  Fuelup: VersionItem;
  Indexer: VersionItem;
  'Fuel Rust SDK': VersionItem;
  'Fuel TS SDK': VersionItem;
  'Fuel Wallet': VersionItem;
};

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
  const versions = getVersions(doc.item.isLatest);

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
    },
  };
};
