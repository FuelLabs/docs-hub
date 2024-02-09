import type { Input, InputCoin, InputContract, InputMessage } from '@fuel-ts/transactions';
import { InputType } from '@fuel-ts/transactions';
/** @hidden */
export declare function getInputsByType<T = Input>(inputs: Input[], type: InputType): T[];
/** @hidden */
export declare function getInputsCoin(inputs: Input[]): InputCoin[];
/** @hidden */
export declare function getInputsMessage(inputs: Input[]): InputMessage[];
/** @hidden */
export declare function getInputsContract(inputs: Input[]): InputContract[];
/** @hidden */
export declare function getInputFromAssetId(inputs: Input[], assetId: string): InputCoin | InputMessage | undefined;
/** @hidden */
export declare function getInputContractFromIndex(inputs: Input[], inputIndex: number): InputContract | undefined;
/** @hidden */
export declare function getInputAccountAddress(input: Input): string;
//# sourceMappingURL=input.d.ts.map