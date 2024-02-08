export declare const safeExec: <TResult = unknown, TError extends Error = Error>(lambda: () => TResult) => Promise<{
    error: TError | undefined;
    result: TResult | undefined;
}>;
//# sourceMappingURL=safeExec.d.ts.map