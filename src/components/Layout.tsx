import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import { useDocContext } from '../hooks/useDocContext';

import { Header } from './Header';

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: LayoutProps) {
  const { doc } = useDocContext();
  const router = useRouter();
  const titleText = title ? `${title} | Fuel Docs` : 'Fuel Docs';
  // TODO: make this dynamic using the doc config
  const slug = () => {
    switch (router.asPath) {
      case '/':
        return 'portal';
        break;
      case '/docs/portal/':
        return 'portal';
        break;
      case '/docs/sway/':
        return 'sway';
        break;
      case '/docs/fuels-rs/':
        return 'fuels-rs';
        break;
      case '/docs/graphql/':
        return 'graphql';
        break;
      default:
        return 'portal';
    }
  };
  const docsConfig = doc.docsConfig[slug()] || {};

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta
          name="description"
          content={docsConfig?.ogTags?.description}
          key="desc"
        />
        <meta property="og:title" content={titleText} />
        <meta
          property="og:description"
          content={docsConfig?.ogTags?.description}
        />
        <meta property="og:image" content={docsConfig?.ogTags?.image} />
      </Head>
      <Box css={styles.root}>
        <Header title={docsConfig?.title} />
        {children}
      </Box>
    </>
  );
}

const styles = {
  root: cssObj({
    maxW: '100vw',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '80px auto',

    '@xl': {
      gridTemplateColumns: '0.75fr 2.5fr 0.75fr',
      gridTemplateRows: '80px auto',
      gridColumnGap: '$14',
    },
  }),
};
