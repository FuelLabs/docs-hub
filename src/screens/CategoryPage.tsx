import { cssObj } from '@fuel-ui/css';
import { Box, Grid, Heading, Text } from '@fuel-ui/react';
// import { Sidebar } from '~/src/components/Sidebar';
// import type { SidebarNav } from '~/src/components/Sidebar';

import { Card } from '../components/Card';

import { styles as homeStyles } from './HomePage';

export type CardInfo = {
  link: string;
  isExternal: boolean;
  heading: string;
  headingIcon?: string;
  body: string;
};

interface CardsSection {
  heading: string;
  cards: CardInfo[];
}

interface CategoryProps {
  // nav: SidebarNav;
  cards: CardsSection[];
  header: string;
  description: string;
}

export function CategoryScreen({
  // nav,
  cards,
  header,
  description,
}: CategoryProps) {
  return (
    <>
      <Box css={homeStyles.sidebar}>
        <Box css={homeStyles.sidebarContainer}>
          {/* <Sidebar nav={nav} /> */}
        </Box>
      </Box>
      <Box as="section" css={styles.section} className="Layout--section">
        <Box className="Layout--pageContent">
          <Box css={homeStyles.heading}>
            <Heading as="h1" id="fuel-docs">
              {header}
            </Heading>
            <Text fontSize="lg">{description}</Text>
          </Box>
          <Box.Stack css={{ width: '100%' }}>
            {cards.map((section) => (
              <Box css={styles.container} key={section.heading}>
                <Heading as="h2">{section.heading}</Heading>
                <Grid css={homeStyles.grid}>
                  {section.cards.map((card: CardInfo) => (
                    <Card
                      key={card.heading}
                      cardInfo={card}
                      cardName={card.heading}
                    />
                  ))}
                </Grid>
              </Box>
            ))}
          </Box.Stack>
        </Box>
      </Box>
    </>
  );
}

const styles = {
  section: cssObj({
    padding: '$10 $20 $20 $20',
  }),
  container: cssObj({
    marginBottom: '$12',
  }),
};
