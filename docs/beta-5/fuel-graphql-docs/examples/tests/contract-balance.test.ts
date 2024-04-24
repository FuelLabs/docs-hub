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

describe('Contract Balance', () => {
  test('get contract balance with ts', async () => {
    const CONTRACT_BALANCE_QUERY = `query ContractBalance($contract: ContractId, $asset: AssetId) {
      contractBalance(contract: $contract, asset: $asset) {
        contract
        amount
        assetId
      }
    }`;

    const args = {
      contract:
        '0xc9a5366c269438d294ef942bc962dd2e6c86121e3bca00192723eb7eb58fa87d',
      asset:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const getContractBalance = async () => {
      const response = await fetch('https://beta-5.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: CONTRACT_BALANCE_QUERY,
          variables: args,
        }),
      });
      const json = await response.json();
      console.log('CONTRACT BALANCE:', json.data.contractBalance);
      expect(json.data.contractBalance.amount).toBeTruthy();
    };

    await getContractBalance();
  });

  test('get contract balance with apollo', async () => {
    const CONTRACT_BALANCE_QUERY = `query ContractBalance($contract: ContractId, $asset: AssetId) {
      contractBalance(contract: $contract, asset: $asset) {
        contract
        amount
        assetId
      }
    }`;

    const args = {
      contract:
        '0xc9a5366c269438d294ef942bc962dd2e6c86121e3bca00192723eb7eb58fa87d',
      asset:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const getContractBalance = async () => {
      const response = await apolloClient.query({
        query: gql(CONTRACT_BALANCE_QUERY),
        variables: args,
      });
      console.log('CONTRACT BALANCE:', response.data.contractBalance);
      expect(response.data.contractBalance.amount).toBeTruthy();
    };

    await getContractBalance();
  });

  test('get contract balance with urql', async () => {
    const CONTRACT_BALANCE_QUERY = `query ContractBalance($contract: ContractId, $asset: AssetId) {
      contractBalance(contract: $contract, asset: $asset) {
        contract
        amount
        assetId
      }
    }`;

    const args = {
      contract:
        '0xc9a5366c269438d294ef942bc962dd2e6c86121e3bca00192723eb7eb58fa87d',
      asset:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    };

    const getContractBalance = async () => {
      const response = await urqlClient
        .query(CONTRACT_BALANCE_QUERY, args)
        .toPromise();
      console.log('CONTRACT BALANCE:', response.data.contractBalance);
      expect(response.data.contractBalance.amount).toBeTruthy();
    };

    await getContractBalance();
  });
});

export {};
