import { ScriptRequest, FunctionInvocationScope } from '@fuel-ts/program';
export declare class ScriptInvocationScope<TArgs extends Array<any> = Array<any>, TReturn = any> extends FunctionInvocationScope<TArgs, TReturn> {
    scriptRequest: ScriptRequest<TArgs, TReturn>;
    protected updateScriptRequest(): void;
    private buildScriptRequest;
}
//# sourceMappingURL=script-invocation-scope.d.ts.map