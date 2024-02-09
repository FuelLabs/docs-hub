import type { Command } from 'commander';
import type { Commands } from '../types';
export declare function withProgram<CType extends Commands>(program: Command, _command: CType, fn: (program: Command) => void): () => Promise<void>;
//# sourceMappingURL=withProgram.d.ts.map