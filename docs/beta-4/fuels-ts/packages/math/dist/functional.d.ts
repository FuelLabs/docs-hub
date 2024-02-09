import type { BNInput } from './bn';
import type { FormatConfig } from './types';
/**
 * Functional shortcuts
 */
export declare function toNumber(value: BNInput): number;
export declare function toHex(value: BNInput, bytesPadding?: number): string;
export declare function toBytes(value: BNInput, bytesPadding?: number): Uint8Array;
export declare function formatUnits(value: BNInput, units?: number): string;
export declare function format(value: BNInput, options?: FormatConfig): string;
//# sourceMappingURL=functional.d.ts.map