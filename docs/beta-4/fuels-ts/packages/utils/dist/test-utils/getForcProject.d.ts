interface IGetForcProjectParams {
    projectDir: string;
    projectName: string;
}
export declare const getProjectDebugDir: (params: IGetForcProjectParams) => string;
export declare const getProjectTempDir: (params: IGetForcProjectParams) => string;
export declare const getProjectAbiPath: (params: IGetForcProjectParams) => string;
export declare const getProjectBinPath: (params: IGetForcProjectParams) => string;
export declare const getProjectStorageSlotsPath: (params: IGetForcProjectParams) => string;
export declare const getProjectAbiName: (params: IGetForcProjectParams) => string;
export declare const getProjectNormalizedName: (params: IGetForcProjectParams) => string;
export declare const getProjectAbi: (params: IGetForcProjectParams) => any;
export declare const getProjectStorageSlots: (params: IGetForcProjectParams) => any;
export declare const getForcProject: <T = unknown>(params: IGetForcProjectParams) => {
    name: string;
    storageSlots: {
        key: string;
        value: string;
    }[];
    normalizedName: string;
    debugDir: string;
    tempDir: string;
    binPath: string;
    binHexlified: string;
    abiPath: string;
    abiName: string;
    abiContents: T;
    inputGlobal: string;
};
export {};
//# sourceMappingURL=getForcProject.d.ts.map