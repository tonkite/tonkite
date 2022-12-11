import { Slice } from 'ton3-core';
import { loadAccountStatusChange } from '../../../account-status-change';
import { TransactionStoragePhase } from './TransactionStoragePhase';

/**
 * tr_phase_storage$_ storage_fees_collected:Grams
 *   storage_fees_due:(Maybe Grams)
 *   status_change:AccStatusChange
 *   = TrStoragePhase;
 */

export function loadTransactionStoragePhase(slice: Slice): TransactionStoragePhase {
  const storageFeesCollected = slice.loadCoins();
  const storageFeesDue = slice.loadBit() ? slice.loadCoins() : null;
  const statusChange = loadAccountStatusChange(slice);

  return {
    storageFeesCollected,
    storageFeesDue,
    statusChange,
  };
}
