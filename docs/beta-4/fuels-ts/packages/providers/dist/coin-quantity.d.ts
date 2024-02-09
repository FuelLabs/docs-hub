import type { BigNumberish, BN } from '@fuel-ts/math';
import type { BytesLike } from 'ethers';
export type CoinQuantityLike = [amount: BigNumberish, assetId?: BytesLike, max?: BigNumberish] | {
    amount: BigNumberish;
    assetId?: BytesLike;
    max?: BigNumberish;
};
export type CoinQuantity = {
    amount: BN;
    assetId: string;
    max?: BN;
};
/** @hidden */
export declare const coinQuantityfy: (coinQuantityLike: CoinQuantityLike) => CoinQuantity;
export interface IAddAmountToAssetParams {
    assetId: string;
    amount: BN;
    coinQuantities: CoinQuantity[];
}
export declare const addAmountToAsset: (params: IAddAmountToAssetParams) => CoinQuantity[];
//# sourceMappingURL=coin-quantity.d.ts.map