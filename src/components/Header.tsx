import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Icon, Link } from '@fuel-ui/react';

import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';
import { Search } from './Search';

export function Header({ title }: { title?: string }) {
  return (
    <Box.Flex as="header" css={styles.root}>
      <Link href="/" className="logo">
        <FuelLogo size={40} />
        <Box.Flex css={styles.logoText}>{title}</Box.Flex>
      </Link>
      <Box.Flex css={styles.navWrapper} grow={'1'} gap={'$4'}>
        <Navigation />
      </Box.Flex>
      <Box css={styles.desktop}>
        <Box.Flex css={styles.menu}>
          <a
            href="https://github.com/fuellabs/"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('BrandGithub')} size={24} stroke={1} />
          </a>
        </Box.Flex>
        <Search />
      </Box>
      <MobileMenu />
    </Box.Flex>
  );
}

const styles = {
  root: cssObj({
    zIndex: '$10',
    position: 'sticky',
    top: 0,
    background: '#090a0a',
    gap: '$2',
    py: '$4',
    px: '$4',
    alignItems: 'center',
    borderBottom: '1px solid $intentsBase2',
    gridColumn: '1 / 4',

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
  logoText: cssObj({
    alignItems: 'center',
    flex: 1,
    fontSize: '$lg',
    paddingLeft: '$3',
    letterSpacing: '$tight',
  }),
  navWrapper: cssObj({
    padding: '0 $8',
    display: 'none',

    '@xl': {
      display: 'flex',
    },
  }),
  desktop: cssObj({
    display: 'none',

    '@xl': {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  mobile: cssObj({
    display: 'flex',
    alignItems: 'center',

    '.fuel_Button': {
      height: 'auto !important',
      padding: '$0 !important',
    },

    '@xl': {
      display: 'none',
    },
  }),
  menu: cssObj({
    gap: '$6',

    a: {
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$brand',
    },
  }),
};
