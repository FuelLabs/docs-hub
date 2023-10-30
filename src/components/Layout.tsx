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
  config?: Config;
  isLatest: boolean;
  versions?: Versions;
  allNavs?: NavOrder[];
};

export function Layout({
  title,
  children,
  isClean,
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
        <Grid data-clean={Boolean(isClean)} css={styles.grid}>
          {!isClean && (
            <Grid.Item>
              <SidebarContainer
                versions={versions}
                allNavs={allNavs}
                isLatest={isLatest}
              />
            </Grid.Item>
          )}
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
    position: 'sticky',
    top: 0,
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    overflow: 'hidden',
    // TODO: fix weirdness when clicking h1 on /sway
    // backgroundColor: 'pink',
    backgroundColor: '$bodyColor',
    'html[class="fuel_light-theme"] &': {
      backgroundColor: 'white',
    },
  }),
  right: cssObj({
    height: '100vh',
    boxSizing: 'border-box',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  grid: cssObj({
    height: '100vh',
    maxWidth: '1360px',
    gridTemplateColumns: '1fr',
    mx: 'auto',
    boxSizing: 'border-box',
    '& .Layout--section': {
      boxSizing: 'border-box',
      padding: '0 $8 $8 $8',
      display: 'block',
    },

    '@xl': {
      '&[data-clean="false"]': {
        gridTemplateColumns: '300px 1fr',
      },
    },
  }),
};
