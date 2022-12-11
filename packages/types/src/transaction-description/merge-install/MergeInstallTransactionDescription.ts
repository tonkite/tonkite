import { TransactionDescriptionKind } from '../TransactionDescriptionKind';

export interface MergeInstallTransactionDescription {
  type: 'merge-install';
  kind: TransactionDescriptionKind.MERGE_INSTALL;
}
