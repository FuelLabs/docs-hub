import { readFileSync } from 'fs';
import { join } from 'path';
import type { GetStaticProps } from 'next';

import type { MdDoc } from '../../.contentlayer/generated';
import { allMdDocs } from '../../.contentlayer/generated';
import { DOCS_DIRECTORY } from '../config/constants';
import useTheme from '../hooks/useTheme';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';
import {
  getFuelCoreVersion,
  getNodeVersion,
  getVersions,
} from '../lib/versions';
import { DocScreen } from '../screens/DocPage';
import type { DocType, NavOrder, SidebarLinkItem, Versions } from '../types';

export type DocPageProps = {
  allNavs: NavOrder[];
  allnightlyNavs: NavOrder[];
  allBeta4Navs: NavOrder[];
  code: string;
  md: MdDoc;
  doc: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
  theme: string;
  versions: Versions;
  nightlyVersions: Versions;
  beta4Versions: Versions;
  fuelCoreVersion?: string;
  nodeVersion?: string;
  nodeVersionMax?: string;
};

export default function DocPage(props: DocPageProps) {
  const { theme } = useTheme();
  return <DocScreen {...props} theme={theme} />;
}

export function getStaticPaths() {
  const paths = Docs.getAllPaths(allMdDocs);
  return { paths, fallback: false };
}

// biome-ignore lint/suspicious/noExplicitAny:
export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const slugArray = params?.slug as string[];
  const doc = new Doc(slugArray, allMdDocs);
  const slug = slugArray.join('/');
  const code = await doc.getCode();
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
  const allnightlyNavs = JSON.parse(readFileSync(allnightlyNavsPath, 'utf8'));
  const allBeta4Navs = JSON.parse(readFileSync(allBeta4NavsPath, 'utf8'));
  const versions = getVersions('default');
  const nightlyVersions = getVersions('nightly');
  const beta4Versions = getVersions('beta-4');
  let fuelCoreVersion = null;
  let nodeVersion = null;
  let nodeVersionMax = null;

  if (slug.includes('guides/') || slug.includes('/intro/quickstart')) {
    fuelCoreVersion = getFuelCoreVersion();
    nodeVersion = getNodeVersion().substring(1);
    const majorVersionMax = Number.parseInt(nodeVersion.substring(0, 2)) + 1;
    nodeVersionMax = `${majorVersionMax}.0.0`;
  }

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
      fuelCoreVersion,
      nodeVersion,
      nodeVersionMax,
    },
  };
};
