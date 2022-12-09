import { Query } from './query';

export function Balances() {
  const query = `query Balances($filter: BalanceFilterInput) {
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

  return <Query query={query} args={args} />;
}
