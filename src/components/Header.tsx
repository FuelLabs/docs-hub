import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Icon, Link } from '@fuel-ui/react';

import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';
import { Search } from './Search';
import { ThemeToggler } from './ThemeToggler';

export function Header({ title }: { title?: string }) {
  return (
    <Box.Flex as="header" css={styles.root}>
      <Link href="/" className="logo">
        <FuelLogo size={30} />
        <Box.Flex css={styles.logoText}>{title}</Box.Flex>
      </Link>
      <Box.Flex css={styles.navWrapper} grow={'1'} gap={'$4'}>
        <Navigation />
      </Box.Flex>
      <Box css={styles.desktop}>
        <Box.Stack direction="row" gap="$4" css={{ mr: '$4' }}>
          <Search />
          <ThemeToggler />
        </Box.Stack>
        <Box.Flex css={styles.menu}>
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
            <Icon icon={Icon.is('BrandTwitter')} size={24} stroke={1} />
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
      <MobileMenu />
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
    bg: '$overlayBg',

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
    gap: '$2',

    a: {
      color: '$intentsBase10',
      transition: 'all 0.3s',
    },

    'a.active, a:hover': {
      color: '$textLink',
    },
  }),
};
