import type { AbstractAddress } from '@fuel-ts/interfaces';
/**
 * @hidden
 */
export declare class ChangeOutputCollisionError extends Error {
    name: string;
    message: string;
}
/**
 * @hidden
 */
export declare class NoWitnessAtIndexError extends Error {
    readonly index: number;
    name: string;
    constructor(index: number);
}
/**
 * @hidden
 */
export declare class NoWitnessByOwnerError extends Error {
    readonly owner: AbstractAddress;
    name: string;
    constructor(owner: AbstractAddress);
}
//# sourceMappingURL=errors.d.ts.map