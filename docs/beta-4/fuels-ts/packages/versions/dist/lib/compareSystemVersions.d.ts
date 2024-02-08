export interface ICompareVersionsParams {
    systemForcVersion: string;
    systemFuelCoreVersion: string;
}
export declare function compareSystemVersions(params: ICompareVersionsParams): {
    systemForcIsGt: boolean;
    systemFuelCoreIsGt: boolean;
    systemForcIsEq: boolean;
    systemFuelCoreIsEq: boolean;
};
//# sourceMappingURL=compareSystemVersions.d.ts.map