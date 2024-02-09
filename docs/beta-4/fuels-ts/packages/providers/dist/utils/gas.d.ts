import type { BN, BNInput } from '@fuel-ts/math';
import { type Input } from '@fuel-ts/transactions';
import type { GqlDependentCost, GqlGasCosts } from '../__generated__/operations';
import type { TransactionRequestInput } from '../transaction-request';
import type { TransactionResultReceipt } from '../transaction-response';
/** @hidden */
export declare const calculatePriceWithFactor: (gas: BN, gasPrice: BN, priceFactor: BN) => BN;
/** @hidden */
export declare const getGasUsedFromReceipts: (receipts: Array<TransactionResultReceipt>) => BN;
export declare function resolveGasDependentCosts(byteSize: BNInput, gasDependentCost: GqlDependentCost): BN;
export declare function gasUsedByInputs(inputs: Array<TransactionRequestInput | Input>, txBytesSize: number, gasCosts: GqlGasCosts): BN;
export interface IGetMinGasParams {
    inputs: Array<TransactionRequestInput | Input>;
    gasCosts: GqlGasCosts;
    txBytesSize: number;
    metadataGas: BN;
    gasPerByte: BN;
}
export declare function getMinGas(params: IGetMinGasParams): BN;
export interface IGetMaxGasParams {
    witnessesLength: number;
    witnessLimit?: BN;
    gasPerByte: BN;
    minGas: BN;
    gasLimit?: BN;
}
export declare function getMaxGas(params: IGetMaxGasParams): BN;
export declare function calculateMetadataGasForTxCreate({ gasCosts, stateRootSize, txBytesSize, contractBytesSize, }: {
    gasCosts: GqlGasCosts;
    contractBytesSize: BN;
    stateRootSize: number;
    txBytesSize: number;
}): BN;
export declare function calculateMetadataGasForTxScript({ gasCosts, txBytesSize, }: {
    gasCosts: GqlGasCosts;
    txBytesSize: number;
}): BN;
//# sourceMappingURL=gas.d.ts.map