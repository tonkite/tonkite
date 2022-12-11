import { TransactionDescriptionKind } from '../TransactionDescriptionKind';
import { TransactionStoragePhase } from '../phases/storage';
import { TransactionComputePhase } from '../phases/compute';
import { TransactionActionPhase } from '../phases/action';

export interface TickTockTransactionDescription {
  type: 'tick-tock';
  kind: TransactionDescriptionKind.TICK_TOCK;
  isTock: boolean;
  storage: TransactionStoragePhase;
  compute: TransactionComputePhase;
  action: TransactionActionPhase | null;
  aborted: boolean;
  destroyed: boolean;
}
