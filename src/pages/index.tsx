import { Layout } from '../components/Layout';
import { HomeScreen } from '../screens/HomePage';

export default function Home({ theme }: { theme: string }) {
  return (
    <Layout title="Fuel Docs" theme={theme}>
      <HomeScreen />
    </Layout>
  );
}
