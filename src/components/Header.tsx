import { cssObj } from '@fuel-ui/css';
import { Box, Flex, FuelLogo, Icon, Dropdown, Button } from '@fuel-ui/react';
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
  | 'fuel-graphql-docs'
  | 'fuelup'
  | 'fuel-indexer';

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
      str === 'fuel-graphql-docs' ||
      str === 'fuelup' ||
      str === 'fuel-indexer'
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
        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="outlined">Fuel Network</Button>
          </Dropdown.Trigger>
          <Dropdown.Menu
            autoFocus
            aria-label="SDKs"
            onAction={(action) => {
              let link = '/';
              switch (action) {
                case 'graphql':
                  link = '/docs/fuel-graphql-docs/overview';
                  router.push(link);
                  break;
                case 'faucet':
                  link = 'https://faucet-beta-3.fuel.network/';
                  window.open(link);
                  break;
                default:
              }
            }}
          >
            <Dropdown.MenuItem
              key="graphql"
              textValue="GraphQL API"
              css={
                active === 'fuel-graphql-docs'
                  ? activeStyles
                  : styles.topNavLink
              }
            >
              GraphQL API
            </Dropdown.MenuItem>
            <Dropdown.MenuItem key="faucet" textValue="Faucet">
              Faucet
            </Dropdown.MenuItem>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="outlined">Build with Sway</Button>
          </Dropdown.Trigger>
          <Dropdown.Menu
            autoFocus
            aria-label="SDKs"
            onAction={(action) => {
              let link = '/';
              switch (action) {
                case 'fuelup':
                  link = '/docs/fuelup/index';
                  break;
                case 'sway':
                  link = '/docs/sway/introduction/index';
                  break;
                default:
              }
              router.push(link);
            }}
          >
            <Dropdown.MenuItem
              key="fuelup"
              textValue="Fuelup"
              css={active === 'fuelup' ? activeStyles : styles.topNavLink}
            >
              Fuelup
            </Dropdown.MenuItem>
            <Dropdown.MenuItem
              key="sway"
              textValue="Sway"
              css={active === 'sway' ? activeStyles : styles.topNavLink}
            >
              Sway
            </Dropdown.MenuItem>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Trigger>
            <Button variant="outlined">SDKs</Button>
          </Dropdown.Trigger>
          <Dropdown.Menu
            autoFocus
            aria-label="SDKs"
            onAction={(action) => {
              let link = '/';
              switch (action) {
                case 'rust-sdk':
                  link = '/docs/fuels-rs/getting-started/index/';
                  break;
                case 'ts-sdk':
                  link = '/docs/fuels-ts/guide/index/';
                  break;
                case 'wallet-sdk':
                  link = '/docs/fuels-wallet/install/';
                  break;
                case 'indexer':
                  link = '/docs/fuel-indexer/the-fuel-indexer/';
                  break;
                default:
              }
              router.push(link);
            }}
          >
            <Dropdown.MenuItem
              key="rust-sdk"
              textValue="Rust SDK"
              css={active === 'fuels-rs' ? activeStyles : styles.topNavLink}
            >
              Rust SDK
            </Dropdown.MenuItem>
            <Dropdown.MenuItem
              key="ts-sdk"
              textValue="TS SDK"
              css={active === 'fuels-ts' ? activeStyles : styles.topNavLink}
            >
              TypeScript SDK
            </Dropdown.MenuItem>
            <Dropdown.MenuItem
              key="wallet-sdk"
              textValue="Wallet SDK"
              css={active === 'fuels-wallet' ? activeStyles : styles.topNavLink}
            >
              Wallet
            </Dropdown.MenuItem>
            <Dropdown.MenuItem
              key="indexer"
              textValue="Indexer"
              css={active === 'fuel-indexer' ? activeStyles : styles.topNavLink}
            >
              Indexer
            </Dropdown.MenuItem>
          </Dropdown.Menu>
        </Dropdown>
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
