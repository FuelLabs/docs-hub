import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';
import { useState, useEffect } from 'react';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import { useVersion } from '../hooks/useVersion';
import { GuidesPage } from '../screens/GuidesPage';

export interface GuideInfo {
  title: string;
  description: string;
  featured: boolean;
  tags: string[];
}

export interface GuidesProps {
  guides: { [key: string]: GuideInfo };
  // latestGuides: { [key: string]: GuideInfo };
}

export default function Guides({ guides }: GuidesProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);
  const version = useVersion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLatest = mounted && version === 'Latest';

  return (
    <Layout title="Fuel Guides" isClean isLatest={isLatest}>
      <GuidesPage isLatest={isLatest} guides={guides} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
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
