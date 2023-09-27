import { cssObj } from '@fuel-ui/css';
import { Dropdown } from '@fuel-ui/react';
import { useRouter } from 'next/router';

import { useSetVersion } from '../hooks/useVersion';

export default function VersionDropdown({ isLatest }: { isLatest: boolean }) {
  const router = useRouter();
  const setVersion = useSetVersion();
  const splitPath = router.asPath.split('/');
  const isDoc = router.asPath.includes('docs');
  const bookIndex = isLatest ? 3 : 2;
  return (
    <Dropdown>
      <Dropdown.Trigger intent="base" variant="outlined" css={styles.trigger}>
        {isLatest ? 'latest' : 'beta-4'}
      </Dropdown.Trigger>
      <Dropdown.Menu
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAction={(action: any) => {
          if (setVersion) {
            if (action === 'beta-4') {
              setVersion('beta-4');
            } else if (action === 'latest') {
              setVersion('latest');
            }
            if (isDoc) {
              router.push(
                `/docs/${action === 'latest' ? 'latest/' : ''}${
                  splitPath[bookIndex]
                }`
              );
            }
          }
        }}
      >
        <Dropdown.MenuItem
          css={!isLatest ? styles.hidden : styles.menuItem}
          key="beta-4"
          aria-label="beta-4"
        >
          beta-4
        </Dropdown.MenuItem>

        <Dropdown.MenuItem
          css={isLatest ? styles.hidden : styles.menuItem}
          key="latest"
          aria-label="latest"
        >
          latest
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const styles = {
  hidden: cssObj({
    display: 'none',
  }),
  menuItem: cssObj({
    justifyContent: 'center',
    fontSize: '16px',
  }),
  trigger: cssObj({
    border: 'none',
    width: '120px',
    '&:hover': {
      border: 'none !important',
    },
  }),
};
