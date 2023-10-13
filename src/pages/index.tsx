import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';
import { useEffect, useState } from 'react';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import { useVersion } from '../hooks/useVersion';
import { HomeScreen } from '../screens/HomePage';

import type { GuideInfo } from './guides';

export interface NavOrder {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links: any[];
}

interface HomeProps {
  theme: string;
  guides: { [key: string]: GuideInfo };
  allNavs: NavOrder[];
  allLatestNavs: NavOrder[];
}

export default function Home({
  theme,
  guides,
  allNavs,
  allLatestNavs,
}: HomeProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);
  const version = useVersion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLatest = mounted && version === 'Latest';
  const navs = isLatest ? allLatestNavs : allNavs;
  return (
    <Layout allNavs={navs} title="Fuel Docs" theme={theme} isLatest={isLatest}>
      <HomeScreen guides={guides} allNavs={navs} isLatest={isLatest} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = () => {
  const guidesPath = join(DOCS_DIRECTORY, `./guides/docs/guides.json`);
  const allNavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-orders.json`
  );
  const allLatestNavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-latest-orders.json`
  );
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allLatestNavs = JSON.parse(readFileSync(allLatestNavsPath, 'utf8'));
  return { props: { guides, allNavs, allLatestNavs } };
};
