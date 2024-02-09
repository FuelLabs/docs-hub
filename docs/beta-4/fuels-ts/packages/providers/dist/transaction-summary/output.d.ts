import type { Output, OutputCoin, OutputContract, OutputContractCreated, OutputVariable } from '@fuel-ts/transactions';
import { OutputType } from '@fuel-ts/transactions';
/** @hidden */
export declare function getOutputsByType<T = Output>(outputs: Output[], type: OutputType): T[];
/** @hidden */
export declare function getOutputsContractCreated(outputs: Output[]): OutputContractCreated[];
/** @hidden */
export declare function getOutputsCoin(outputs: Output[]): OutputCoin[];
/** @hidden */
export declare function getOutputsChange(outputs: Output[]): OutputCoin[];
/** @hidden */
export declare function getOutputsContract(outputs: Output[]): OutputContract[];
/** @hidden */
export declare function getOutputsVariable(outputs: Output[]): OutputVariable[];
//# sourceMappingURL=output.d.ts.map