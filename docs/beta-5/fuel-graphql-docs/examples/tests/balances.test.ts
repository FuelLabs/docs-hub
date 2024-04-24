import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';

const apolloClient = new ApolloClient({
  uri: 'https://beta-5.fuel.network/graphql',
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: 'https://beta-5.fuel.network/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

describe('Balances', () => {
  test('get balances with ts', async () => {
    const BALANCES_QUERY = `query Balances($filter: BalanceFilterInput) {
      balances(filter: $filter, first: 5) {
        nodes {
          amount
          assetId
        }
      }
    }`;

    const args = {
      filter: {
        owner:
          '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
      },
    };

    const getBalances = async () => {
      const response = await fetch('https://beta-5.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: BALANCES_QUERY,
          variables: args,
        }),
      });
      const json = await response.json();
      console.log('BALANCES:', json.data.balances);
      expect(json.data.balances.nodes).toBeTruthy();
    };

    await getBalances();
  });

  test('get balances with apollo', async () => {
    const BALANCES_QUERY = `query Balances($filter: BalanceFilterInput) {
      balances(filter: $filter, first: 5) {
        nodes {
          amount
          assetId
        }
      }
    }`;

    const args = {
      filter: {
        owner:
          '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
      },
    };

    const getBalances = async () => {
      const response = await apolloClient.query({
        query: gql(BALANCES_QUERY),
        variables: args,
      });
      console.log('BALANCES:', response.data.balances);
      expect(response.data.balances.nodes).toBeTruthy();
    };

    await getBalances();
  });

  test('get balances with urql', async () => {
    const BALANCES_QUERY = `query Balances($filter: BalanceFilterInput) {
      balances(filter: $filter, first: 5) {
        nodes {
          amount
          assetId
        }
      }
    }`;

    const args = {
      filter: {
        owner:
          '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
      },
    };

    const getBalances = async () => {
      const response = await urqlClient.query(BALANCES_QUERY, args).toPromise();
      console.log('BALANCES:', response.data.balances);
      expect(response.data.balances.nodes).toBeTruthy();
    };

    await getBalances();
  });
});

export {};
