/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import {
  Box,
  IconButton,
  Icon,
  Flex,
  FuelLogo,
  Button,
  Link,
  Text,
} from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LinkObject, NAVIGATION } from '../constants';

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
      color="gray"
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
      <Flex css={styles.menu}>
        <Flex>
          <FuelLogo size={40} />
          <a
            href="https://github.com/fuellabs/"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('GithubLogo')} size={24} />
          </a>
        </Flex>
        {button}
      </Flex>
      <Box css={styles.navContainer}>
        <Flex css={styles.nav} direction={'column'}>
          {NAVIGATION.map((item, index) => {
            if (item.type === 'menu') {
              return <MenuButton key={index} item={item} />;
            } else if (item.type === 'internal-link') {
              return (
                <Button key={index} css={styles.navButton} variant={'link'}>
                  {item.name}
                </Button>
              );
            }
          })}
        </Flex>

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
        <Flex direction={'column'} justify={'flex-start'}>
          {item.menu.map((menuItem) => {
            if (
              menuItem.type === 'internal-link' ||
              menuItem.type === 'external-link'
            ) {
              return (
                <Link
                  css={styles.menuLink}
                  href={menuItem.link}
                  isExternal={menuItem.type === 'external-link'}
                >
                  <Button css={styles.menuButton} variant={'link'}>
                    {menuItem.name}
                  </Button>
                </Link>
              );
            } else if (menuItem.type === 'category') {
              return <Text css={{ color: '$accent11' }}>{menuItem.name}</Text>;
            }
          })}
        </Flex>
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
