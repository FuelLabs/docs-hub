import { cssObj } from '@fuel-ui/css';
import { Box, ButtonLink } from '@fuel-ui/react';

import type { SidebarLinkItem } from '../types';

import { SidebarLink } from './SidebarLink';

type SidebarProps = {
  nav: {
    parent?: {
      label: string;
      link: string;
    };
    navigation: SidebarLinkItem[];
  };
};

export function Sidebar({ nav }: SidebarProps) {
  return (
    <Box.Stack as="nav" css={styles.root} className="Sidebar">
      {nav.parent && (
        <ButtonLink
          href={nav.parent.link}
          intent={'base'}
          leftIcon={'ArrowNarrowLeft'}
          css={styles.button}
          size={'sm'}
        >
          {nav.parent.label}
        </ButtonLink>
      )}
      {nav.navigation.map((category) => (
        <Box key={category.label}>
          <SidebarLink item={category} />
        </Box>
      ))}
    </Box.Stack>
  );
}

export const styles = {
  root: cssObj({
    gap: '$1',
    pb: '$4',
  }),
  button: cssObj({
    width: '100%',
    justifyContent: 'flex-start',
    py: '$2',
    '&:hover': {
      bg: '$intentsBase3 !important',
      textDecoration: 'none',
    },
  }),
};
