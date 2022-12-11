import { TransactionComputePhase } from '../phases/compute';
import { TransactionDescriptionKind } from '../TransactionDescriptionKind';
import { TransactionStoragePhase } from '../phases/storage';
import { TransactionCreditPhase } from '../phases/credit';
import { TransactionActionPhase } from '../phases/action';
import { TransactionBouncePhase } from '../phases/bounce';

export interface OrdinaryTransactionDescription {
  type: 'ordinary';
  creditFirst: boolean;
  storage: TransactionStoragePhase | null;
  credit: TransactionCreditPhase | null;
  compute: TransactionComputePhase;
  action: TransactionActionPhase | null;
  aborted: boolean;
  bounce: TransactionBouncePhase | null;
  destroyed: boolean;
}
