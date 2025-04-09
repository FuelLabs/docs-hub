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
          heading={'Fuel for Users'}
          description='Users can get started with Fuel by using Fuel Bridge and by using dApps that are built on Fuel.'
          href='/guides/user-quickstart'
          icon='User'
        />
        <Card
          heading={'Smart Contract Developer'}
          description={'Generate and deploy a smart contract in Sway.'}
          href={'/guides/contract-quickstart'}
          icon={'Script'}
        />

        <Card
          heading={'Frontend / Fullstack Developer'}
          description={'Generate a full-stack counter contract dapp on Fuel.'}
          href={'/guides/frontend-quickstart'}
          icon={'BoxPadding'}
        />

        <Card
          heading={'Node Operator'}
          description={'Get started running a node or validator on Fuel.'}
          href={'https://docs.fuel.network/docs/node-operator/'}
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
