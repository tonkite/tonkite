import { Address, Coins } from 'ton3-core';

export interface CommonMessageInfoExternalIn {
  type: 'external-in';
  src: Address | null;
  dest: Address;
  importFee: Coins;
}
