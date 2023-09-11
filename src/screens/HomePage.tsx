import { cssObj } from '@fuel-ui/css';
import { Box, Text, Heading, Grid } from '@fuel-ui/react';
import { Sidebar } from '~/src/components/Sidebar';
import type { SidebarNav } from '~/src/components/Sidebar';

import { Card } from '../components/Card';
import type { GuidesProps } from '../pages/guides';

import type { CardInfo } from './CategoryPage';

interface HomeScreenProps extends GuidesProps {
  homeNavigation: SidebarNav;
  homeCards: CardInfo[];
}

export function HomeScreen({
  guides,
  homeNavigation,
  homeCards,
}: HomeScreenProps) {
  return (
    <>
      <Box css={styles.sidebar}>
        <Box css={styles.sidebarContainer}>
          <Sidebar nav={homeNavigation} />
        </Box>
      </Box>
      <Box as="section" css={styles.section} className="Layout--section">
        <Box className="Layout--pageContent">
          <Box css={styles.heading}>
            <Heading as="h1" id="fuel-docs">
              Fuel Docs
            </Heading>
            <Text fontSize="lg">
              Learn about everything Fuel, all the way down to the bits and
              bytes.{' '}
            </Text>
          </Box>
          <Heading as="h3" id="getting-started">
            Getting Started
          </Heading>
          <Grid css={styles.grid}>
            {Object.keys(guides).map((guideName, index) => {
              const guideInfo = guides[guideName];
              if (index < 2) {
                return (
                  <Grid.Item key={guideName}>
                    <Card cardName={guideName} guideInfo={guideInfo} />
                  </Grid.Item>
                );
              }
            })}
          </Grid>
          <Heading as="h3" id="read-the-docs">
            Read the Docs
          </Heading>
          <Grid css={styles.grid}>
            {homeCards.map((card) => {
              return (
                <Grid.Item key={card.heading}>
                  <Card cardName={card.heading} cardInfo={card} />
                </Grid.Item>
              );
            })}
          </Grid>
        </Box>
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
  heading: cssObj({
    pb: '$10',
    mb: '$10',
    borderBottom: '1px solid $border',
  }),
  grid: cssObj({
    gap: '$6',
    margin: '$2 0 $8 0',

    '@xl': {
      gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
    },
  }),
  section: cssObj({
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
