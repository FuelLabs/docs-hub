export type ForcToml = {
    project: {
        authors?: string[];
        entry: string;
        license: string;
        name: string;
    };
    workspace: {
        members: string[];
    };
    dependencies: {
        [key: string]: string;
    };
};
export declare enum SwayType {
    contract = "contract",
    script = "script",
    predicate = "predicate"
}
export declare const forcFiles: Map<string, ForcToml>;
export declare const swayFiles: Map<string, SwayType>;
export declare function readForcToml(path: string): ForcToml;
export declare function readSwayType(path: string): SwayType;
export declare function getContractName(contractPath: string): string;
export declare function getContractCamelCase(contractPath: string): string;
export declare function getBinaryPath(contractPath: string): string;
export declare function getABIPath(contractPath: string): string;
export declare function getABIPaths(paths: string[]): Promise<string[]>;
export declare const getStorageSlotsPath: (contractPath: string) => string;
//# sourceMappingURL=forcUtils.d.ts.map