import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';
import { useState, useEffect } from 'react';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import useTheme from '../hooks/useTheme';
import { useVersion } from '../hooks/useVersion';
import { GuidesPage } from '../screens/GuidesPage';

export interface GuideInfo {
  title: string;
  description: string;
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

  const isLatest = mounted && version === 'latest';

  return (
    <Layout title="Fuel Guides" isClean theme={theme} isLatest={isLatest}>
      <GuidesPage isLatest={isLatest} guides={guides} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `./guides/docs/guides.json`);
  // const latestGuidesPath = join(
  //   LATEST_DOCS_DIRECTORY,
  //   `./guides/docs/guides.json`
  // );
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));
  // const latestGuides = JSON.parse(readFileSync(latestGuidesPath, 'utf8'));

  return { props: { guides } };
};
