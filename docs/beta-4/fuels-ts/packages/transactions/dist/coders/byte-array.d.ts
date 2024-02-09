import { Coder } from '@fuel-ts/abi-coder';
import type { BytesLike } from 'ethers';
export declare class ByteArrayCoder extends Coder<BytesLike, string> {
    #private;
    length: number;
    constructor(length: number);
    encode(value: BytesLike): Uint8Array;
    decode(data: Uint8Array, offset: number): [string, number];
}
//# sourceMappingURL=byte-array.d.ts.map