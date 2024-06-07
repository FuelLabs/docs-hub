import { join } from 'path';
import type { GetStaticProps } from 'next';

import { readFileSync } from 'fs';
import type { JsonAbi } from 'fuels';
import { allMdDocs } from '~/.contentlayer/generated/index';
import type { MdDoc } from '~/.contentlayer/generated/types';
import { DOCS_DIRECTORY } from '../config/constants';
import type { IFuelnautLevel } from '../config/fuelnautLevels';
import { LEVELS_CONFIG } from '../config/fuelnautLevels';
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
  codeLight?: string;
  codeDark?: string;
  md?: MdDoc;
  doc?: DocType;
  links: SidebarLinkItem[];
  docLink?: SidebarLinkItem;
  theme: string;
  versions: Versions;
  nightlyVersions: Versions;
  fuelCoreVersion?: string;
  nodeVersion?: string;
  nodeVersionMax?: string;
  fuelnautProps: FuelnautProps;
  isGuide: boolean;
  guides?: { [key: string]: GuideInfo };
};

export interface GuideInfo {
  title: string;
  description: string;
  featured: boolean;
  tags: string[];
}

interface FuelnautProps {
  level: IFuelnautLevel;
  abiJSON: JsonAbi;
  base64Bytecode: string;
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
  const { allNavs, allNightlyNavs } = getNavs();
  const { versions, nightlyVersions } = getAllVersions();

  if (slug === 'guides') {
    const guidesPath = join(DOCS_DIRECTORY, './guides/docs/guides.json');
    const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));
    return {
      props: {
        guides,
        allNavs,
        allNightlyNavs,
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

  // biome-ignore lint/suspicious/noExplicitAny:
  const fuelnautProps: any = {};

  if (slug.includes('guides/fuelnaut/')) {
    const levelKey = slugArray[slugArray.length - 1];
    const level = LEVELS_CONFIG[levelKey];
    fuelnautProps.level = level;
    const fuelnautPath = join(DOCS_DIRECTORY, 'guides/examples/fuelnaut');
    const byteCodePath = join(
      fuelnautPath,
      `${levelKey}/out/debug/${levelKey}.bin`,
    );
    const bytecode = readFileSync(byteCodePath);
    const abiJSONPath = join(
      fuelnautPath,
      `${levelKey}/out/debug/${levelKey}-abi.json`,
    );
    fuelnautProps.abiJSON = JSON.parse(readFileSync(abiJSONPath, 'utf8'));

    fuelnautProps.base64Bytecode = bytecode.toString('base64');
  }

  return {
    props: {
      allNavs,
      allNightlyNavs,
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
      fuelnautProps: fuelnautProps as FuelnautProps,
      isGuide,
    },
  };
};
