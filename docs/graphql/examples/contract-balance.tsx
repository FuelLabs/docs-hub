import { Query } from './query';

export function ContractBalance() {
  const query = `query ContractBalance($contract: ContractId, $asset: AssetId) {
    contractBalance(contract: $contract, asset: $asset) {
      contract
      amount
      assetId
    }
  }`;

  const args = {
    contract:
      '0xc9a5366c269438d294ef942bc962dd2e6c86121e3bca00192723eb7eb58fa87d',
    asset: '0x0000000000000000000000000000000000000000000000000000000000000000',
  };

  return <Query query={query} args={args} />;
}
