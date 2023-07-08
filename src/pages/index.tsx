import { getCookie, setCookie } from 'cookies-next';
import type { GetServerSideProps } from 'next';

import { Layout } from '../components/Layout';
import { DEFAULT_THEME } from '../constants';
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
  const theme = getCookie('theme', ctx);
  if (!theme) {
    setCookie('theme', DEFAULT_THEME, ctx);
  }

  return { props: { theme: theme || DEFAULT_THEME } };
};
