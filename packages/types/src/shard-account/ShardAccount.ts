import { TransactionId } from '../transaction';
import { Account } from '../account/Account';

export interface ShardAccount {
  account: Account;
  lastTransactionId: TransactionId;
}
