import { cssObj } from '@fuel-ui/css';
import { Box, Drawer, IconButton, FuelLogo, Link, Icon } from '@fuel-ui/react';
import { useState } from 'react';

import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';

import { AltSidebar } from './AltSidebar';
import Search from './Search';
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
    <Box.HStack css={styles.root}>
      <Search title={title} isLatest={isLatest} />
      <ThemeToggler />
      <VersionDropdown isLatest={isLatest} />
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
                <a
                  href="https://github.com/fuellabs/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon icon={'BrandGithub'} size={24} />
                </a>
                {drawerButton}
              </Box.Flex>
            </Box.Flex>

            <Box css={styles.navContainer}>
              <AltSidebar
                versions={versions}
                allNavs={active.includes('guides') ? undefined : allNavs}
                onClick={() => setOpen(false)}
              />
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Box.HStack>
  );
}

const styles = {
  root: cssObj({
    '@xl': {
      display: 'none',
    },
  }),
  drawer: cssObj({
    section: {
      bg: '$bodyColor',
      padding: '$6',
    },
    '@xl': {
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
};
