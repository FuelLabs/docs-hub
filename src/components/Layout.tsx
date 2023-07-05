import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Head from 'next/head';
import type { ReactNode } from 'react';

import { useDocContext } from '../hooks/useDocContext';

import { Header } from './Header';

type LayoutProps = {
  title?: string;
  children: ReactNode;
};

export function Layout({ title, children }: LayoutProps) {
  const { doc } = useDocContext();
  const titleText = title
    ? `${title[0].toUpperCase()}${title.slice(1)} | Fuel Docs`
    : 'Fuel Docs';
  const docsConfig = doc.docsConfig;

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
    maxWidth: '100vw',
    width: '100vw',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '80px auto',

    '@xl': {
      gridTemplateColumns: '250px auto 220px',
      gridTemplateRows: '80px auto',
      gridColumnGap: '$24',
    },
  }),
};
