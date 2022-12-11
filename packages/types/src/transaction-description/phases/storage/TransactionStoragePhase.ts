import { Coins } from 'ton3-core';
import { AccountStatusChange } from '../../../account-status-change';

export interface TransactionStoragePhase {
  storageFeesCollected: Coins;
  storageFeesDue: Coins | null;
  statusChange: AccountStatusChange;
}
