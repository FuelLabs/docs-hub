import type * as asm from '@fuels/vm-asm';
/**
 * A wrapper around fuel-asm to make dynamic instructions and convert to different formats
 */
export declare class InstructionSet {
    #private;
    constructor(...args: asm.Instruction[]);
    entries(): asm.Instruction[];
    push(...args: asm.Instruction[]): void;
    concat(ops: asm.Instruction[]): asm.Instruction[];
    extend(ops: asm.Instruction[]): void;
    toBytes(): Uint8Array;
    toHex(): string;
    toString(): string;
    byteLength(): number;
}
//# sourceMappingURL=instruction-set.d.ts.map