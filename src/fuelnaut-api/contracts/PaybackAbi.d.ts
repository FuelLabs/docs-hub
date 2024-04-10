/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.79.0
  Forc version: 0.49.3
  Fuel-Core version: 0.22.1
*/

import type {
  BigNumberish,
  BN,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from 'fuels';

interface PaybackAbiInterface extends Interface {
  functions: {
    attack_success: FunctionFragment;
    pay_back: FunctionFragment;
    send_funds: FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'attack_success', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'pay_back', values: []): Uint8Array;
  encodeFunctionData(functionFragment: 'send_funds', values: []): Uint8Array;

  decodeFunctionData(functionFragment: 'attack_success', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'pay_back', data: BytesLike): DecodedValue;
  decodeFunctionData(functionFragment: 'send_funds', data: BytesLike): DecodedValue;
}

export class PaybackAbi extends Contract {
  interface: PaybackAbiInterface;
  functions: {
    attack_success: InvokeFunction<[], boolean>;
    pay_back: InvokeFunction<[], void>;
    send_funds: InvokeFunction<[], void>;
  };
}
