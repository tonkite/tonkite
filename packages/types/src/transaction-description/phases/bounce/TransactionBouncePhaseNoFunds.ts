import { TransactionBouncePhaseKind } from './TransactionBouncePhaseKind';
import { StorageUsedShort } from '../../../storage-used-short';
import { Coins } from 'ton3-core';

export interface TransactionBouncePhaseNoFunds {
  kind: TransactionBouncePhaseKind.NO_FUNDS;
  messageSize: StorageUsedShort;
  requestedForwardFees: Coins;
}
