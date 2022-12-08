import { Query } from "./query";

export function MessageInfo() {
  const query = `query MessageInfo($address: Address) {
    messages(owner: $address, first: 5) {
      nodes {
        amount
        sender
        recipient
        nonce
        data
        daHeight
        fuelBlockSpend
      }
    }
  }`;

  const args = {
    address:
      "0xf65d6448a273b531ee942c133bb91a6f904c7d7f3104cdaf6b9f7f50d3518871"
  };

  return <Query query={query} args={args} />;
}
