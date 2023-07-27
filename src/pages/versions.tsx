import { Layout } from '../components/Layout';
import useTheme from '../hooks/useTheme';
import type { VersionsPageProps } from '../screens/VersionsPage';
import { VersionPage } from '../screens/VersionsPage';

type PageProps = VersionsPageProps;

export default function Versions({ versions }: PageProps) {
  const { theme = 'light' } = useTheme();
  return (
    <Layout title="Fuel Docs" isClean theme={theme}>
      <VersionPage versions={versions} />
    </Layout>
  );
}
