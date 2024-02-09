import { Coder } from '@fuel-ts/abi-coder';
import type { BN } from '@fuel-ts/math';
export declare enum PolicyType {
    GasPrice = 1,
    WitnessLimit = 2,
    Maturity = 4,
    MaxFee = 8
}
export type Policy = PolicyGasPrice | PolicyWitnessLimit | PolicyMaturity | PolicyMaxFee;
export type PolicyGasPrice = {
    type: PolicyType.GasPrice;
    data: BN;
};
export type PolicyWitnessLimit = {
    type: PolicyType.WitnessLimit;
    data: BN;
};
export type PolicyMaturity = {
    type: PolicyType.Maturity;
    data: number;
};
export type PolicyMaxFee = {
    type: PolicyType.MaxFee;
    data: BN;
};
export declare const sortPolicies: (policies: Policy[]) => Policy[];
export declare class PoliciesCoder extends Coder<Policy[], Policy[]> {
    constructor();
    encode(policies: Policy[]): Uint8Array;
    decode(data: Uint8Array, offset: number, policyTypes: number): [Policy[], number];
}
//# sourceMappingURL=policy.d.ts.map