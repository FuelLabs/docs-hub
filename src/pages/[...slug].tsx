import type { GetStaticProps } from 'next';

import type { MdDoc } from '../../.contentlayer/generated';
import { allMdDocs } from '../../.contentlayer/generated';
import useTheme from '../hooks/useTheme';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';
import { getVersions } from '../lib/versions';
import { DocScreen } from '../screens/DocPage';
import type { DocType, SidebarLinkItem } from '../types';

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
  code: string;
  md: MdDoc;
  doc: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
  theme: string;
  versions: Versions;
  isLatest: boolean;
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
  const isLatest = slug.includes('/latest/');
  const versions = await getVersions(isLatest);
  return {
    props: {
      code,
      md: doc.md,
      doc: doc.item,
      links: doc.sidebarLinks(slug),
      docLink: doc.navLinks,
      versions,
      isLatest,
    },
  };
};
