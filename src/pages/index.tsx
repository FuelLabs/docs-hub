import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import { HomePage } from '../screens/HomePage';

import type { GuideInfo } from './guides';

interface HomeProps {
  theme: string;
  guides: { [key: string]: GuideInfo };
}

export default function Home({ theme, guides }: HomeProps) {
  return (
    <Layout title="Fuel Docs" isClean theme={theme}>
      <HomePage guides={guides} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `../docs/guides/docs/guides.json`);
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));

  return { props: { guides } };
};
