import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';
import { useState, useEffect } from 'react';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import { useVersion } from '../hooks/useVersion';
import { HomePage } from '../screens/HomePage';

import type { GuideInfo } from './guides';

interface HomeProps {
  theme: string;
  guides: { [key: string]: GuideInfo };
}

export default function Home({ theme, guides }: HomeProps) {
  const [mounted, setIsMounted] = useState<boolean>(false);
  const version = useVersion();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Layout
      title="Fuel Docs"
      isClean
      theme={theme}
      isLatest={mounted && version === 'latest'}
    >
      <HomePage guides={guides} isLatest={mounted && version === 'latest'} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `./guides/docs/guides.json`);
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));

  return { props: { guides } };
};
