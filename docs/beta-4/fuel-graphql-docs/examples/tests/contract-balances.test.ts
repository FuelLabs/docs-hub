import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Client, cacheExchange, fetchExchange } from 'urql';
import 'isomorphic-fetch';

const apolloClient = new ApolloClient({
  uri: 'https://beta-4.fuel.network/graphql',
  cache: new InMemoryCache(),
});

const urqlClient = new Client({
  url: 'https://beta-4.fuel.network/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

describe('Contract balances', () => {
  test('get contract balances with ts', async () => {
    const CONTRACT_BALANCES_QUERY = `
          query ContractBalances($filter: ContractBalanceFilterInput!) {
            contractBalances(filter: $filter, first: 5) {
              nodes {
                amount
                assetId
              }
            }
          }`;

    const args = {
      filter: {
        contract:
          '0x0a98320d39c03337401a4e46263972a9af6ce69ec2f35a5420b1bd35784c74b1',
      },
    };

    const getContractBalances = async () => {
      const response = await fetch('https://beta-4.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: CONTRACT_BALANCES_QUERY,
          variables: args,
        }),
      });
      const json = await response.json();
      console.log('CONTRACT BALANCES:', json.data.contractBalances);
      expect(json.data.contractBalances.nodes).toBeTruthy();
    };

    await getContractBalances();
  });

  test('get contract balances with apollo', async () => {
    const CONTRACT_BALANCES_QUERY = `
          query ContractBalances($filter: ContractBalanceFilterInput!) {
            contractBalances(filter: $filter, first: 5) {
              nodes {
                amount
                assetId
              }
            }
          }`;

    const args = {
      filter: {
        contract:
          '0x0a98320d39c03337401a4e46263972a9af6ce69ec2f35a5420b1bd35784c74b1',
      },
    };

    const getContractBalances = async () => {
      const response = await apolloClient.query({
        query: gql(CONTRACT_BALANCES_QUERY),
        variables: args,
      });
      console.log('CONTRACT BALANCES:', response.data.contractBalances);
      expect(response.data.contractBalances.nodes).toBeTruthy();
    };

    await getContractBalances();
  });

  test('get contract balances with urql', async () => {
    const CONTRACT_BALANCES_QUERY = `
          query ContractBalances($filter: ContractBalanceFilterInput!) {
            contractBalances(filter: $filter, first: 5) {
              nodes {
                amount
                assetId
              }
            }
          }`;

    const args = {
      filter: {
        contract:
          '0x0a98320d39c03337401a4e46263972a9af6ce69ec2f35a5420b1bd35784c74b1',
      },
    };

    const getContractBalances = async () => {
      const response = await urqlClient
        .query(CONTRACT_BALANCES_QUERY, args)
        .toPromise();
      console.log('CONTRACT BALANCES:', response.data.contractBalances);
      expect(response.data.contractBalances.nodes).toBeTruthy();
    };

    await getContractBalances();
  });
});

export {};
