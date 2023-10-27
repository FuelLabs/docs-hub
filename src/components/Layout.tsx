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
          <Grid.Item
          // css={{ bg: '$gray6' }}
          >
            {/* <Box css={{ padding: '$4' }}> */}
            <SidebarContainer
              versions={versions}
              allNavs={allNavs}
              isLatest={isLatest}
            />
            {/* </Box> */}
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
        {/* <Header
          active={slug}
          title={config?.title}
          isLatest={isLatest}
          versions={versions}
          allNavs={allNavs}
        />
        <Grid
          data-headings={hasHeadings}
          data-clean={Boolean(isClean)}
          css={styles.grid}
        >
          {children}
        </Grid> */}
      </Box>
    </>
  );
}

const styles = {
  root: cssObj({
    width: '100vw',
    height: '100vh',
    // background: 'purple',
    boxSizing: 'border-box',
    overflow: 'hidden',
  }),
  right: cssObj({
    // border: '1px solid orange',
    height: '100vh',
    boxSizing: 'border-box',
    overflowX: 'auto',
  }),
  grid: cssObj({
    height: '100vh',
    maxWidth: '1400px',
    gridTemplateColumns: '300px 1fr',
    mx: 'auto',
    // border: '1px solid blue',
    boxSizing: 'border-box',
    // // Min height is 100vh - header height
    // minHeight: 'calc(100vh - 69px)',

    '& .Layout--section': {
      //   maxWidth: '1000px',
      //   width: '100vw',
      boxSizing: 'border-box',
      //   mx: 'auto',
      padding: '$8',
    },

    // '@xl': {
    //   gridTemplateColumns: '250px 1fr',
    //   gridColumnGap: '$24',
    //   '& .Layout--section': {
    //     width: 'calc(100vw - 442px)',
    //   },
    //   '&[data-headings="true"]': {
    //     gridTemplateColumns: '250px 1fr 220px',
    //     '& .Layout--section': {
    //       width: 'calc(100vw - 662px)',
    //     },
    //   },
    //   '&[data-clean="true"]': {
    //     gridTemplateColumns: '1fr',
    //     '& .Layout--section': {
    //       px: '$14',
    //     },
    //   },
    // },
    // '& .Layout--section a, & .Layout--section a:visited': {
    //   color: 'currentColor',
    // },
    // '& .Layout--section *:first-child': {
    //   mt: '$0',
    // },
  }),
};
