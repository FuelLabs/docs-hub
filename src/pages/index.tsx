import { Layout } from '../components/Layout';
import { DocProvider } from '../hooks/useDocContext';
import { HomePage } from '../screens/HomePage';

export default function Home({ theme }: { theme: string }) {
  return (
    <DocProvider theme={theme}>
      <Layout title="Fuel Docs" isClean theme={theme}>
        <HomePage />
      </Layout>
    </DocProvider>
  );
}
