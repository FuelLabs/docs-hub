import type { BytesLike } from 'ethers';
import type { Coin } from './coin';
import type { MessageCoin } from './message';
export type RawCoin = {
    utxoId: string;
    owner: string;
    amount: string;
    assetId: string;
    maturity: string;
    blockCreated: string;
    txCreatedIdx: string;
};
export type RawMessage = {
    amount: string;
    sender: string;
    assetId: string;
    recipient: string;
    data: string;
    nonce: string;
    daHeight: string;
};
export type RawResource = RawCoin | RawMessage;
export type Resource = Coin | MessageCoin;
/** @hidden */
export type ExcludeResourcesOption = {
    utxos?: BytesLike[];
    messages?: BytesLike[];
};
/** @hidden */
export declare const isRawCoin: (resource: RawResource) => resource is RawCoin;
/** @hidden */
export declare const isRawMessage: (resource: RawResource) => resource is RawMessage;
/** @hidden */
export declare const isCoin: (resource: Resource) => resource is Coin;
/** @hidden */
export declare const isMessage: (resource: Resource) => resource is MessageCoin;
//# sourceMappingURL=resource.d.ts.map