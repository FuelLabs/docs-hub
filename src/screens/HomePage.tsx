import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import { Sidebar } from '~/src/components/Sidebar';

const homeNavigation = {
  navigation: [
    {
      label: 'Get Started',
      slug: '/get-started',
      isExternal: false,
    },
    {
      label: 'Sway Language',
      slug: '/sway',
      isExternal: false,
    },
    {
      label: 'SDKs',
      slug: '/sdk',
      isExternal: false,
    },
    {
      label: 'Network',
      slug: '/network',
      isExternal: false,
    },
  ],
};

export function HomeScreen() {
  return (
    <>
      <Box css={styles.sidebar}>
        <Box css={styles.sidebarContainer}>
          <Sidebar nav={homeNavigation} />
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
