/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Text,
  Drawer,
  IconButton,
  FuelLogo,
  Link,
  Icon,
  ButtonLink,
  Button,
} from '@fuel-ui/react';
import { useState } from 'react';

import type { LinkObject } from '../config/constants';
import { NAVIGATION } from '../config/constants';

import { styles as navStyles } from './Navigation';
import Search from './Search';
import { Sidebar } from './Sidebar';
import ThemeToggler from './ThemeToggler';
import VersionDropdown from './VersionDropdown';

interface MobileMenuProps {
  active: string;
  title?: string;
  isLatest: boolean;
}

export function MobileMenu({ active, title, isLatest }: MobileMenuProps) {
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
      <Search title={title} />
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
              <Box.VStack>
                {NAVIGATION.map((item, index) => {
                  if (item.type === 'menu') {
                    return (
                      <MenuButton
                        key={`${item.slug}${index}`}
                        item={item}
                        active={active}
                        isLatest={isLatest}
                      />
                    );
                  }
                  const thisLink = isLatest
                    ? item.link
                        ?.replace('docs/', 'docs/latest/')
                        .replace('guides', 'guides/latest')
                    : item.link;
                  return (
                    <ButtonLink
                      key={`${item.slug}${index}`}
                      css={styles.navButton}
                      href={thisLink}
                      isExternal={item.type === 'external-link'}
                      data-active={active === item.slug}
                    >
                      {item.name}
                    </ButtonLink>
                  );
                })}
              </Box.VStack>

              <Sidebar onClick={() => setOpen(false)} />
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Box.HStack>
  );
}

interface MenuButtonProps {
  item: LinkObject;
  active: string;
  isLatest: boolean;
}

function MenuButton({ item, active, isLatest }: MenuButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isActive = item.menu?.some((i: any) => i.slug === active);
  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        css={styles.navButton}
        variant="link"
        intent="base"
        data-active={isActive}
        rightIcon={isOpen ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
      >
        {item.name}
      </Button>
      {isOpen && item.menu && (
        <Box.Stack css={styles.navButtonMenu}>
          {item.menu.map((menuItem: any, index: number) => {
            if (
              menuItem.type === 'internal-link' ||
              menuItem.type === 'external-link'
            ) {
              const thisLink = isLatest
                ? menuItem.link
                    ?.replace('docs/', 'docs/latest/')
                    .replace('guides', 'guides/latest')
                : menuItem.link;

              return (
                <ButtonLink
                  css={styles.menuLink}
                  intent="base"
                  size="sm"
                  key={`${index}${menuItem.slug}`}
                  href={thisLink}
                  isExternal={menuItem.type === 'external-link'}
                  data-active={active === menuItem.slug}
                >
                  {menuItem.name}
                </ButtonLink>
              );
            }
            return (
              <Text
                key={`${index}${menuItem.name}`}
                css={styles.categoryMenu}
                fontSize="sm"
              >
                {menuItem.name}
              </Text>
            );
          })}
        </Box.Stack>
      )}
    </>
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
  categoryMenu: cssObj({
    color: '$textMuted',
    borderBottom: '1px solid $border',
    mb: '$2',
    mt: '$1',
  }),
  menuLink: cssObj({
    justifyContent: 'space-between',
    padding: 0,
  }),
  topContainer: cssObj({
    pb: '$4',
    mb: '$4',
    borderBottom: '1px solid $border',
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
  navButton: cssObj({
    ...navStyles.navButton,
    justifyContent: 'space-between',
    padding: '$0',
  }),
  navButtonMenu: cssObj({
    bg: '$intentsBase1',
    padding: '$3',
    borderRadius: '$default',
    gap: '$1',
  }),
  navContainer: cssObj({
    '.Sidebar': {
      borderTop: '1px solid $border',
      pt: '$4',
      mt: '$4',
    },
  }),
};
