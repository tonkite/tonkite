import { Coins } from 'ton3-core';
import { AccountStatusChange } from '../../../account-status-change';
import { StorageUsedShort } from '../../../storage-used-short';

export interface TransactionActionPhase {
  success: boolean;
  valid: boolean;
  noFunds: boolean;
  statusChange: AccountStatusChange;
  totalForwardFees: Coins | null;
  totalActionFees: Coins | null;
  resultCode: number;
  resultArg: number | null;
  totalActions: number;
  specialActions: number;
  skippedActions: number;
  messagesCreated: number;
  actionListHash: Uint8Array;
  totalMessagesSize: StorageUsedShort;
}
