import { Query } from "./query";

export function ContractBalances() {
  const query = `query ContractBalances($filter: ContractBalanceFilterInput!) {
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
        "0x0a98320d39c03337401a4e46263972a9af6ce69ec2f35a5420b1bd35784c74b1",
    },
  };

  return <Query query={query} args={args} />;
}
