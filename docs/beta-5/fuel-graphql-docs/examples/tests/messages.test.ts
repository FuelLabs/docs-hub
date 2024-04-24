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

describe('Messages', () => {
  test('get messages with ts', async () => {
    const MESSAGES_QUERY = `
      query MessageInfo($address: Address) {
          messages(owner: $address, first: 5) {
            nodes {
              amount
              sender
              recipient
              nonce
              data
              daHeight
            }
          }
        }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    };

    const getMessages = async () => {
      const response = await fetch('https://beta-5.fuel.network/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: MESSAGES_QUERY,
          variables: args,
        }),
      });
      const json = await response.json();
      console.log('MESSAGES:', json.data.messages);
      expect(json.data.messages.nodes).toBeTruthy();
    };

    await getMessages();
  });

  test('get messages with apollo', async () => {
    const MESSAGES_QUERY = `
      query MessageInfo($address: Address) {
          messages(owner: $address, first: 5) {
            nodes {
              amount
              sender
              recipient
              nonce
              data
              daHeight
              
            }
          }
        }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    };

    const getMessages = async () => {
      const response = await apolloClient.query({
        query: gql(MESSAGES_QUERY),
        variables: args,
      });
      console.log('MESSAGES:', response.data.messages);
      expect(response.data.messages.nodes).toBeTruthy();
    };

    await getMessages();
  });

  test('get messages with urql', async () => {
    const MESSAGES_QUERY = `
      query MessageInfo($address: Address) {
          messages(owner: $address, first: 5) {
            nodes {
              amount
              sender
              recipient
              nonce
              data
              daHeight
            }
          }
        }`;

    const args = {
      address:
        '0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871',
    };

    const getMessages = async () => {
      const response = await urqlClient.query(MESSAGES_QUERY, args).toPromise();
      console.log('MESSAGES:', response.data.messages);
      expect(response.data.messages.nodes).toBeTruthy();
    };

    await getMessages();
  });
});

export {};
