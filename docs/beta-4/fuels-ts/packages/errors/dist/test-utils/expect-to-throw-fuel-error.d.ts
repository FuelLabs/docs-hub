import type { FuelError } from '../fuel-error';
type ExpectedFuelError = Partial<FuelError> & Required<Pick<FuelError, 'code'>>;
export declare const expectToThrowFuelError: (lambda: () => unknown, expectedError: ExpectedFuelError) => Promise<void>;
export {};
//# sourceMappingURL=expect-to-throw-fuel-error.d.ts.map