import { cssObj } from '@fuel-ui/css';
import { Box, ButtonLink } from '@fuel-ui/react';
import VersionDropdown from './VersionDropdown';
import type { VersionSet } from '../types';
import dynamic from 'next/dynamic';

const ThemeToggler = dynamic(() => import('./ThemeToggler'), { ssr: false });

export function Navigation({ versionSet }: { versionSet: VersionSet }) {
  return (
    <Box.Stack direction="row" gap="$3">
      <ButtonLink
        size="sm"
        href={'https://forum.fuel.network/'}
        intent="base"
        css={styles.navItem}
        isExternal={true}
      >
        Forum
      </ButtonLink>
      <VersionDropdown versionSet={versionSet} />
      <ThemeToggler />
    </Box.Stack>
  );
}

const styles = {
  navItem: cssObj({
    display: 'none',
    '@sm': {
      display: 'flex',
    },
    '&:hover': {
      'html[class="fuel_light-theme"] &': {
        color: '#009957 !important',
      },
      'html[class="fuel_dark-theme"] &': {
        color: '$semanticLinkPrimaryColor !important',
      },

      textDecoration: 'none !important',
      '.fuel_Icon': {
        color: '$semanticLinkPrimaryColor !important',
      },
    },
  }),
};
