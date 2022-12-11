import { Coins } from 'ton3-core';
import { CurrencyCollection } from '../../../currency-collection';

export interface TransactionCreditPhase {
  dueFeesCollected: Coins | null;
  credit: CurrencyCollection;
}
