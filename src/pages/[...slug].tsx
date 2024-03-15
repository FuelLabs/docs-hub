import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import type { MdDoc } from '../../.contentlayer/generated';
import { allMdDocs } from '../../.contentlayer/generated';
import { DOCS_DIRECTORY } from '../config/constants';
import useTheme from '../hooks/useTheme';
import { Doc } from '../lib/md-doc';
import { Docs } from '../lib/md-docs';
import {
  getFuelCoreVersion,
  getVersions,
  getNodeVersion,
} from '../lib/versions';
import { DocScreen } from '../screens/DocPage';
import type { DocType, NavOrder, SidebarLinkItem, Versions } from '../types';
import type { FuelnautLevel } from '../config/fuelnautLevels';
import { LEVELS_CONFIG } from '../config/fuelnautLevels';
import type { JsonAbi } from 'fuels';

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
  fuelnautProps: FuelnautProps;
};

interface FuelnautProps {
  level: FuelnautLevel;
  abiJSON: JsonAbi;
  base64Bytecode: string;
}

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
  let fuelCoreVersion = null;
  let nodeVersion = null;
  let nodeVersionMax = null;

  if (slug.includes('guides/') || slug.includes('/intro/quickstart')) {
    fuelCoreVersion = getFuelCoreVersion();
    nodeVersion = getNodeVersion().substring(1);
    const majorVersionMax = parseInt(nodeVersion.substring(0, 2)) + 1;
    nodeVersionMax = `${majorVersionMax}.0.0`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fuelnautProps: any = {};

  if (slug.includes('guides/fuelnaut/')) {
    const levelKey = slugArray[slugArray.length - 1];
    const level = LEVELS_CONFIG[levelKey];
    fuelnautProps.level = level;
    const fuelnautPath = join(DOCS_DIRECTORY, `guides/examples/fuelnaut`);
    const byteCodePath = join(
      fuelnautPath,
      `${levelKey}/out/debug/${levelKey}.bin`
    );
    const bytecode = readFileSync(byteCodePath);
    const abiJSONPath = join(
      fuelnautPath,
      `${levelKey}/out/debug/${levelKey}-abi.json`
    );
    fuelnautProps.abiJSON = JSON.parse(readFileSync(abiJSONPath, 'utf8'));

    fuelnautProps.base64Bytecode = bytecode.toString('base64');
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
      fuelnautProps: fuelnautProps as FuelnautProps,
    },
  };
};
