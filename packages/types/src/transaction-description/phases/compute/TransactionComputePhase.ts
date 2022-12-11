import { TransactionComputePhaseSkipped } from './skipped';
import { TransactionComputePhaseVM } from './vm';

export type TransactionComputePhase = TransactionComputePhaseSkipped | TransactionComputePhaseVM;
