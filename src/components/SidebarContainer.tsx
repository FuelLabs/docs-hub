import { cssObj } from '@fuel-ui/css';
import { Box, FuelLogo, Link } from '@fuel-ui/react';

import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';

import { AltSidebar } from './AltSidebar';

interface SidebarContainerProps {
  allNavs?: NavOrder[];
  versions?: Versions;
}

export function SidebarContainer({ allNavs, versions }: SidebarContainerProps) {
  return (
    <Box css={styles.sidebar}>
      <Box css={styles.logo}>
        <Link href="/" className="logo">
          <FuelLogo size={30} />
        </Link>
      </Box>

      <Box>
        <AltSidebar allNavs={allNavs} versions={versions} />
      </Box>
    </Box>
  );
}

export const styles = {
  sidebar: cssObj({
    backgroundColor: '$bodyColor',
    'html[class="fuel_light-theme"] &': {
      backgroundColor: 'white',
    },
    display: 'none',
    padding: '$8',
    height: 'calc(100vh - 64px)',
    overflowY: 'auto',
    '@xl': {
      display: 'block',
    },
  }),
  logo: cssObj({
    mb: '$8',
  }),
};
