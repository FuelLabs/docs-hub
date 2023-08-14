import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type ReactNode } from 'react';

import type { Config } from '../types';

import { Header } from './Header';

type LayoutProps = {
  title?: string;
  children: ReactNode;
  isClean?: boolean;
  hasHeadings?: boolean;
  config?: Config;
  theme?: string;
  category?: string | undefined;
};

export function Layout({
  title,
  children,
  isClean,
  hasHeadings,
  config,
}: LayoutProps) {
  const router = useRouter();

  const titleText =
    title && router.pathname !== '/'
      ? `${title[0].toUpperCase()}${title.slice(1)} | Fuel Docs`
      : 'Fuel Docs';

  function getSlug() {
    return router.pathname === '/guides' ? 'guides' : '';
  }

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta
          name="description"
          content={
            config && config?.ogTags?.description !== ''
              ? config?.ogTags?.description
              : 'Fuel Network Docs'
          }
          key="desc"
        />
        <meta property="og:title" content={titleText} />
        <meta
          property="og:description"
          content={
            config && config?.ogTags?.description !== ''
              ? config?.ogTags?.description
              : 'Official documentation for the Fuel Network'
          }
        />
        <meta
          property="og:image"
          content={
            config && config?.ogTags?.image !== ''
              ? config?.ogTags?.image
              : '/images/Fuel_Network.png'
          }
        />
      </Head>
      <Box
        css={styles.root}
        data-headings={hasHeadings}
        data-clean={Boolean(isClean)}
      >
        <Header
          active={config?.slug ? config.slug : getSlug()}
          title={config?.title}
        />
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
    gridTemplateRows: '70px auto',

    '@xl': {
      display: 'grid',

      '&[data-clean="false"]': {
        gridTemplateColumns: '250px 1fr 220px',
        gridColumnGap: '$24',

        '& .Layout--section': {
          maxWidth: 'calc(100vw - 662px)',
        },

        '&[data-headings="false"]': {
          gridTemplateColumns: '250px 1fr',

          '& .Layout--section': {
            maxWidth: 'calc(100vw - 442px)',
          },
        },
      },
      '&[data-clean="true"]': {
        gridTemplateColumns: '1fr',

        '& .Layout--section': {
          px: '$14',
        },
      },
    },

    '& .Layout--section a, & .Layout--section a:visited': {
      color: 'currentColor',
    },

    '& .Layout--section *:first-child': {
      mt: '$0',
    },
  }),
};
