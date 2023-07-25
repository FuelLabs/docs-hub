import { getCookie, setCookie } from 'cookies-next';
import { readFileSync } from 'fs';
import type { GetServerSideProps } from 'next';
import { join } from 'path';

import { Layout } from '../components/Layout';
import { DEFAULT_THEME, DOCS_DIRECTORY } from '../constants';
import { DocProvider } from '../hooks/useDocContext';
import { GuidesPage } from '../screens/GuidesPage';

export interface GuideInfo {
  title: string;
  description: string;
}

interface GuidesProps {
  guides: { [key: string]: GuideInfo };
  theme: string;
}

export default function Guides({ theme, guides }: GuidesProps) {
  return (
    <DocProvider theme={theme}>
      <Layout title="Fuel Guides" isClean theme={theme}>
        <GuidesPage guides={guides} />
      </Layout>
    </DocProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  const guidesPath = join(DOCS_DIRECTORY, `../guides/guides.json`);
  const guides = JSON.parse(readFileSync(guidesPath, 'utf8'));

  const theme = getCookie('theme', ctx);
  if (!theme) {
    setCookie('theme', DEFAULT_THEME, ctx);
  }

  return { props: { theme: theme || DEFAULT_THEME, guides } };
};
