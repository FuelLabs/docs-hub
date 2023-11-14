import { cssObj } from '@fuel-ui/css';
import { Box, Drawer, IconButton, FuelLogo, Link, Icon } from '@fuel-ui/react';
import { useState } from 'react';
import type { NavOrder, Versions } from '~/src/types';

import { Navigation } from './Navigation';
import Search from './Search';
import { Sidebar } from './Sidebar';
import ThemeToggler from './ThemeToggler';
import VersionDropdown from './VersionDropdown';

interface MobileMenuProps {
  active: string;
  title?: string;
  isLatest: boolean;
  allNavs?: NavOrder[];
  versions?: Versions;
}

export function MobileMenu({
  active,
  title,
  isLatest,
  allNavs,
  versions,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen((s) => !s);
  }

  const drawerButton = (
    <IconButton
      className="mobile-button"
      variant="link"
      intent="base"
      icon={open ? Icon.is('X') : Icon.is('List')}
      iconSize={30}
      aria-label="Menu"
      onClick={toggle}
    />
  );

  return (
    <Box.Flex css={styles.root}>
      <Search title={title} isLatest={isLatest} />

      <Box.Stack direction="row" gap="$3">
        <VersionDropdown isLatest={isLatest} />
        <ThemeToggler />
        <Drawer
          isDismissable
          isOpen={open}
          side="right"
          onClose={() => setOpen(false)}
        >
          <Drawer.Trigger>{drawerButton}</Drawer.Trigger>

          <Drawer.Content css={styles.drawer}>
            <Drawer.Body>
              <Box.Flex css={styles.topContainer} justify={'space-between'}>
                <Link href="/">
                  <FuelLogo size={30} />
                </Link>
                <Box.Flex gap="$4" align="center" css={styles.iconContainer}>
                  {drawerButton}
                </Box.Flex>
              </Box.Flex>
              <Navigation active={active} />

              <Box css={styles.navContainer}>
                <Sidebar
                  versions={versions}
                  allNavs={active.includes('guides') ? undefined : allNavs}
                  onClick={() => setOpen(false)}
                  isLatest={isLatest}
                />
              </Box>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </Box.Stack>
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    gap: '$1',
    width: '100%',
    justifyContent: 'space-between',
    '@lg': {
      display: 'none',
    },
  }),
  drawer: cssObj({
    section: {
      bg: '$bodyColor',
      padding: '$6',
    },
    '@lg': {
      display: 'none',
    },
  }),
  topContainer: cssObj({
    pb: '$4',
    mb: '$4',
  }),
  iconContainer: cssObj({
    a: {
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$textLink',
    },
  }),
  navContainer: cssObj({
    '.Sidebar': {
      borderTop: '1px solid $border',
      pt: '$4',
      mt: '$4',
    },
  }),
  searchContainer: cssObj({
    '.fuel_Box-flex': {
      height: '36px',
    },
  }),
};
