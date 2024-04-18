import { cssObj } from '@fuel-ui/css';
// import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Card as FuelCard,
  Link as FuelLink,
  Grid,
  Heading,
  Text,
} from '@fuel-ui/react';
import { styles as cardStyles } from './Card';

interface CardProps {
  heading: string;
  description: string;
  href: string;
  icon?: string;
}

function Card({ heading, description, href, icon }: CardProps) {
  return (
    <FuelLink href={href} css={styles.link}>
      <Grid.Item css={styles.gridItem}>
        <FuelCard css={cardStyles.card}>
          <FuelCard.Body>
            <Heading iconSize={24} leftIcon={icon} as='h4'>
              {heading}
            </Heading>
            <Text>{description}</Text>
          </FuelCard.Body>
        </FuelCard>
      </Grid.Item>
    </FuelLink>
  );
}

export function QuickstartCards() {
  return (
    <Box>
      <Grid css={styles.grid}>
        <Card
          heading={'Smart Contract Developer'}
          description={'Get started your first smart contract in Sway.'}
          href={'/guides/contract-quickstart'}
          icon={'Script'}
        />

        <Card
          heading={'Frontend / Fullstack Developer'}
          description={'Generate a full-stack counter contract dapp on Fuel'}
          href={'/guides/frontend-quickstart'}
          icon={'BoxPadding'}
        />

        <Card
          heading={'Node Operator'}
          description={'Get started running a node on Fuel'}
          href={'/guides/running-a-node'}
          icon={'Broadcast'}
        />
      </Grid>
    </Box>
  );
}

const styles = {
  grid: cssObj({
    gap: '$6',
    margin: '$2 0 $8 0',
  }),
  gridItem: { ...cardStyles.root, cursor: 'pointer' },
  link: cssObj({
    '&:hover': {
      textDecoration: 'none !important',
    },
  }),
};
