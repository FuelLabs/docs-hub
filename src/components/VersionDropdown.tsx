import { cssObj } from '@fuel-ui/css';
import { Dropdown, Icon, Text } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { FUEL_TESTNET, FUEL_TESTNET_UPPER_CASE } from '../config/constants';
import { useSetVersion } from '../hooks/useVersion';
import type { VersionSet } from '../types';

export default function VersionDropdown({
  versionSet,
}: {
  versionSet: VersionSet;
}) {
  const [opened, setOpened] = useState(false);
  const [activeVersion, setActiveVersion] = useState<
    typeof FUEL_TESTNET_UPPER_CASE | 'Nightly' | 'Beta-4'
  >(
    versionSet === 'default'
      ? FUEL_TESTNET_UPPER_CASE
      : versionSet === 'nightly'
        ? 'Nightly'
        : 'Beta-4'
  );
  const router = useRouter();
  const setVersion = useSetVersion();
  const splitPath = router.asPath.split('/');
  const isDoc =
    router.asPath.includes('docs') &&
    !router.asPath.includes('/intro/') &&
    !router.asPath.includes('/fuel-101/') &&
    !router.asPath.includes('/notices/') &&
    !router.asPath.includes('docs/contributing');
  const bookIndex =
    versionSet !== 'default' &&
    (router.asPath.includes('nightly') || router.asPath.includes('beta-4'))
      ? 3
      : 2;

  useEffect(() => {
    const newActiveVersion =
      versionSet === 'default'
        ? FUEL_TESTNET_UPPER_CASE
        : versionSet === 'nightly'
          ? 'Nightly'
          : 'Beta-4';
    setActiveVersion(newActiveVersion);
  }, [versionSet]);

  return (
    <Dropdown isOpen={opened} onOpenChange={setOpened}>
      <Dropdown.Trigger
        intent='base'
        variant='outlined'
        css={
          opened ? { ...styles.trigger, ...styles.triggerOpen } : styles.trigger
        }
      >
        Version: {activeVersion}
      </Dropdown.Trigger>
      <Dropdown.Menu
        disabledKeys={versionSet === 'default' ? [FUEL_TESTNET] : [versionSet]}
        css={styles.dropdownMenu}
        // biome-ignore lint/suspicious/noExplicitAny:
        onAction={(action: any) => {
          if (setVersion) {
            if (action === FUEL_TESTNET) {
              setVersion(FUEL_TESTNET_UPPER_CASE);
            } else if (action === 'beta-4') {
              setVersion('Beta-4');
            } else {
              setVersion('Nightly');
            }
            if (isDoc) {
              let book = splitPath[bookIndex];
              if (book === 'wallet') {
                book = 'wallet/install';
              } else if (book === 'graphql') {
                book = 'graphql/overview';
              }
              const link = `/docs/${
                action === FUEL_TESTNET ? '' : `${action}/`
              }${book}`;
              router.push(link);
            }
          }
        }}
      >
        <Dropdown.MenuItem
          css={styles.menuItem}
          key={FUEL_TESTNET}
          aria-label={FUEL_TESTNET}
        >
          <Text>{FUEL_TESTNET_UPPER_CASE}</Text>
          {versionSet === 'default' && <Icon icon='Check' color='accent11' />}
        </Dropdown.MenuItem>

        <Dropdown.MenuItem
          css={styles.menuItem}
          key='beta-4'
          aria-label='beta-4'
        >
          <Text>Beta-4</Text>
          {versionSet === 'beta-4' && <Icon icon='Check' color='accent11' />}
        </Dropdown.MenuItem>

        <Dropdown.MenuItem
          css={styles.menuItem}
          key='nightly'
          aria-label='nightly'
        >
          <Text>Nightly</Text>
          {versionSet === 'nightly' && <Icon icon='Check' color='accent11' />}
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const styles = {
  menuItem: cssObj({
    fontSize: '$xs',
    '@sm': {
      fontSize: '$sm',
    },
    justifyContent: 'space-between',
  }),
  dropdownMenu: cssObj({
    bg: '$bodyColor !important',
    border: '1px solid $gray6 !important',
  }),
  trigger: cssObj({
    border: 'none',
    height: '100%',
    fontSize: '$xs',
    width: '140px',
    '@sm': {
      fontSize: '$sm',
      width: '154px',
    },
    '&:hover': {
      border: 'none !important',
      'html[class="fuel_light-theme"] &': {
        bg: '$gray4 !important',
      },
      'html[class="fuel_dark-theme"] &': {
        bg: '#151718 !important',
      },
    },
  }),
  triggerOpen: cssObj({
    'html[class="fuel_light-theme"] &': {
      bg: '$gray4 !important',
    },
    'html[class="fuel_dark-theme"] &': {
      bg: '#151718 !important',
    },
  }),
};
