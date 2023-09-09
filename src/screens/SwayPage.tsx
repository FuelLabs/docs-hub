import { cssObj } from '@fuel-ui/css';
import { Box, Card, Grid, Heading, Link } from '@fuel-ui/react';
import { Sidebar } from '~/src/components/Sidebar';

import { styles as homeStyles } from './HomePage';

const swayNavigation = {
  parent: {
    label: 'All Docs',
    link: '/',
  },
  navigation: [
    {
      label: 'Sway',
      slug: 'docs/sway',
      isExternal: false,
    },
    {
      label: 'Example Apps',
      slug: 'https://github.com/FuelLabs/sway-applications',
      isExternal: true,
    },
    {
      label: 'Standard Library',
      slug: 'https://fuellabs.github.io/sway/master/std',
      isExternal: true,
    },
    {
      label: 'Sway Core',
      slug: 'https://fuellabs.github.io/sway/master/core',
      isExternal: true,
    },
    {
      label: 'Forc',
      slug: 'docs/forc',
      isExternal: false,
    },
    {
      label: 'Fuelup',
      slug: 'docs/fuelup',
      isExternal: false,
    },
    {
      label: 'Indexer',
      slug: 'docs/indexer',
      isExternal: false,
    },
  ],
};

const swayCards = [
  {
    heading: 'Sway',
    cards: [
      {
        link: '/docs/sway',
        isExternal: false,
        heading: 'Sway',
        body: 'Read the Sway Docs',
      },
      {
        link: 'https://github.com/FuelLabs/sway-applications',
        isExternal: true,
        heading: 'Example Applications',
        body: 'Find examples of Sway applications',
      },
    ],
  },
  {
    heading: 'References',
    cards: [
      {
        link: 'https://fuellabs.github.io/sway/master/std',
        isExternal: true,
        heading: 'Standard Library',
        body: 'Reference for the std-lib',
      },
      {
        link: 'https://fuellabs.github.io/sway/master/core',
        isExternal: true,
        heading: 'Sway Core',
        body: 'Reference for Sway Core',
      },
    ],
  },
  {
    heading: 'Tooling',
    cards: [
      {
        link: '/docs/forc',
        isExternal: false,
        heading: 'Forc',
        body: 'Read the Forc Docs',
      },
      {
        link: '/docs/fuelup',
        isExternal: false,
        heading: 'Fuelup',
        body: 'Read the Fuelup Docs',
      },
      {
        link: '/docs/indexer',
        isExternal: false,
        heading: 'Indexer',
        body: 'Read the Indexer Docs',
      },
    ],
  },
];

export function SwayScreen() {
  return (
    <>
      <Box css={homeStyles.sidebar}>
        <Box css={homeStyles.sidebarContainer}>
          <Sidebar nav={swayNavigation} />
        </Box>
      </Box>
      <Box.Flex css={styles.section} as="section" justify={'column'}>
        <Box.Stack>
          {swayCards.map((section) => (
            <Box css={styles.container} key={section.heading}>
              <Heading as="h2">{section.heading}</Heading>
              <Grid gap="$4" css={styles.grid}>
                {section.cards.map((card) => (
                  <Grid.Item key={card.link}>
                    <Card css={styles.card}>
                      <Card.Header>
                        <Link isExternal={card.isExternal} href={card.link}>
                          <Heading as="h3">{card.heading}</Heading>
                        </Link>
                      </Card.Header>
                      <Card.Body>{card.body}</Card.Body>
                    </Card>
                  </Grid.Item>
                ))}
              </Grid>
            </Box>
          ))}
        </Box.Stack>
      </Box.Flex>
    </>
  );
}

const styles = {
  section: cssObj({
    padding: '$20',
  }),
  container: cssObj({
    marginBottom: '$12',
  }),
  grid: cssObj({
    gridTemplateColumns: '1fr',
    '@sm': {
      gridTemplateColumns: '1fr 1fr',
    },
  }),
  card: cssObj({
    padding: '$4',
    height: '200px',
  }),
};
