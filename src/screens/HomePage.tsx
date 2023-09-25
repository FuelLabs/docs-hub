import { cssObj } from '@fuel-ui/css';
import { Box, Text, Heading, Grid, ButtonLink } from '@fuel-ui/react';
import { Sidebar } from '~/src/components/Sidebar';

import { Card } from '../components/Card';
import type { GuidesProps } from '../pages/guides';
import type { NavOrder } from '../pages/index';

import type { CardInfo } from './CategoryPage';

interface HomeCard {
  header: string;
  link?: string;
  cards: CardInfo[];
}

interface HomeScreenProps extends GuidesProps {
  allNavs: NavOrder[];
  homeCards: HomeCard[];
}

export function HomeScreen({ guides, allNavs, homeCards }: HomeScreenProps) {
  return (
    <>
      <Box css={styles.sidebar}>
        <Box css={styles.sidebarContainer}>
          <Sidebar allNavs={allNavs} />
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
            Get Started
          </Heading>
          <Grid css={{ ...styles.grid, ...styles.grid2 }}>
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

          {homeCards.map((cardSection) => {
            return (
              <Box key={cardSection.header}>
                <Box.Flex
                  justify={'space-between'}
                  css={styles.categoryHeading}
                >
                  <Heading as="h3" id="read-the-docs">
                    {cardSection.header}
                  </Heading>
                  {cardSection.link && (
                    <ButtonLink
                      href={cardSection.link}
                      rightIcon={'ArrowNarrowRight'}
                    >
                      See All
                    </ButtonLink>
                  )}
                </Box.Flex>
                <Grid css={{ ...styles.grid, ...styles.grid3 }}>
                  {cardSection.cards.map((card) => (
                    <Grid.Item key={card.heading}>
                      <Card cardName={card.heading} cardInfo={card} />
                    </Grid.Item>
                  ))}
                </Grid>
              </Box>
            );
          })}
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
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  heading: cssObj({
    pb: '$10',
    mb: '$10',
    borderBottom: '1px solid $border',
  }),
  categoryHeading: cssObj({
    mb: '$10',
    borderBottom: '1px solid $border',
  }),
  grid: cssObj({
    gap: '$6',
    margin: '$2 0 $8 0',
  }),
  grid2: cssObj({
    '@xl': {
      gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
    },
  }),
  grid3: cssObj({
    '@xl': {
      gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
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

    '& .Layout--pageContent': {
      flex: 1,
    },
  }),
};
