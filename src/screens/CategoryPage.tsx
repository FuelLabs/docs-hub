import { cssObj } from '@fuel-ui/css';
import { Box, Grid, Heading } from '@fuel-ui/react';
import { Sidebar } from '~/src/components/Sidebar';
import type { SidebarNav } from '~/src/components/Sidebar';

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
  nav: SidebarNav;
  cards: CardsSection[];
}

export function CategoryScreen({ nav, cards }: CategoryProps) {
  return (
    <>
      <Box css={homeStyles.sidebar}>
        <Box css={homeStyles.sidebarContainer}>
          <Sidebar nav={nav} />
        </Box>
      </Box>
      <Box.Flex css={styles.section} as="section" justify={'column'}>
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
      </Box.Flex>
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
