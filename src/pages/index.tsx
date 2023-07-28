import { Layout } from '../components/Layout';
import { HomePage } from '../screens/HomePage';

export default function Home({ theme }: { theme: string }) {
  return (
    <Layout title="Fuel Docs" isClean theme={theme}>
      <HomePage />
    </Layout>
  );
}
