/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  IconButton,
  Icon,
  FuelLogo,
  Button,
  Text,
  ButtonLink,
} from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import { useEffect, useState } from 'react';

import { NAVIGATION } from '../constants';
import type { LinkObject } from '../constants';

import { styles as navStyles } from './Navigation';
import { Search } from './Search';
import { Sidebar } from './Sidebar';

const MotionBox = motion<any>(Box);
const SPRING: AnimationProps['transition'] = {
  ease: 'linear',
  duration: '0.1',
};

export function MobileMenu() {
  const [showing, setShowing] = useState(false);

  function toggle() {
    setShowing((s) => !s);
  }

  useEffect(() => {
    if (showing) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [showing]);

  const button = (
    <IconButton
      className="mobile-button"
      variant="link"
      intent="base"
      icon={showing ? Icon.is('X') : Icon.is('List')}
      iconSize={30}
      aria-label="Menu"
      onPress={toggle}
    />
  );

  const content = (
    <MotionBox
      css={styles.content}
      animate={{ x: 0 }}
      initial={{ x: '100%' }}
      exit={{ x: '100%' }}
      transition={SPRING}
    >
      <Box.Flex css={styles.menu}>
        <Box.Flex css={styles.logoWrapper}>
          <FuelLogo size={40} />
        </Box.Flex>
        <a href="https://github.com/fuellabs/" target="_blank" rel="noreferrer">
          <Icon icon={Icon.is('BrandGithub')} size={24} />
        </a>
        {button}
      </Box.Flex>
      <Box css={styles.navContainer}>
        <Box.Flex css={styles.nav} direction={'column'}>
          {NAVIGATION.map((item, index) => {
            if (item.type === 'menu') {
              return <MenuButton key={`${item.slug}${index}`} item={item} />;
            }
            return (
              <Button
                key={`${item.slug}${index}`}
                css={styles.navButton}
                variant="link"
              >
                {item.name}
              </Button>
            );
          })}
        </Box.Flex>

        <Sidebar />
      </Box>
    </MotionBox>
  );

  return (
    <Box css={styles.root}>
      <Search />
      {button}
      <AnimatePresence>
        {showing && <Box css={styles.overlay}>{content}</Box>}
      </AnimatePresence>
    </Box>
  );
}

function MenuButton({ item }: { item: LinkObject }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        onPress={() => setIsOpen(!isOpen)}
        css={styles.navButton}
        variant="link"
        rightIcon={isOpen ? Icon.is('ChevronUp') : Icon.is('ChevronDown')}
      >
        {item.name}
      </Button>
      {isOpen && item.menu && (
        <Box.Stack css={styles.navButtonMenu}>
          {item.menu.map((menuItem, index) => {
            if (
              menuItem.type === 'internal-link' ||
              menuItem.type === 'external-link'
            ) {
              return (
                <ButtonLink
                  css={styles.menuLink}
                  variant="link"
                  key={`${index}${menuItem.slug}`}
                  href={menuItem.link}
                  isExternal={menuItem.type === 'external-link'}
                >
                  {menuItem.name}
                </ButtonLink>
              );
            }
            return (
              <Text key={`${index}${menuItem.name}`} css={styles.categoryMenu}>
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
    display: 'flex',
    alignItems: 'center',
    gap: '$4',

    '.mobile-button': {
      height: 'auto !important',
      padding: '$0 !important',
      color: '$intentsBase8 !important',
    },

    '@xl': {
      display: 'none',
    },
  }),
  logoWrapper: cssObj({
    flex: 1,
    alignItems: 'center',
  }),
  menu: cssObj({
    pb: '$4',
    borderBottom: '1px solid $border',
    gap: '$6',
    alignItems: 'center',

    a: {
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$brand',
    },
  }),
  overlay: cssObj({
    display: 'flex',
    flexDirection: 'row-reverse',
    zIndex: '$10',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,.8)',
    overflow: 'hidden',
    boxSizing: 'border-box',
  }),
  content: cssObj({
    boxSizing: 'border-box',
    padding: '$6',
    width: '100vw',
    height: '100%',
    background: '$bodyColor',

    '@sm': {
      width: '400px',
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
  }),
  menuLink: cssObj({
    padding: '$0',
    justifyContent: 'space-between',
    color: '$intentsBase10',
    fontSize: '$sm',
    height: '$4',
    minHeight: 'auto',

    '&:hover': {
      background: '$brand',
      color: '$brand',
      textDecoration: 'none',
    },
  }),
  categoryMenu: cssObj({
    fontSize: '$sm',
    color: '$textMuted',
    borderBottom: '1px solid $border',
    mb: '$2',
  }),
  navContainer: cssObj({
    overflow: 'auto',
    maxHeight: 'calc(100vh - 100px)',

    '.Sidebar': {
      borderTop: '1px solid $border',
      pt: '$4',
    },
  }),
  nav: cssObj({
    gap: '$2',
    py: '$4',
  }),
};
