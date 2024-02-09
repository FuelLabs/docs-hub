/// <reference types="node" />
import type { ChildProcessWithoutNullStreams } from 'child_process';
import type { FuelsConfig } from '../../types';
export type FuelCoreNode = {
    bindIp: string;
    accessIp: string;
    port: number;
    providerUrl: string;
    chainConfig: string;
    killChildProcess: () => void;
};
export type KillNodeParams = {
    core: ChildProcessWithoutNullStreams;
    killFn: (pid: number) => void;
    state: {
        isDead: boolean;
    };
};
export declare const killNode: (params: KillNodeParams) => () => void;
export declare const createTempChainConfig: (coreDir: string) => string;
export declare const startFuelCore: (config: FuelsConfig) => Promise<FuelCoreNode>;
export declare const autoStartFuelCore: (config: FuelsConfig) => Promise<FuelCoreNode | undefined>;
//# sourceMappingURL=startFuelCore.d.ts.map