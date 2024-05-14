import { join } from 'path';
import type { GetStaticProps } from 'next';

import { existsSync, readFileSync, writeFileSync } from 'fs';
import type { MdDoc } from '../../.contentlayer/generated';
import { allMdDocs } from '../../.contentlayer/generated';
import { DOCS_DIRECTORY } from '../config/constants';
import useTheme from '../hooks/useTheme';
import { getNavs } from '../lib/getNavs';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';
import {
  getAllVersions,
  getFuelCoreVersion,
  getNodeVersion,
} from '../lib/versions';
import { DocScreen } from '../screens/DocPage';
import type { DocType, NavOrder, SidebarLinkItem, Versions } from '../types';

export type DocPageProps = {
  allNavs: NavOrder[];
  allNightlyNavs: NavOrder[];
  allBeta5Navs: NavOrder[];
  codeLight?: string;
  codeDark?: string;
  md?: MdDoc;
  doc?: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
  theme: string;
  versions: Versions;
  nightlyVersions: Versions;
  beta5Versions: Versions;
  fuelCoreVersion?: string;
  nodeVersion?: string;
  nodeVersionMax?: string;
  isGuide: boolean;
  guides?: { [key: string]: GuideInfo };
};

export interface GuideInfo {
  title: string;
  description: string;
  featured: boolean;
  tags: string[];
}

export default function DocPage(props: DocPageProps) {
  const { theme } = useTheme();
  return <DocScreen {...props} theme={theme} />;
}

export function getStaticPaths() {
  const paths = Docs.getAllPaths(allMdDocs);
  paths.push({ params: { slug: ['guides'], path: '/guides' } });
  return { paths, fallback: false };
}

// biome-ignore lint/suspicious/noExplicitAny:
export const getStaticProps: GetStaticProps<any> = async ({ params }) => {
  const slugArray = params?.slug as string[];
  const slug = slugArray.join('/');
  const { allNavs, allNightlyNavs, allBeta5Navs } = getNavs();
  const { versions, nightlyVersions } = getAllVersions();

  if (slug === 'guides') {
    const guidesPath = join(DOCS_DIRECTORY, './guides/docs/guides.json');
    const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));
    return {
      props: {
        guides,
        allNavs,
        allNightlyNavs,
        allBeta5Navs,
        versions,
        nightlyVersions,
      },
    };
  }
  const doc = new Doc(slugArray, allMdDocs);
  const { light, dark } = await doc.getCode();

  let fuelCoreVersion = null;
  let nodeVersion = null;
  let nodeVersionMax = null;

  const isGuide = slug.startsWith('guides/');
  if (isGuide) {
    fuelCoreVersion = getFuelCoreVersion();
    nodeVersion = getNodeVersion().substring(1);
    const majorVersionMax = Number.parseInt(nodeVersion.substring(0, 2)) + 1;
    nodeVersionMax = `${majorVersionMax}.0.0`;
  }

  return {
    props: {
      allNavs,
      allNightlyNavs,
      allBeta5Navs,
      codeLight: light,
      codeDark: dark,
      md: doc.md,
      doc: doc.item,
      links: doc.sidebarLinks(slug),
      docLink: doc.navLinks,
      versions,
      nightlyVersions,
      fuelCoreVersion,
      nodeVersion,
      nodeVersionMax,
      isGuide,
    },
  };
};
