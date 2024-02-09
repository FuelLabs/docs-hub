import type { BN } from '@fuel-ts/math';
import type { GqlConsensusParameters, GqlFeeParameters } from '../__generated__/operations';
type FeeParams = Pick<GqlFeeParameters, 'gasPerByte' | 'gasPriceFactor'> | {
    gasPerByte: BN | number;
    gasPriceFactor: BN | number;
};
export type CalculateTransactionFeeParams = {
    gasUsed: BN;
    rawPayload: string;
    consensusParameters: Pick<GqlConsensusParameters, 'gasCosts'> & {
        feeParams: FeeParams;
    };
};
export declare const calculateTransactionFee: (params: CalculateTransactionFeeParams) => {
    fee: BN;
    minFee: BN;
    maxFee: BN;
    feeFromGasUsed: BN;
};
export {};
//# sourceMappingURL=calculate-transaction-fee.d.ts.map