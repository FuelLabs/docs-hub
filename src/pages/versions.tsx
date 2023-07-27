import type { GetStaticProps } from 'next';

import { Layout } from '../components/Layout';
import useTheme from '../hooks/useTheme';
import { getVersions } from '../lib/versions';
import type { VersionsPageProps } from '../screens/VersionsPage';
import { VersionPage } from '../screens/VersionsPage';

type PageProps = VersionsPageProps;

export default function Versions({ versions }: PageProps) {
  const { theme } = useTheme();
  return (
    <Layout title="Fuel Docs" isClean theme={theme}>
      <VersionPage versions={versions} />
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaticProps: GetStaticProps<any> = async () => {
  const versions = await getVersions();

  return { props: { versions } };
};
