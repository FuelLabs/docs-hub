import type { Command } from 'commander';
import type { Commands, FuelsConfig, CommandEvent } from '../types';
export declare const withConfigErrorHandler: (err: Error, config?: FuelsConfig) => Promise<void>;
export declare function withConfig<CType extends Commands>(program: Command, command: CType, fn: (config: FuelsConfig, options?: Command) => Promise<Extract<CommandEvent, {
    type: CType;
}>['data']>): () => Promise<void>;
//# sourceMappingURL=withConfig.d.ts.map