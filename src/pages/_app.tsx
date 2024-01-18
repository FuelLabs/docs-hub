import '../styles/index.css';
import '../styles/docsearch.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

import { Provider } from '../components/Provider';
import { VersionProvider } from '../hooks/useVersion';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <VersionProvider>
        <Provider>
        <style jsx global>{`
          :root {
            --fonts-sans: 'Inter', system-ui, sans-serif;
            --fonts-display: 'Inter', system-ui, sans-serif;
            --fonts-mono: 'Inconsolata';
          }
        `}</style>
          <Component {...pageProps} />
          <Analytics />
        </Provider>
      </VersionProvider>
    </QueryClientProvider>
  );
}
