import { cssObj } from '@fuel-ui/css';
import { Box, Grid } from '@fuel-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { type ReactNode, useEffect, useRef } from 'react';

import type { Config, NavOrder, VersionSet, Versions } from '../types';

import { Header } from './Header';
import { SidebarContainer } from './SidebarContainer';

type LayoutProps = {
  title?: string;
  children: ReactNode;
  isClean?: boolean;
  config?: Config;
  versionSet: VersionSet;
  versions?: Versions;
  allNavs?: NavOrder[];
  setIsAlertVisible: (arg0: boolean) => void;
  isAlertVisible: boolean;
};

export function Layout({
  title,
  children,
  isClean,
  config,
  versionSet,
  versions,
  allNavs,
  setIsAlertVisible,
  isAlertVisible,
}: LayoutProps) {
  const router = useRouter();
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTo({ top: 0 });
    }
  }, [router.asPath.split('#')[0]]);

  const titleText =
    title && router.pathname !== '/'
      ? `${title[0].toUpperCase()}${title.slice(1)} | Fuel Docs`
      : 'Fuel Docs';

  function getSlug() {
    return router.pathname.includes('/guides') ? 'guides' : '';
  }

  const slug = config?.slug
    ? config.slug.includes('guides/')
      ? router.asPath
      : config.slug
    : getSlug();

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta
          name='description'
          content={
            config && config?.ogTags?.description !== ''
              ? config?.ogTags?.description
              : 'Fuel Network Docs'
          }
          key='desc'
        />
        <meta property='og:title' content={titleText} />
        <meta
          property='og:description'
          content={
            config && config?.ogTags?.description !== ''
              ? config?.ogTags?.description
              : 'Official documentation for the Fuel Network'
          }
        />
        <meta
          property='og:image'
          content={
            config && config?.ogTags?.image !== ''
              ? config?.ogTags?.image
              : '/images/Fuel_Network.png'
          }
        />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>
      <Box css={styles.root}>
        <Grid data-clean={Boolean(isClean)} css={styles.grid}>
          {!isClean && (
            <Grid.Item>
              <SidebarContainer
                versions={versions}
                allNavs={allNavs}
                versionSet={versionSet}
              />
            </Grid.Item>
          )}
          <Grid.Item css={styles.right} ref={scrollContainer}>
            <Header
              active={slug}
              title={config?.title}
              versionSet={versionSet}
              versions={versions}
              allNavs={allNavs}
              setIsAlertVisible={setIsAlertVisible}
              isAlertVisible={isAlertVisible}
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
    position: 'fixed',
    top: 0,
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    overflow: 'hidden',
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
    position: 'sticky',
    top: 0,
    height: '100vh',
    maxWidth: '1300px',
    gridTemplateColumns: '1fr',
    mx: 'auto',
    boxSizing: 'border-box',
    '& .Layout--section': {
      boxSizing: 'border-box',
      padding: '0 $8 $8 $8',
      display: 'block',

      '@md': {
        maxWidth: '736px',
        mx: 'auto',
      },
    },

    '@lg': {
      '&[data-clean="false"]': {
        gridTemplateColumns: '310px 1fr',
      },
    },
  }),
};
