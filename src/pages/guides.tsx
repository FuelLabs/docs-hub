import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import { Layout } from '../components/Layout';
import { DOCS_DIRECTORY } from '../config/constants';
import useTheme from '../hooks/useTheme';
import { GuidesPage } from '../screens/GuidesPage';

export interface GuideInfo {
  title: string;
  description: string;
  last_updated: string;
  featured: boolean;
  tags: string[];
}

export interface GuidesProps {
  guides: { [key: string]: GuideInfo };
}

export default function Guides({ guides }: GuidesProps) {
  const { theme } = useTheme();
  return (
    <Layout title="Fuel Guides" isClean theme={theme}>
      <GuidesPage guides={guides} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `../docs/guides/docs/guides.json`);
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));

  return { props: { guides } };
};
