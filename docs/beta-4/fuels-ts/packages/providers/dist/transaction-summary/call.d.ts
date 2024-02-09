import { type JsonAbi } from '@fuel-ts/abi-coder';
import type { BN } from '@fuel-ts/math';
import type { ReceiptCall } from '@fuel-ts/transactions';
type GetFunctionCallProps = {
    abi: JsonAbi;
    receipt: ReceiptCall;
    rawPayload?: string;
    maxInputs: BN;
};
export declare const getFunctionCall: ({ abi, receipt, rawPayload, maxInputs }: GetFunctionCallProps) => {
    amount?: BN | undefined;
    assetId?: string | undefined;
    functionSignature: string;
    functionName: string;
    argumentsProvided: {} | undefined;
};
export {};
//# sourceMappingURL=call.d.ts.map