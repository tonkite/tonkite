import { Address } from 'ton3-core';

export interface TransactionId {
  readonly account: Address;
  readonly lt: bigint;
  readonly hash: Uint8Array;
}
