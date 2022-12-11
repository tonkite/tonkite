import { TransactionDescriptionKind } from '../TransactionDescriptionKind';

export interface MergePrepareTransactionDescription {
  type: 'merge-prepare';
  kind: TransactionDescriptionKind.MERGE_PREPARE;
}
