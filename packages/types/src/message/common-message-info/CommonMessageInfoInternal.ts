import { CommonMessageInfoKind } from './CommonMessageInfoKind';
import { Address, Coins } from 'ton3-core';
import { CurrencyCollection } from '../../currency-collection';

export interface CommonMessageInfoInternal {
  type: 'internal';
  ihrDisabled: boolean;
  bounce: boolean;
  bounced: boolean;
  src: Address;
  dest: Address;
  value: CurrencyCollection;
  ihrFee: Coins;
  forwardFee: Coins;
  createdLt: bigint;
  createdAt: number;
}
