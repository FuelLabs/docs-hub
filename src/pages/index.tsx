import { Layout } from '../components/Layout';
import { HomeScreen } from '../screens/HomePage';

interface HomeProps {
  theme: string;
}

export default function Home({ theme }: HomeProps) {
  return (
    <Layout title="Fuel Docs" theme={theme}>
      <HomeScreen />
    </Layout>
  );
}
