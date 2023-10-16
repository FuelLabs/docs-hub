import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';

import type { NavOrder } from '../pages';
import type { Versions } from '../pages/[...slug]';

import { AltSidebar } from './AltSidebar';

interface SidebarContainerProps {
  isLatest: boolean;
  allNavs: NavOrder[];
  versions?: Versions;
}

export function SidebarContainer({
  isLatest,
  allNavs,
  versions,
}: SidebarContainerProps) {
  return (
    <Box
      css={
        isLatest
          ? { ...styles.sidebar, ...styles.sidebarLatest }
          : { ...styles.sidebar, ...styles.sidebarDefault }
      }
    >
      <Box
        css={
          isLatest
            ? { ...styles.sidebarContainer, ...styles.sidebarContainerLatest }
            : {
                ...styles.sidebarContainer,
                ...styles.sidebarContainerDefault,
              }
        }
      >
        <AltSidebar allNavs={allNavs} versions={versions} />
      </Box>
    </Box>
  );
}

export const styles = {
  sidebar: cssObj({
    display: 'none',
    padding: '0 $8 0 $6',
    position: 'sticky',
    borderRight: '1px solid $border',
    bg: '$cardBg',

    '@xl': {
      display: 'block',
    },
  }),
  sidebarDefault: cssObj({
    maxHeight: 'calc(100vh - 70px)',
    top: 70,
  }),
  sidebarLatest: cssObj({
    maxHeight: 'calc(100vh - 106px)',
    top: 106,
  }),
  sidebarContainer: cssObj({
    position: 'sticky',
    paddingTop: '$8',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  sidebarContainerDefault: cssObj({
    maxHeight: 'calc(100vh - 104px)',
  }),
  sidebarContainerLatest: cssObj({
    maxHeight: 'calc(100vh - 140px)',
  }),
};
