import { cssObj } from '@fuel-ui/css';
import { Box, Grid } from '@fuel-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type ReactNode } from 'react';

import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';
import type { Config } from '../types';

import { Header } from './Header';
import { SidebarContainer } from './SidebarContainer';

type LayoutProps = {
  title?: string;
  children: ReactNode;
  isClean?: boolean;
  hasHeadings?: boolean;
  config?: Config;
  theme?: string;
  category?: string | undefined;
  isLatest: boolean;
  versions?: Versions;
  allNavs?: NavOrder[];
};

export function Layout({
  title,
  children,
  config,
  isLatest,
  versions,
  allNavs,
}: LayoutProps) {
  const router = useRouter();

  const titleText =
    title && router.pathname !== '/'
      ? `${title[0].toUpperCase()}${title.slice(1)} | Fuel Docs`
      : 'Fuel Docs';

  function getSlug() {
    return router.pathname.includes('/guides') ? 'guides' : '';
  }

  const slug = config?.slug ? config.slug : getSlug();

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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <Box css={styles.root}>
        <Grid css={styles.grid}>
          <Grid.Item>
            <SidebarContainer versions={versions} allNavs={allNavs} />
          </Grid.Item>
          <Grid.Item css={styles.right}>
            <Header
              active={slug}
              title={config?.title}
              isLatest={isLatest}
              versions={versions}
              allNavs={allNavs}
            />
            {children}
          </Grid.Item>
        </Grid>
      </Box>
    </>
  );
}

const styles = {
  root: cssObj({
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }),
  right: cssObj({
    height: '100vh',
    boxSizing: 'border-box',
    overflowX: 'auto',
  }),
  grid: cssObj({
    height: '100vh',
    maxWidth: '1400px',
    gridTemplateColumns: '1fr',
    mx: 'auto',
    boxSizing: 'border-box',

    '& .Layout--section': {
      boxSizing: 'border-box',
      padding: '$8',
      display: 'block',
    },

    '@xl': {
      gridTemplateColumns: '300px 1fr',
    },
  }),
};
