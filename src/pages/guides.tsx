import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';
import { useState, useEffect } from 'react';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY, FUEL_TESTNET_UPPER_CASE } from '../config/constants';
import { useVersion } from '../hooks/useVersion';
import { GuidesPage } from '../screens/GuidesPage';
import type { NavOrder, VersionSet, Versions } from '../types';
import { getNavs } from '../lib/getNavs';
import { getActiveNav } from '../lib/getActiveNav';
import { getAllVersions } from '../lib/versions';

export interface GuideInfo {
  title: string;
  description: string;
  featured: boolean;
  tags: string[];
}

export interface GuidesProps {
  guides: { [key: string]: GuideInfo };
  allNavs: NavOrder[];
  allNightlyNavs: NavOrder[];
  allBeta4Navs: NavOrder[];
  versions: Versions;
  nightlyVersions: Versions;
  beta4Versions: Versions;
}

export default function Guides({
  guides,
  allNavs,
  allNightlyNavs,
  allBeta4Navs,
  versions,
  nightlyVersions,
  beta4Versions,
}: GuidesProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);
  const version = useVersion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  let versionSet: VersionSet = 'default';
  if (mounted && version !== FUEL_TESTNET_UPPER_CASE) {
    if (version === 'Nightly') {
      versionSet = 'nightly';
    } else {
      versionSet = 'beta-4';
    }
  }

  let activeVersions = versions;
  if (versionSet !== 'default') {
    if (versionSet === 'nightly') {
      activeVersions = nightlyVersions;
    } else {
      activeVersions = beta4Versions;
    }
  }

  const navs = getActiveNav(versionSet, allNavs, allNightlyNavs, allBeta4Navs);

  return (
    <Layout
      title="Fuel Guides"
      versionSet={versionSet}
      allNavs={navs}
      versions={activeVersions}
    >
      <GuidesPage versionSet={versionSet} guides={guides} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `./guides/docs/guides.json`);

  const { allNavs, allNightlyNavs, allBeta4Navs } = getNavs();
  const { versions, nightlyVersions, beta4Versions } = getAllVersions();

  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));
  return {
    props: {
      guides,
      allNavs,
      allNightlyNavs,
      allBeta4Navs,
      versions,
      nightlyVersions,
      beta4Versions,
    },
  };
};
