import { Query } from './query';

export function LatestBlocks() {
  const query = `query LatestBlocks {
    blocks(last: 5) {
      nodes {
        id
        transactions {
          id
          inputAssetIds
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
          gasPrice
        }
      }
    }
  }`;

  const args = {};

  return <Query query={query} args={args} />;
}
