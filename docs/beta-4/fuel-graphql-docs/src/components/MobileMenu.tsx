/* eslint-disable @typescript-eslint/no-explicit-any */
import { cssObj } from '@fuel-ui/css';
import { Box, IconButton, Icon } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
        <Box.Flex>
          <Image alt="Fuel Logo" src="/Fuel_Logo.png" height={30} width={30} />
          <a
            href="https://github.com/FuelLabs/fuel-graphql-docs"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('BrandGithub')} size={24} />
          </a>
        </Box.Flex>
        {button}
      </Box.Flex>
      <Sidebar handleClick={toggle} />
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
      color: '#00F58C',
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
};
