import type { FuelsConfig } from '../../types';
type OnResultFn = () => void;
type OnErrorFn = (reason?: number | Error) => void;
export declare const onForcExit: (onResultFn: OnResultFn, onErrorFn: OnErrorFn) => (code: number | null) => void;
export declare const onForcError: (onError: OnErrorFn) => (err: Error) => void;
export declare const buildSwayProgram: (config: FuelsConfig, path: string) => Promise<void>;
export declare function buildSwayPrograms(config: FuelsConfig): Promise<void>;
export {};
//# sourceMappingURL=buildSwayPrograms.d.ts.map