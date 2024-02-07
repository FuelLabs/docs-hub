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

describe('Transactions by owner', () => {
  test('get transactions with ts', async () => {
    const TRANSACTIONS_BY_OWNER_QUERY = `
      query Transactions($address: Address) {
        transactionsByOwner(owner: $address, first: 5) {
          nodes {
            id
            inputs {
              __typename
              ... on InputCoin {
                owner
                utxoId
                amount
                assetId
              }
              ... on InputContract {
                utxoId
                contract {
                  id
                }
              }
              ... on InputMessage {
                sender
                recipient
                amount
                data
              }
            }
            outputs {
              __typename
              ... on CoinOutput {
                to
                amount
                assetId
              }
              ... on ContractOutput {
                inputIndex
                balanceRoot
                stateRoot
              }
              ... on ChangeOutput {
                to
                amount
                assetId
              }
              ... on VariableOutput {
                to
                amount
                assetId
              }
              ... on ContractCreated {
                contract {
                  id
                }
                stateRoot
              }
            }
            status {
              __typename
              ... on FailureStatus {
                reason
                programState {
                  returnType
                }
              }
            }
          }
        }
      }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    };

    const getTransactions = async () => {
      const response = await fetch('https://beta-4.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: TRANSACTIONS_BY_OWNER_QUERY,
          variables: args,
        }),
      });
      const json = await response.json();
      console.log('TRANSACTIONS:', json.data.transactionsByOwner);
      expect(json.data.transactionsByOwner.nodes.length).toBeTruthy();
    };

    await getTransactions();
  });

  test('get transactions with apollo', async () => {
    const TRANSACTIONS_BY_OWNER_QUERY = `
      query Transactions($address: Address) {
        transactionsByOwner(owner: $address, first: 5) {
          nodes {
            id
            inputs {
              __typename
              ... on InputCoin {
                owner
                utxoId
                amount
                assetId
              }
              ... on InputContract {
                utxoId
                contract {
                  id
                }
              }
              ... on InputMessage {
                sender
                recipient
                amount
                data
              }
            }
            outputs {
              __typename
              ... on CoinOutput {
                to
                amount
                assetId
              }
              ... on ContractOutput {
                inputIndex
                balanceRoot
                stateRoot
              }
              ... on ChangeOutput {
                to
                amount
                assetId
              }
              ... on VariableOutput {
                to
                amount
                assetId
              }
              ... on ContractCreated {
                contract {
                  id
                }
                stateRoot
              }
            }
            status {
              __typename
              ... on FailureStatus {
                reason
                programState {
                  returnType
                }
              }
            }
          }
        }
      }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    };

    const getTransactions = async () => {
      const response = await apolloClient.query({
        query: gql(TRANSACTIONS_BY_OWNER_QUERY),
        variables: args,
      });
      console.log('TRANSACTIONS:', response.data.transactionsByOwner);
      expect(response.data.transactionsByOwner.nodes.length).toBeTruthy();
    };

    await getTransactions();
  });

  test('get transactions with urql', async () => {
    const TRANSACTIONS_BY_OWNER_QUERY = `
      query Transactions($address: Address) {
        transactionsByOwner(owner: $address, first: 5) {
          nodes {
            id
            inputs {
              __typename
              ... on InputCoin {
                owner
                utxoId
                amount
                assetId
              }
              ... on InputContract {
                utxoId
                contract {
                  id
                }
              }
              ... on InputMessage {
                sender
                recipient
                amount
                data
              }
            }
            outputs {
              __typename
              ... on CoinOutput {
                to
                amount
                assetId
              }
              ... on ContractOutput {
                inputIndex
                balanceRoot
                stateRoot
              }
              ... on ChangeOutput {
                to
                amount
                assetId
              }
              ... on VariableOutput {
                to
                amount
                assetId
              }
              ... on ContractCreated {
                contract {
                  id
                }
                stateRoot
              }
            }
            status {
              __typename
              ... on FailureStatus {
                reason
                programState {
                  returnType
                }
              }
            }
          }
        }
      }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    };

    const getTransactions = async () => {
      const response = await urqlClient
        .query(TRANSACTIONS_BY_OWNER_QUERY, args)
        .toPromise();
      console.log('TRANSACTIONS:', response.data.transactionsByOwner);
      expect(response.data.transactionsByOwner.nodes.length).toBeTruthy();
    };

    await getTransactions();
  });
});

export {};
