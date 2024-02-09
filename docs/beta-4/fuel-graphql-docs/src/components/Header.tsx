import { cssObj } from '@fuel-ui/css';
import { Box, Icon } from '@fuel-ui/react';
import Image from 'next/image';
import Link from 'next/link';

import { MobileMenu } from './MobileMenu';
import { Search } from './Search';

export function Header() {
  return (
    <Box.Flex as="header" css={styles.root}>
      <Box css={{ flex: 1 }}>
        <Link href="/" className="logo">
          <Image alt="Fuel Logo" src="/Fuel_Logo.png" height={30} width={30} />
          <Box.Flex css={styles.logoText}>
            <span>Fuel GraphQL Docs</span>
          </Box.Flex>
        </Link>
      </Box>
      <Box css={styles.desktop}>
        <Box.Flex css={styles.menu}>
          <a
            href="https://github.com/FuelLabs/fuel-graphql-docs"
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
    marginLeft: '$2',
  }),
  version: cssObj({
    ml: '$2',
    color: '$gray8',
    fontSize: '$xs',
    fontStyle: 'italic',
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
      color: '#00F58C',
    },
  }),
};
