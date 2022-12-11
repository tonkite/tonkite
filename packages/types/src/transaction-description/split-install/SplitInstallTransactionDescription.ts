import { TransactionDescriptionKind } from '../TransactionDescriptionKind';

export interface SplitInstallTransactionDescription {
  type: 'split-install';
  kind: TransactionDescriptionKind.SPLIT_INSTALL;
}
