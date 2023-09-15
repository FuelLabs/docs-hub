import { readFileSync } from 'fs';
import type { GetStaticProps } from 'next';
import { join } from 'path';

import { Layout } from '../../components/Layout';
import { DOCS_DIRECTORY } from '../../config/constants';
import useTheme from '../../hooks/useTheme';
import { GuidesPage } from '../../screens/GuidesPage';

export interface GuideInfo {
  title: string;
  description: string;
}

export interface GuidesProps {
  guides: { [key: string]: GuideInfo };
  isLatest: boolean;
}

export default function Guides({ guides, isLatest }: GuidesProps) {
  const { theme } = useTheme();
  return (
    <Layout title="Fuel Guides" isClean theme={theme} isLatest={isLatest}>
      <GuidesPage isLatest={isLatest} guides={guides} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const guidesPath = join(DOCS_DIRECTORY, `./guides/docs/guides.json`);
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));

  return { props: { guides, isLatest: false } };
};
