import { cssObj } from '@fuel-ui/css';
import { Link as FuelLink, Box, Icon, List, Text } from '@fuel-ui/react';
import Link from 'next/link';

import { Heading } from '../components/Heading';

export function HomePage() {
  const cards = {
    sway: (
      <Box css={styles.card}>
        <Icon icon="Code" size={40} stroke={0.7} />
        <Box.Stack>
          <Heading as="h3">Sway Language</Heading>
          <Text>
            Build powerful programs with a Rust-based DSL, but without
            needlessly verbose boilerplate.
          </Text>
          <List icon="ArrowRight">
            <List.Item>
              <Link href="/docs/sway">Sway</Link>
            </List.Item>
            <List.Item>
              <FuelLink
                href="https://fuellabs.github.io/sway/master/std/"
                isExternal
              >
                Standard Library
              </FuelLink>
            </List.Item>
            <List.Item>
              <FuelLink
                href="https://github.com/FuelLabs/sway-applications"
                isExternal
              >
                Examples Apps
              </FuelLink>
            </List.Item>
          </List>
        </Box.Stack>
      </Box>
    ),
    sdk: (
      <Box css={styles.card}>
        <Icon icon="Book" size={40} stroke={0.7} />
        <Box.Stack>
          <Heading as="h3">SDKs</Heading>
          <Text>
            Integrate Fuel into a Typescript or Rust project in minutes.
          </Text>
          <List icon="ArrowRight">
            <List.Item>
              <Link href="/docs/fuels-rs">Rust SDK</Link>
            </List.Item>
            <List.Item>
              <Link href="/docs/fuels-ts">Typescript SDK</Link>
            </List.Item>
            <List.Item>
              <Link href="/docs/wallet">Wallet SDK</Link>
            </List.Item>
          </List>
        </Box.Stack>
      </Box>
    ),
    network: (
      <Box css={styles.card}>
        <Icon icon="Bolt" size={40} stroke={0.7} />
        <Box.Stack>
          <Heading as="h3">Fuel Network</Heading>
          <Text>Find network specifications and resources.</Text>
          <List icon="ArrowRight">
            <List.Item>
              <Link href="/docs/about-fuel">About Fuel</Link>
            </List.Item>
            <List.Item>
              <Link href="/docs/graphql">GraphQL API</Link>
            </List.Item>
            <List.Item>
              <Link href="/docs/specs">Specs</Link>
            </List.Item>
            <List.Item>
              <FuelLink href="https://faucet-beta-3.fuel.network/" isExternal>
                Faucet
              </FuelLink>
            </List.Item>
          </List>
        </Box.Stack>
      </Box>
    ),
    tooling: (
      <Box css={styles.card}>
        <Icon icon="Settings" size={40} stroke={0.7} />
        <Box.Stack>
          <Heading as="h3">Tooling</Heading>
          <Text>
            Explore the best tooling you need to build your next web3 app in the
            fastest execution layer.
          </Text>
          <List icon="ArrowRight">
            <List.Item>
              <Link href="/docs/fuelup">Fuelup</Link>
            </List.Item>
            <List.Item>
              <Link href="/docs/forc">Forc</Link>
            </List.Item>
            <List.Item>
              <Link href="/docs/indexer">Indexer</Link>
            </List.Item>
          </List>
        </Box.Stack>
      </Box>
    ),
  };

  return (
    <Box css={styles.root}>
      <Heading as="h1" data-rank="h1" id="fuel-docs">
        Fuel Docs
      </Heading>
      <Text>
        Learn about everything Fuel, all the way down to the bits and bytes.{' '}
      </Text>
      <Box css={styles.cardList}>
        {cards.sway}
        {cards.sdk}
        {cards.tooling}
        {cards.network}
      </Box>
    </Box>
  );
}

const styles = {
  root: cssObj({
    py: '$6',
    px: '$6',

    '@xl': {
      px: '$14',
    },
  }),
  cardList: cssObj({
    display: 'grid',
    gap: '$6',
    py: '$8',

    '@xl': {
      gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
    },
  }),
  card: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '$6',
    padding: '$4 $6 $6',
    border: '1px solid $border',
    borderRadius: '$md',

    '& > .fuel_Icon': {
      mt: '3px',
      color: '$intentsBase8',
    },

    h3: {
      m: '$0',
      pt: '$2',
    },

    '.fuel_List': {
      mt: '$2',
    },

    '.fuel_ListItem a': {
      color: '$textLink',
    },
  }),
};
