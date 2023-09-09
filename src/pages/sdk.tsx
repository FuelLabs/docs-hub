import { Layout } from '../components/Layout';
import { SDKScreen } from '../screens/SDKPage';

interface SDKProps {
  theme: string;
}

export default function SDK({ theme }: SDKProps) {
  return (
    <Layout title="SDK" theme={theme}>
      <SDKScreen />
    </Layout>
  );
}
