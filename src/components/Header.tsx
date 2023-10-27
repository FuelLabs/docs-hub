import { cssObj } from '@fuel-ui/css';
import { Alert, Box, darkTheme, lightTheme } from '@fuel-ui/react';
import dynamic from 'next/dynamic';

import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';

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
        <span
          id="lvl0"
          style={{ visibility: 'hidden', width: '0', height: '0' }}
        >
          {title}
        </span>
        <Box.Flex css={styles.navWrapper}>
          <Navigation active={active} />
        </Box.Flex>
        <Box css={styles.desktop}>
          <Box.Stack direction="row" gap="$4" css={{ mr: '$4' }}>
            <ThemeToggler />
            <VersionDropdown isLatest={isLatest} />
            <Search title={title} />
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
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
    borderBottom: '1px solid transparent',
    gridColumn: '1 / 4',

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

      '@xl': {
        flex: 'none',
      },
    },

    '@md': {
      px: '$8',
    },

    '@xl': {
      py: '$4',
      px: '$8',
    },
  }),
  navWrapper: cssObj({
    padding: '0 $8',
    display: 'none',

    '@xl': {
      display: 'flex',
    },
  }),
  desktop: cssObj({
    display: 'none',

    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
};
