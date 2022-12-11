import { TransactionCreditPhase } from './TransactionCreditPhase';
import { Slice } from 'ton3-core';
import { loadCurrencyCollection } from '../../../currency-collection';

/**
 * tr_phase_credit$_ due_fees_collected:(Maybe Grams)
 *   credit:CurrencyCollection = TrCreditPhase;
 */

export function loadTransactionCreditPhase(slice: Slice): TransactionCreditPhase {
  const dueFeesCollected = slice.loadBit() ? slice.loadCoins() : null;
  const credit = loadCurrencyCollection(slice);

  return {
    dueFeesCollected,
    credit,
  };
}
