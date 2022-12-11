import { TransactionComputePhaseSkipReason } from './TransactionComputePhaseSkipReason';

export interface TransactionComputePhaseSkipped {
  type: 'skipped';
  reason: TransactionComputePhaseSkipReason;
}
