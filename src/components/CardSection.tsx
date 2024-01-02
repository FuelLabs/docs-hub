import { cssObj } from '@fuel-ui/css';
import { Box, Grid } from '@fuel-ui/react';

import type { CardInfo } from '../components/Card';
import { Card } from '../components/Card';

interface CardSectionProps {
  cardsInfo: CardInfo[];
  isNightly: boolean;
}

export function CardSection({ cardsInfo, isNightly }: CardSectionProps) {
  return (
    <Box css={styles.root}>
      <Grid css={styles.grid}>
        {cardsInfo.map((card) => {
          return (
            <Grid.Item key={card.heading}>
              <Card
                cardName={card.heading}
                cardInfo={card}
                isNightly={isNightly}
              />
            </Grid.Item>
          );
        })}
      </Grid>
    </Box>
  );
}

export const styles = {
  root: cssObj({
    my: '$8',
  }),
  grid: cssObj({
    gap: '$6',
    margin: '$2 0 $8 0',
    '@lg': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  }),
};
