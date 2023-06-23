import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Icon, Link } from '@fuel-ui/react';

import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';
import { Search } from './Search';

export function Header({ title }: { title?: string }) {
  return (
    <Box.Flex as="header" css={styles.root}>
      <Box css={{ flex: 1, '@xl': { flex: 'inherit' } }}>
        <Link href="/" className="logo">
          <FuelLogo size={40} />
          <Box.Flex css={styles.logoText}>
            <span>{title}</span>
          </Box.Flex>
        </Link>
      </Box>
      <Box.Flex
        css={{ padding: '0 $8', display: 'none', '@xl': { display: 'flex' } }}
        grow={'1'}
        gap={'$4'}
      >
        <Navigation />
      </Box.Flex>
      <Box css={styles.desktop}>
        <Box.Flex css={styles.menu}>
          <a
            href="https://github.com/fuellabs/"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('BrandGithub')} size={24} />
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
    borderBottom: '1px solid $gray2',
    gridColumn: '1 / 4',

    '.logo': {
      display: 'inline-flex',
      color: '$gray9',
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
    fontWeight: '$semibold',
    paddingLeft: '$2',
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
    '.fuel_button': {
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
      color: '$gray10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$accent11',
    },
  }),
};
