import { FuelProvider } from '@fuels/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import '../styles/docsearch.css';
import '../styles/index.css';

import { FuelWalletConnector, FueletWalletConnector } from '@fuels/connectors';
import { Provider } from '../components/Provider';
import { ShowWarningProvider } from '../hooks/useShowWarning';
import { VersionProvider } from '../hooks/useVersion';
import AskCookbook from '@cookbookdev/docsbot/react';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <FuelProvider
        fuelConfig={{
          connectors: [new FuelWalletConnector(), new FueletWalletConnector()],
        }}
      >
        <VersionProvider>
          <ShowWarningProvider>
            <Provider>
              <style jsx global>{`
                :root {
                  --fonts-sans: system-ui, 'Inter', sans-serif;
                  --fonts-display: system-ui, 'Inter', sans-serif;
                  --fonts-mono: 'Inconsolata';
                }
              `}</style>
              <Component {...pageProps} />
              <AskCookbook apiKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWYwZGRiNTc0YWNiMmU0NWFmOThiYjYiLCJpYXQiOjE3MTAyODQyMTMsImV4cCI6MjAyNTg2MDIxM30.WxJO7NrRekz6OCWb2wa8gZeFEfRfUM48Ks0GKqScVXo" />
              <Analytics />
            </Provider>
          </ShowWarningProvider>
        </VersionProvider>
      </FuelProvider>
    </QueryClientProvider>
  );
}
