import { Query } from "./query";

export function Balance() {
  const query = `query Balance($address: Address, $assetId: AssetId) {
        balance(owner: $address, assetId: $assetId) {
          owner
          amount
          assetId
        }
      }`;

  const args = {
    address:
      "0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871",
    assetId:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  };

  return <Query query={query} args={args} />;
}
