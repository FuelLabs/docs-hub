import { cssObj } from '@fuel-ui/css';
import {
  Box,
  FuelLogo,
  Icon,
  Link,
  darkTheme,
  lightTheme,
} from '@fuel-ui/react';
import dynamic from 'next/dynamic';

import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false });
const Search = dynamic(() => import('./Search'), { ssr: false });

export function Header({ active, title }: { active: string; title?: string }) {
  return (
    <Box.Flex as="header" css={styles.root}>
      <Link href="/" className="logo">
        <FuelLogo size={30} />
      </Link>
      <span id="lvl0" style={{ visibility: 'hidden', width: '0', height: '0' }}>
        {title}
      </span>
      <Box.Flex css={styles.navWrapper} grow={'1'} gap={'$4'}>
        <Navigation active={active} />
      </Box.Flex>
      <Box css={styles.desktop}>
        <Box.Stack direction="row" gap="$4" css={{ mr: '$4' }}>
          <Search title={title} />
          <ThemeToggler />
        </Box.Stack>
        <Box.Flex gap={'$2'} css={styles.menu}>
          <a
            href="https://github.com/fuellabs/"
            target="_blank"
            rel="noreferrer"
            title="Github"
          >
            <Icon icon={Icon.is('BrandGithub')} size={24} stroke={1} />
          </a>
          <a
            href="https://twitter.com/fuel_network"
            target="_blank"
            rel="noreferrer"
            title="Twitter"
          >
            <Icon icon={'BrandTwitter'} size={24} stroke={1} />
          </a>
          <a
            href="https://discord.com/invite/xfpK4Pe"
            target="_blank"
            rel="noreferrer"
            title="Discord"
          >
            <Icon icon={Icon.is('BrandDiscord')} size={24} stroke={1} />
          </a>
        </Box.Flex>
      </Box>
      <MobileMenu active={active} title={title} />
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
    borderBottom: '1px solid $border',
    gridColumn: '1 / 4',

    [`.${darkTheme.theme} &`]: {
      backgroundColor: '$intentsBase2',
    },
    [`.${lightTheme.theme} &`]: {
      backgroundColor: '$white',
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
      position: 'relative',
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
  menu: cssObj({
    a: {
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$textLink',
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
