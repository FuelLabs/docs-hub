import '../styles/index.css';
import '../styles/docsearch.css';
import 'plyr-react/plyr.css';
import type { AppProps } from 'next/app';
import { CookiesProvider } from 'react-cookie';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

import { Provider } from '../components/Provider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider cookies={(Component as any).universalCookies}>
      <Provider>
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
