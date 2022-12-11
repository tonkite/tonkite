import { TransactionDescriptionKind } from '../TransactionDescriptionKind';

export interface StorageTransactionDescription {
  type: 'storage';
  kind: TransactionDescriptionKind.STORAGE;
}
