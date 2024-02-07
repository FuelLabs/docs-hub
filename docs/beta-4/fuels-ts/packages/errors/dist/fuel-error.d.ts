import { ErrorCode } from './error-codes';
export declare class FuelError extends Error {
    static readonly CODES: typeof ErrorCode;
    readonly VERSIONS: {
        FORC: string;
        FUEL_CORE: string;
        FUELS: string;
    };
    static parse(e: unknown): FuelError;
    code: ErrorCode;
    constructor(code: ErrorCode, message: string);
    toObject(): {
        code: ErrorCode;
        name: string;
        message: string;
        VERSIONS: {
            FORC: string;
            FUEL_CORE: string;
            FUELS: string;
        };
    };
}
//# sourceMappingURL=fuel-error.d.ts.map