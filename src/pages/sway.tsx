import { Layout } from '../components/Layout';
import { SwayScreen } from '../screens/SwayPage';

interface SwayProps {
  theme: string;
}

export default function Sway({ theme }: SwayProps) {
  return (
    <Layout title="Sway Language" theme={theme}>
      <SwayScreen />
    </Layout>
  );
}
