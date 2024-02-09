import type { FSWatcher } from 'chokidar';
import type { FuelsConfig } from '../../types';
import type { FuelCoreNode } from './startFuelCore';
export declare const closeAllFileHandlers: (handlers: FSWatcher[]) => void;
export declare const buildAndDeploy: (config: FuelsConfig) => Promise<import("../../types").DeployedContract[]>;
export declare const getConfigFilepathsToWatch: (config: FuelsConfig) => string[];
export type DevState = {
    config: FuelsConfig;
    watchHandlers: FSWatcher[];
    fuelCore?: FuelCoreNode;
};
export declare const workspaceFileChanged: (state: DevState) => (_event: string, path: string) => Promise<void>;
export declare const configFileChanged: (state: DevState) => (_event: string, path: string) => Promise<void>;
export declare const dev: (config: FuelsConfig) => Promise<void>;
//# sourceMappingURL=index.d.ts.map