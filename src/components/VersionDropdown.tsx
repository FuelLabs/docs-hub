import { cssObj } from '@fuel-ui/css';
import { Dropdown, Text, Icon } from '@fuel-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useSetVersion } from '../hooks/useVersion';

export default function VersionDropdown({ isLatest }: { isLatest: boolean }) {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const setVersion = useSetVersion();
  const splitPath = router.asPath.split('/');
  const isDoc = router.asPath.includes('docs');
  const bookIndex = isLatest ? 3 : 2;
  return (
    <Dropdown isOpen={opened} onOpenChange={setOpened}>
      <Dropdown.Trigger
        size="sm"
        intent="base"
        variant="outlined"
        css={
          opened ? { ...styles.trigger, ...styles.triggerOpen } : styles.trigger
        }
      >
        Version: {isLatest ? 'Latest' : 'Beta-4'}
      </Dropdown.Trigger>
      <Dropdown.Menu
        disabledKeys={isLatest ? ['latest'] : ['beta-4']}
        css={styles.dropdownMenu}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAction={(action: any) => {
          if (setVersion) {
            if (action === 'beta-4') {
              setVersion('Beta-4');
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
          key="beta-4"
          aria-label="beta-4"
        >
          <Text>Beta-4</Text>
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
    fontSize: '$sm',
    justifyContent: 'space-between',
  }),
  dropdownMenu: cssObj({
    bg: '$bodyColor !important',
    border: '1px solid $gray7',
  }),
  trigger: cssObj({
    border: 'none',
    '&:hover': {
      border: 'none !important',
      bg: '$gray4 !important',
    },
  }),
  triggerOpen: cssObj({
    bg: '$gray4',
  }),
};
