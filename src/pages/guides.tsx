import type { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';

import { Layout } from '../components/Layout';
import useTheme from '../hooks/useTheme';
import { useVersion } from '../hooks/useVersion';
import { GuidesPage } from '../screens/GuidesPage';

import { getProps } from './index';

export interface GuideInfo {
  title: string;
  description: string;
  last_updated: string;
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
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLatest = mounted && version === 'Latest';

  return (
    <Layout title="Fuel Guides" isClean theme={theme} isLatest={isLatest}>
      <GuidesPage isLatest={isLatest} guides={guides} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const { guides, allNavs, allLatestNavs } = getProps();
  return { props: { guides, allNavs, allLatestNavs } };
};
