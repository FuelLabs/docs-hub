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
  Link,
} from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { NAVIGATION } from '../config/constants';
import type { LinkObject } from '../config/constants';

import { Sidebar } from './Sidebar';

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false });
const Search = dynamic(() => import('./Search'), { ssr: false });

const MotionBox = motion<any>(Box);
const SPRING: AnimationProps['transition'] = {
  ease: 'linear',
  duration: '0.1',
};

export function MobileMenu({
  active,
  title,
}: {
  active: string;
  title?: string;
}) {
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
        <Box.Flex css={styles.nav} direction={'column'}>
          {NAVIGATION.map((item, index) => {
            if (item.type === 'menu') {
              return (
                <MenuButton
                  key={`${item.slug}${index}`}
                  item={item}
                  active={active}
                />
              );
            }
            return (
              <ButtonLink
                key={`${item.slug}${index}`}
                css={styles.navButton}
                href={item.link}
                isExternal={item.type === 'external-link'}
                data-active={active === item.slug}
              >
                {item.name}
              </ButtonLink>
            );
          })}
        </Box.Flex>

        <Sidebar onClick={() => setShowing(false)} />
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

interface MenuButtonProps {
  item: LinkObject;
  active: string;
}

function MenuButton({ item, active }: MenuButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isActive = item.menu?.some((i) => i.slug === active);
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
          {item.menu.map((menuItem, index) => {
            if (
              menuItem.type === 'internal-link' ||
              menuItem.type === 'external-link'
            ) {
              return (
                <ButtonLink
                  css={styles.menuLink}
                  intent="base"
                  key={`${index}${menuItem.slug}`}
                  href={menuItem.link}
                  isExternal={menuItem.type === 'external-link'}
                  data-active={active === menuItem.slug}
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
      color: '$textLink',
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
      color: '$textLink !important',
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
      background: '$textLink',
      color: '$white',
      textDecoration: 'none',
    },
    '&[data-active="true"]': {
      color: '$textLink',
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
    gap: '$2',
    py: '$4',
  }),
};
