/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  IconButton,
  Icon,
  FuelLogo,
  Button,
  Link,
  Text,
} from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import { useEffect, useState } from 'react';

import { NAVIGATION } from '../constants';
import type { LinkObject } from '../constants';

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
        <Box.Flex>
          <FuelLogo size={40} />
          <a
            href="https://github.com/fuellabs/"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('BrandGithub')} size={24} />
          </a>
        </Box.Flex>
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
                variant={'link'}
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
        variant={'outlined'}
      >
        {item.name}
      </Button>
      {isOpen && item.menu && (
        <Box.Flex direction={'column'} justify={'flex-start'}>
          {item.menu.map((menuItem, index) => {
            if (
              menuItem.type === 'internal-link' ||
              menuItem.type === 'external-link'
            ) {
              return (
                <Link
                  key={`${index}${menuItem.slug}`}
                  css={styles.menuLink}
                  href={menuItem.link}
                  isExternal={menuItem.type === 'external-link'}
                >
                  <Button css={styles.menuButton} variant={'link'}>
                    {menuItem.name}
                  </Button>
                </Link>
              );
            }
            return (
              <Text
                key={`${index}${menuItem.name}`}
                css={{ color: '$accent11' }}
              >
                {menuItem.name}
              </Text>
            );
          })}
        </Box.Flex>
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
      color: '$gray8 !important',
    },

    '@xl': {
      display: 'none',
    },
  }),
  menu: cssObj({
    pb: '$4',
    mb: '$4',
    borderBottom: '1px solid $gray3',
    gap: '$6',
    alignItems: 'center',
    justifyContent: 'space-between',

    a: {
      color: '$gray10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$accent11',
    },

    '& > .fuel_box': {
      gap: '$4',
      alignItems: 'center',
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
    borderRadius: '8px',
  }),
  menuButton: cssObj({
    color: 'inherit',
    '&:hover': {
      textDecoration: 'none !important',
    },
  }),
  menuLink: cssObj({
    justifyContent: 'flex-start',
    paddingLeft: '8px',
    color: 'var(--colors-gray10)',
    '&:hover': {
      background: '$accent2',
      color: '$accent11',
      textDecoration: 'none',
    },
  }),
  navContainer: cssObj({
    overflow: 'auto',
    maxHeight: 'calc(100vh - 100px)',
  }),
  nav: cssObj({
    borderBottom: '2px solid $accent11',
    paddingBottom: '$2',
    marginBottom: '$4',
    gap: '$2',
  }),
};
