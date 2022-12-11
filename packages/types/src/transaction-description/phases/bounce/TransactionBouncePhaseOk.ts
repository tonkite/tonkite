import { TransactionBouncePhaseKind } from './TransactionBouncePhaseKind';
import { StorageUsedShort } from '../../../storage-used-short';
import { Coins } from 'ton3-core';

export interface TransactionBouncePhaseOk {
  kind: TransactionBouncePhaseKind.OK;
  messageSize: StorageUsedShort;
  messageFees: Coins;
  forwardFees: Coins;
}
