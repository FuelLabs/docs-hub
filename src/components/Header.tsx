import { cssObj } from '@fuel-ui/css';
import { Alert, Box, darkTheme, lightTheme } from '@fuel-ui/react';
import dynamic from 'next/dynamic';

import type { NavOrder, Versions } from '../pages/[...slug]';

import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';
import VersionDropdown from './VersionDropdown';

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false });
const Search = dynamic(() => import('./Search'), { ssr: false });

interface HeaderProps {
  active: string;
  title?: string;
  allNavs?: NavOrder[];
  isLatest: boolean;
  versions?: Versions;
}

export function Header({
  active,
  title,
  allNavs,
  isLatest,
  versions,
}: HeaderProps) {
  return (
    <Box as="header" css={styles.root}>
      <Box.Flex css={styles.header}>
        <Box css={{ ...styles.desktop, ...styles.searchContainer }}>
          {/* THIS GETS USED BY THE SEARCH INDEXER */}
          <span
            id="lvl0"
            style={{ visibility: 'hidden', width: '0', height: '0' }}
          >
            {title}
          </span>
          <Search title={title} isLatest={isLatest} />
        </Box>
        <Box css={styles.desktop}>
          <Navigation active={active} />
          <Box.Stack direction="row" gap="$3">
            <VersionDropdown isLatest={isLatest} />
            <ThemeToggler />
          </Box.Stack>
        </Box>
        <MobileMenu
          allNavs={allNavs}
          active={active}
          title={title}
          isLatest={isLatest}
          versions={versions}
        />
      </Box.Flex>
      {isLatest && (
        <Alert css={styles.alert} direction="row" status="warning">
          <Alert.Description>
            Latest versions may be unstable or not compatible across tooling.
          </Alert.Description>
        </Alert>
      )}
    </Box>
  );
}

const styles = {
  root: cssObj({
    zIndex: '$10',
    position: 'sticky',
    top: 0,
  }),
  alert: cssObj({
    zIndex: '-1',
    py: '$1',
    borderRadius: '0',
  }),
  header: cssObj({
    gap: '$1',
    py: '$3',
    px: '$3',
    alignItems: 'center',
    gridColumn: '1 / 4',
    justifyContent: 'space-between',

    [`.${darkTheme.theme} &`]: {
      backgroundColor: '$bodyColor',
    },
    [`.${lightTheme.theme} &`]: {
      backgroundColor: 'white',
    },

    '.logo': {
      display: 'inline-flex',
      color: '$intentsBase9',
      flex: 1,

      '@lg': {
        flex: 'none',
      },
    },

    '@sm': {
      gap: '$3',
      px: '$6',
    },

    '@md': {
      px: '$8',
    },
  }),
  desktop: cssObj({
    display: 'none',

    '@lg': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  searchContainer: cssObj({
    '.fuel_Box-flex': {
      height: '36px',
    },
  }),
};
