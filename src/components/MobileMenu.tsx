/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, IconButton, Icon, FuelLogo, Link } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import type { NavOrder } from '../pages';

import { AltSidebar } from './AltSidebar';
import { Navigation } from './Navigation';
// import { Sidebar } from './Sidebar';

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false });
const Search = dynamic(() => import('./Search'), { ssr: false });

const MotionBox = motion<any>(Box);
const SPRING: AnimationProps['transition'] = {
  ease: 'linear',
  duration: '0.1',
};

interface MobileMenuProps {
  active: string;
  title?: string;
  allNavs?: NavOrder[];
}

export function MobileMenu({ title, active, allNavs }: MobileMenuProps) {
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
      onClick={toggle}
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
        <Link href="/" css={styles.logoWrapper}>
          <FuelLogo size={30} />
        </Link>
        <a href="https://github.com/fuellabs/" target="_blank" rel="noreferrer">
          <Icon icon={Icon.is('BrandGithub')} size={24} />
        </a>
        {button}
      </Box.Flex>
      <Box css={styles.navContainer}>
        <Box.Stack css={styles.nav}>
          <Navigation active={active} />
        </Box.Stack>

        <AltSidebar allNavs={allNavs} onClick={() => setShowing(false)} />
        {/* <Sidebar allNavs={allNavs} onClick={() => setShowing(false)} /> */}
      </Box>
    </MotionBox>
  );

  return (
    <Box css={styles.root}>
      <Search title={title} />
      <ThemeToggler />
      {button}
      <AnimatePresence>
        {showing && <Box css={styles.overlay}>{content}</Box>}
      </AnimatePresence>
    </Box>
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
      color: '$green11',
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
    color: '$intentsBase10',

    '&:hover': {
      textDecoration: 'none',
      color: '$intentsBase12 !important',
    },

    '&[data-active="true"], &[data-active="true"]:hover': {
      color: '$green11 !important',
    },
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
      background: '$green11',
      color: '$white',
      textDecoration: 'none',
    },
    '&[data-active="true"]': {
      color: '$green11',
    },
  }),
  categoryMenu: cssObj({
    fontSize: '$sm',
    color: '$textMuted',
    borderBottom: '1px solid $border',
    mb: '$2',
  }),
  navContainer: cssObj({
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: 'calc(100vh - 100px)',

    '.Sidebar': {
      borderTop: '1px solid $border',
      pt: '$4',
    },
  }),
  nav: cssObj({
    a: {
      justifyContent: 'flex-start',
    },
    py: '$4',
  }),
};
