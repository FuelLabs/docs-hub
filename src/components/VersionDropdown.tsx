import { cssObj } from '@fuel-ui/css';
import { Dropdown, Text, Icon } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { FUEL_TESTNET, FUEL_TESTNET_UPPER_CASE } from '../config/constants';
import { useSetVersion } from '../hooks/useVersion';

export default function VersionDropdown({ isLatest }: { isLatest: boolean }) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const setVersion = useSetVersion();
  const splitPath = router.asPath.split('/');
  const isDoc =
    router.asPath.includes('docs') && !router.asPath.includes('/intro/');
  const bookIndex = isLatest ? 3 : 2;
  return (
    <Dropdown isOpen={opened} onOpenChange={setOpened}>
      <Dropdown.Trigger
        intent="base"
        variant="outlined"
        css={
          opened ? { ...styles.trigger, ...styles.triggerOpen } : styles.trigger
        }
      >
        Version: {isLatest ? 'Latest' : FUEL_TESTNET_UPPER_CASE}
      </Dropdown.Trigger>
      <Dropdown.Menu
        disabledKeys={isLatest ? ['latest'] : [FUEL_TESTNET]}
        css={styles.dropdownMenu}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAction={(action: any) => {
          if (setVersion) {
            if (action === FUEL_TESTNET) {
              setVersion(FUEL_TESTNET_UPPER_CASE);
            } else if (action === 'latest') {
              setVersion('Latest');
            }
            if (isDoc) {
              let book = splitPath[bookIndex];
              if (book === 'wallet') {
                book = 'wallet/install';
              } else if (book === 'graphql') {
                book = 'graphql/overview';
              }
              router.push(
                `/docs/${action === 'latest' ? 'latest/' : ''}${book}`
              );
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
          {!isLatest && <Icon icon="Check" color="accent11" />}
        </Dropdown.MenuItem>

        <Dropdown.MenuItem
          css={styles.menuItem}
          key="latest"
          aria-label="latest"
        >
          <Text>Latest</Text>
          {isLatest && <Icon icon="Check" color="accent11" />}
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
    width: '154px',
    '@sm': {
      fontSize: '$sm',
    },
    '&:hover': {
      border: 'none !important',
      bg: '$gray4 !important',
    },
  }),
  triggerOpen: cssObj({
    bg: '$gray4',
  }),
};
