import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { HomeSidebar } from '~/src/components/HomeSidebar';

import type { GuidesProps } from '../pages/guides';

export function HomeScreen({ guides }: GuidesProps) {
  return (
    <>
      <Box css={styles.sidebar}>
        <Box css={styles.sidebarContainer}>
          <HomeSidebar />
        </Box>
      </Box>
      <Box as="section" css={styles.section} className="Layout--section">
        <Box className="Layout--pageContent"></Box>
      </Box>
    </>
  );
}

export const styles = {
  sidebar: cssObj({
    display: 'none',
    padding: '$8 $8 $0 $6',
    position: 'sticky',
    borderRight: '1px solid $border',
    bg: '$cardBg',
    top: 20,

    '@xl': {
      display: 'block',
    },
  }),
  sidebarContainer: cssObj({
    position: 'sticky',
    top: 20,
    maxHeight: 'calc(100vh - 40px)',
    overflowX: 'visible',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  section: cssObj({
    py: '$6',
    px: '$6',
    display: 'flex',
    flexDirection: 'column',

    '@md': {
      py: '$8',
      px: '$8',
    },

    '@xl': {
      py: '$14',
      px: '$0',
    },

    '& .fuel_Heading[data-rank="h1"]:first-of-type': {
      mt: '$0 !important',
    },

    '& .Layout--pageContent': {
      flex: 1,
    },
  }),
};
