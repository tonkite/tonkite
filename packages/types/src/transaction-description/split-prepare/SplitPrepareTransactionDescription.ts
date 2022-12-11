import { TransactionDescriptionKind } from '../TransactionDescriptionKind';

export interface SplitPrepareTransactionDescription {
  type: 'split-prepare';
  kind: TransactionDescriptionKind.SPLIT_PREPARE;
}
