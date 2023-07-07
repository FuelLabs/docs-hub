import { cssObj } from '@fuel-ui/css';
import { Box, Icon, List, Text } from '@fuel-ui/react';
import Link from 'next/link';

import { Heading } from '../components/Heading';

export function HomePage() {
  return (
    <Box css={styles.root}>
      <Heading as="h1" data-rank="h1" id="fuel-docs">
        Fuel Docs
      </Heading>
      <Text>
        Learn about everything Fuel. From the purpose of the project, all the
        way down to the bits and bytes.{' '}
      </Text>
      <Box css={styles.cardList}>
        {/* Network */}
        <Box css={styles.card}>
          <Icon icon="Bolt" size={40} stroke={0.7} />
          <Box.Stack>
            <Heading as="h3">Our network</Heading>
            <Text>
              Start to learn right now all specs and definitions about Fuel
              Network. You'll see why we are the fastest execution and how it
              works.
            </Text>
            <List icon="ArrowRight">
              <List.Item>
                <Link href="/">GraphQL API</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Specs</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Faucet</Link>
              </List.Item>
            </List>
          </Box.Stack>
        </Box>
        {/* Sway */}
        <Box css={styles.card}>
          <Icon icon="Code" size={40} stroke={0.7} />
          <Box.Stack>
            <Heading as="h3">Sway Language</Heading>
            <Text>
              Based on Rust, and includes syntax to leverage a blockchain VM
              without needlessly verbose boilerplate.
            </Text>
            <List icon="ArrowRight">
              <List.Item>
                <Link href="/">Sway</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Standard Library</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Examples Apps</Link>
              </List.Item>
            </List>
          </Box.Stack>
        </Box>
        {/* Tooling */}
        <Box css={styles.card}>
          <Icon icon="Settings" size={40} stroke={0.7} />
          <Box.Stack>
            <Heading as="h3">Tooling</Heading>
            <Text>
              We have the best tooling you need to build your next web3 app in
              the fastest execution layer.
            </Text>
            <List icon="ArrowRight">
              <List.Item>
                <Link href="/">Fuelup</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Forc</Link>
              </List.Item>
            </List>
          </Box.Stack>
        </Box>
        {/* SDKs */}
        <Box css={styles.card}>
          <Icon icon="Book" size={40} stroke={0.7} />
          <Box.Stack>
            <Heading as="h3">SDKs</Heading>
            <Text>
              Our SKDs are the best way to start building in our network. Using
              Typescript and Rust, you can start building in minutes.
            </Text>
            <List icon="ArrowRight">
              <List.Item>
                <Link href="/">Rust SDK</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Typescript SDK</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Wallet SDK</Link>
              </List.Item>
              <List.Item>
                <Link href="/">Indexer</Link>
              </List.Item>
            </List>
          </Box.Stack>
        </Box>
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
