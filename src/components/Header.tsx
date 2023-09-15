import { cssObj } from '@fuel-ui/css';
import {
  Box,
  FuelLogo,
  Icon,
  Link,
  Dropdown,
  darkTheme,
  lightTheme,
} from '@fuel-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { useSetVersion } from '../hooks/useVersion';

import { MobileMenu } from './MobileMenu';
import { Navigation } from './Navigation';

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false });
const Search = dynamic(() => import('./Search'), { ssr: false });

interface HeaderProps {
  active: string;
  title?: string;
  isLatest: boolean;
}

export function Header({ active, title, isLatest }: HeaderProps) {
  const router = useRouter();
  const setVersion = useSetVersion();

  return (
    <Box.Flex as="header" css={styles.root}>
      <Link href="/" className="logo">
        <FuelLogo size={30} />
      </Link>
      <span id="lvl0" style={{ visibility: 'hidden', width: '0', height: '0' }}>
        {title}
      </span>
      <Box.Flex css={styles.navWrapper} grow={'1'} gap={'$4'}>
        <Navigation active={active} isLatest={isLatest} />
      </Box.Flex>
      <Box css={styles.desktop}>
        <Box.Stack direction="row" gap="$4" css={{ mr: '$4' }}>
          <Search title={title} />
          <ThemeToggler />
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
      <MobileMenu active={active} title={title} />
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

    [`.${darkTheme.theme} &`]: {
      backgroundColor: '$intentsBase2',
    },
    [`.${lightTheme.theme} &`]: {
      backgroundColor: '$white',
    },

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
  hidden: cssObj({
    visibility: 'hidden',
    display: 'none',
  }),
};
