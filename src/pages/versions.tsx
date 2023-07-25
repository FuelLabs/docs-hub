import { getCookie, setCookie } from 'cookies-next';
import type { GetServerSideProps } from 'next';

import { Layout } from '../components/Layout';
import { DEFAULT_THEME } from '../constants';
import { DocProvider } from '../hooks/useDocContext';
import { getVersions } from '../lib/versions';
import type { VersionsPageProps } from '../screens/VersionsPage';
import { VersionPage } from '../screens/VersionsPage';

type PageProps = VersionsPageProps & {
  theme: string;
};

export default function Versions({ theme, versions }: PageProps) {
  return (
    <DocProvider theme={theme}>
      <Layout title="Fuel Docs" isClean theme={theme}>
        <VersionPage versions={versions} />
      </Layout>
    </DocProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  const theme = getCookie('theme', ctx);
  const versions = await getVersions();
  if (!theme) {
    setCookie('theme', DEFAULT_THEME, ctx);
  }

  return { props: { versions, theme: theme || DEFAULT_THEME } };
};
