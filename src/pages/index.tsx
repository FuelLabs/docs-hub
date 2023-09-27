import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';
import { useState, useEffect } from 'react';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import { useVersion } from '../hooks/useVersion';
import { HomePage } from '../screens/HomePage';

import type { GuidesProps } from './guides';

interface HomeProps extends GuidesProps {
  theme: string;
}

export default function Home({ theme, guides }: HomeProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);
  const version = useVersion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLatest = mounted && version === 'latest';

  return (
    <Layout title="Fuel Docs" isClean theme={theme} isLatest={isLatest}>
      <HomePage guides={guides} isLatest={isLatest} />
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
