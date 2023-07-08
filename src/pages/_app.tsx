/* eslint-disable @typescript-eslint/no-explicit-any */
import '../styles/index.css';
import '../styles/docsearch.css';
import 'plyr-react/plyr.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { CookiesProvider } from 'react-cookie';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

import { Provider } from '../components/Provider';

export default function App({ Component, pageProps }: AppProps) {
  const cookies = (Component as any).universalCookies;
  return (
    <CookiesProvider cookies={cookies}>
      <Provider theme={pageProps.theme || 'dark'}>
        <style jsx global>{`
          :root {
            --fonts-sans: ${inter.style.fontFamily};
            --fonts-display: ${inter.style.fontFamily};
          }
        `}</style>
        <Component {...pageProps} />
      </Provider>
    </CookiesProvider>
  );
}
