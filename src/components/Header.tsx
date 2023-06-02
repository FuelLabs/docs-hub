import { cssObj } from '@fuel-ui/css';
import { Box, Flex, FuelLogo, Icon } from '@fuel-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { MobileMenu } from './MobileMenu';
import { Search } from './Search';

type Tabs =
  | 'portal'
  | 'sway'
  | 'fuels-rs'
  | 'fuels-ts'
  | 'fuels-wallet'
  | 'fuel-graphql-docs';

export function Header({ title }: { title?: string }) {
  const [active, setActive] = useState<Tabs>('portal');
  const router = useRouter();
  const activeStyles = { ...styles.topNavLink, ...styles.activeTopNavLink };

  useEffect(() => {
    let category = 'portal';
    if (router.pathname !== '/') {
      category = router.asPath.split('docs/')[1].split('/')[0];
    }
    if (isStringInTabs(category)) setActive(category as Tabs);
  }, [router]);

  function isStringInTabs(str: string): boolean {
    return (
      str === 'portal' ||
      str === 'sway' ||
      str === 'fuels-rs' ||
      str === 'fuels-ts' ||
      str === 'fuels-wallet' ||
      str === 'fuel-graphql-docs'
    );
  }

  return (
    <Flex as="header" css={styles.root}>
      <Box>
        <Link href="/" className="logo">
          <FuelLogo size={40} />
          <Flex css={styles.logoText}>
            <span>{title}</span>
          </Flex>
        </Link>
      </Box>
      <Flex css={{ padding: '0 $10' }} grow={'1'} gap={'$4'}>
        <Link
          href="/docs/sway/introduction/index"
          style={active === 'sway' ? activeStyles : styles.topNavLink}
        >
          Sway
        </Link>
        <Link
          href="/docs/fuels-rs/getting-started/index/"
          style={active === 'fuels-rs' ? activeStyles : styles.topNavLink}
        >
          Rust SDK
        </Link>
        <Link
          href="/docs/fuels-ts/guide/index/"
          style={active === 'fuels-ts' ? activeStyles : styles.topNavLink}
        >
          TS SDK
        </Link>
        <Link
          href="/docs/fuels-wallet/install/"
          style={active === 'fuels-wallet' ? activeStyles : styles.topNavLink}
        >
          Wallet
        </Link>
        <Link
          href="/docs/fuel-graphql-docs/overview"
          style={
            active === 'fuel-graphql-docs' ? activeStyles : styles.topNavLink
          }
        >
          GQL
        </Link>
      </Flex>
      <Box css={styles.desktop}>
        <Flex css={styles.menu}>
          <a
            href="https://github.com/fuellabs/"
            target="_blank"
            rel="noreferrer"
          >
            <Icon icon={Icon.is('GithubLogo')} size={24} />
          </a>
        </Flex>
        <Search />
      </Box>
      <MobileMenu />
    </Flex>
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
      color: '$accent11',
    },
  }),
  topNavLink: {
    padding: '4px 16px',
    borderRadius: '4px',
  },
  activeTopNavLink: {
    background: 'var(--colors-accent2)',
  },
};
