import { cssObj } from '@fuel-ui/css';
import { Box, Text, Heading, Grid } from '@fuel-ui/react';

import { Card } from '../components/Card';
import { SidebarContainer } from '../components/SidebarContainer';
import { FAUCET_LINK } from '../config/constants';
import type { GuidesProps } from '../pages/guides';
import type { NavOrder } from '../pages/index';

interface HomeScreenProps extends GuidesProps {
  allNavs: NavOrder[];
  isLatest: boolean;
}

export function HomeScreen({ guides, allNavs, isLatest }: HomeScreenProps) {
  const homeCards = [
    {
      header: 'Sway Language',
      cards: [
        {
          link: `/docs${isLatest ? '/latest' : ''}/sway`,
          isExternal: false,
          heading: 'Sway',
          headingIcon: 'Code',
          body: 'Read the official Sway documentation.',
        },
        {
          link: 'https://github.com/FuelLabs/sway-applications',
          isExternal: true,
          heading: 'Example Applications',
          headingIcon: 'Apps',
          body: 'Explore end-to-end applications written in Sway.',
        },
        {
          link: 'https://github.com/FuelLabs/sway-applications',
          isExternal: true,
          heading: 'Sway Playground',
          headingIcon: 'Browser',
          body: 'Get started experimenting with Sway in the browser.',
        },
      ],
    },
    {
      header: 'Tooling',
      cards: [
        {
          link: `/docs${isLatest ? '/latest' : ''}/forc`,
          isExternal: false,
          heading: 'Forc',
          headingIcon: 'Tool',
          body: 'Explore tools and commands building on Fuel.',
        },
        {
          link: `/docs${isLatest ? '/latest' : ''}/fuelup`,
          isExternal: false,
          heading: 'Fuelup',
          headingIcon: 'Settings',
          body: 'Learn more about the official package manager for Fuel.',
        },
        {
          link: `/docs${isLatest ? '/latest' : ''}/indexer`,
          isExternal: false,
          heading: 'Indexer',
          headingIcon: 'LayoutGrid',
          body: 'Find tooling to index data on the Fuel network.',
        },
      ],
    },
    {
      header: 'SDKs',
      cards: [
        {
          link: `/docs${isLatest ? '/latest' : ''}/fuels-rs`,
          isExternal: false,
          heading: 'Rust SDK',
          headingIcon: 'BrandRust',
          body: 'Read the documentation for the Rust SDK.',
        },
        {
          link: `/docs${isLatest ? '/latest' : ''}/fuels-ts`,
          isExternal: false,
          heading: 'Typescript SDK',
          headingIcon: 'BrandTypescript',
          body: 'Read the documentation for the TypeScript SDK.',
        },
        {
          link: `/docs${isLatest ? '/latest' : ''}/wallet`,
          isExternal: false,
          heading: 'Wallet',
          headingIcon: 'Wallet',
          body: 'Read the documentation for the Fuel Wallet.',
        },
      ],
    },
    {
      header: 'Network',
      cards: [
        {
          link: `/docs${isLatest ? '/latest' : ''}/graphql`,
          isExternal: false,
          heading: 'GraphQL API',
          headingIcon: 'ChartDots3',
          body: 'Read the documentation for the GraphQL API.',
        },
        {
          link: `/docs${isLatest ? '/latest' : ''}/specs`,
          isExternal: false,
          heading: 'Specs',
          headingIcon: 'ListDetails',
          body: 'Explore the specifications for the Fuel Network.',
        },
        {
          link: FAUCET_LINK,
          isExternal: true,
          heading: 'Faucet',
          headingIcon: 'Coin',
          body: 'Get beta-4 testnet tokens.',
        },
      ],
    },
  ];

  return (
    <>
      <SidebarContainer allNavs={allNavs} isLatest={isLatest} />
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
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  }),
  grid3: cssObj({
    '@xl': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  }),
  section: cssObj({
    padding: '$6',
    display: 'flex',
    flexDirection: 'column',
    mx: 'auto',
    maxWidth: '1000px',

    '@md': {
      py: '$8',
      px: '$8',
    },

    '@xl': {
      py: '$14',
      px: '$0',
      mx: '0',
    },

    '& .Layout--pageContent': {
      flex: 1,
    },
  }),
};
