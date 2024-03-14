import '../styles/index.css';
import '../styles/docsearch.css';
import { FuelProvider } from '@fuel-wallet/react';
import { FuelProvider as NewFuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';

import { Provider } from '../components/Provider';
import { VersionProvider } from '../hooks/useVersion';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FuelProvider
      fuelConfig={{
        devMode: true,
      }}
    >
      <NewFuelProvider>
        <QueryClientProvider client={queryClient}>
          <VersionProvider>
            <Provider>
              <style jsx global>{`
                :root {
                  --fonts-sans: system-ui, 'Inter', sans-serif;
                  --fonts-display: system-ui, 'Inter', sans-serif;
                  --fonts-mono: 'Inconsolata';
                }
              `}</style>
              <Component {...pageProps} />
              <Analytics />
            </Provider>
          </VersionProvider>
        </QueryClientProvider>
      </NewFuelProvider>
    </FuelProvider>
  );
}
