import type { AbstractAddress } from '@fuel-ts/interfaces';
import type { BN } from '@fuel-ts/math';
import type { CallResult } from '@fuel-ts/providers';
import { ScriptRequest } from './script-request';
import type { ContractCall, InvocationScopeLike } from './types';
export declare const decodeContractCallScriptResult: (callResult: CallResult, contractId: AbstractAddress, isOutputDataHeap: boolean, logs?: Array<any>) => Uint8Array[];
export declare const getContractCallScript: (functionScopes: InvocationScopeLike[], maxInputs: BN) => ScriptRequest<ContractCall[], Uint8Array[]>;
//# sourceMappingURL=contract-call-script.d.ts.map