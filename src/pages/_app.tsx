import '../styles/index.css';
import '../styles/docsearch.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import { Inter, Source_Code_Pro } from 'next/font/google';

import { Provider } from '../components/Provider';
import { VersionProvider } from '../hooks/useVersion';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const inconsolata = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-inconsolata',
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <VersionProvider>
        <Provider>
          <style jsx global>{`
            :root {
              --fonts-sans: ${inter.style.fontFamily};
              --fonts-display: ${inter.style.fontFamily};
              --fonts-mono: ${inconsolata.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
          <Analytics />
        </Provider>
      </VersionProvider>
    </QueryClientProvider>
  );
}
