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
  // nightlyGuides: { [key: string]: GuideInfo };
}

export default function Guides({ guides }: GuidesProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);
  const version = useVersion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isNightly = mounted && version === 'nightly';

  return (
    <Layout title="Fuel Guides" isClean isNightly={isNightly}>
      <GuidesPage isNightly={isNightly} guides={guides} />
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
  const allnightlyNavsPath = join(
    DOCS_DIRECTORY,
    `../src/generated/sidebar-links/all-nightly-orders.json`
  );
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));
  const allNavs = JSON.parse(readFileSync(allNavsPath, 'utf8'));
  const allnightlyNavs = JSON.parse(readFileSync(allnightlyNavsPath, 'utf8'));
  return { props: { guides, allNavs, allnightlyNavs } };
};
