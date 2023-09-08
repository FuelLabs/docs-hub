import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import { SidebarLink } from './SidebarLink';

const homeNavigation = [
  {
    label: 'Sway',
    slug: '/docs/sway',
    isExternal: false,
  },
  {
    label: 'Example Apps',
    slug: 'https://github.com/FuelLabs/sway-applications',
    isExternal: true,
  },
  {
    label: 'Standard Library',
    slug: 'https://fuellabs.github.io/sway/master/std/',
    isExternal: true,
  },
  {
    label: 'Sway Core',
    slug: 'https://fuellabs.github.io/sway/master/core/',
    isExternal: true,
  },
  {
    label: 'fuelup',
    slug: '/docs/fuelup',
    isExternal: false,
  },
  {
    label: 'forc',
    slug: '/docs/forc',
    isExternal: false,
  },
  {
    label: 'Indexer',
    slug: '/docs/indexer',
    isExternal: false,
  },
  {
    label: 'Rust SDK',
    slug: '/docs/fuels-rs',
    isExternal: false,
  },
  {
    label: 'TypeScript SDK',
    slug: '/docs/fuels-ts',
    isExternal: false,
  },
  {
    label: 'Wallet',
    slug: '/docs/wallet',
    isExternal: false,
  },
  {
    label: 'GraphQL API',
    slug: '/docs/graphql',
    isExternal: false,
  },
  {
    label: 'Specs',
    slug: '/docs/specs',
    isExternal: false,
  },
  {
    label: 'Faucet',
    slug: 'https://faucet-beta-4.fuel.network/',
    isExternal: true,
  },
];

export function HomeSidebar() {
  return (
    <Box.Stack as="nav" css={styles.root} className="Sidebar">
      {homeNavigation.map((category) => (
        <Box key={category.label}>
          <SidebarLink item={category} />
        </Box>
      ))}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    gap: '$1',
    pb: '$4',
  }),
};
