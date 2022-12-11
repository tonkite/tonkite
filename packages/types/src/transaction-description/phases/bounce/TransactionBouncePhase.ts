import { TransactionBouncePhaseNegativeFunds } from './TransactionBouncePhaseNegativeFunds';
import { TransactionBouncePhaseNoFunds } from './TransactionBouncePhaseNoFunds';
import { TransactionBouncePhaseOk } from './TransactionBouncePhaseOk';

export type TransactionBouncePhase =
  | TransactionBouncePhaseNegativeFunds
  | TransactionBouncePhaseNoFunds
  | TransactionBouncePhaseOk;
