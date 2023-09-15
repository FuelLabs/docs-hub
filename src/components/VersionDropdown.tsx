import { cssObj } from '@fuel-ui/css';
import { Dropdown } from '@fuel-ui/react';
import { useRouter } from 'next/router';

import { useSetVersion } from '../hooks/useVersion';

export default function VersionDropdown({ isLatest }: { isLatest: boolean }) {
  const router = useRouter();
  const setVersion = useSetVersion();
  return (
    <Dropdown>
      <Dropdown.Trigger intent="base" variant="outlined">
        {isLatest ? 'latest' : 'beta-4'}
      </Dropdown.Trigger>
      <Dropdown.Menu
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAction={(action: any) => {
          if (setVersion) {
            if (action === 'beta-4') {
              setVersion('beta-4');
              const path = router.asPath.replace('/latest/', '/');
              router.push(path);
            } else if (action === 'latest') {
              setVersion('latest');
              const path = router.asPath
                .replace('docs/', 'docs/latest/')
                .replace('guides', 'guides/latest');
              router.push(path);
            }
          }
        }}
      >
        <Dropdown.MenuItem
          css={!isLatest ? styles.hidden : {}}
          key="beta-4"
          aria-label="beta-4"
        >
          Beta-4
        </Dropdown.MenuItem>

        <Dropdown.MenuItem
          css={isLatest ? styles.hidden : {}}
          key="latest"
          aria-label="latest"
        >
          Latest
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const styles = {
  hidden: cssObj({
    visibility: 'hidden',
    display: 'none',
  }),
};
