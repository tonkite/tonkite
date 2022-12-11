import type { AccountStatus } from '../account-status';
import type { CurrencyCollection } from '../currency-collection';
import { TransactionDescription } from '../transaction-description';
import { Message } from '../message';
import { HashUpdate } from '../hash-update';
import { TransactionId } from './TransactionId';

/**
 * transaction$0111 account_addr:bits256 lt:uint64
 *   prev_trans_hash:bits256 prev_trans_lt:uint64 now:uint32
 *   outmsg_cnt:uint15
 *   orig_status:AccountStatus end_status:AccountStatus
 *   ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]
 *   total_fees:CurrencyCollection state_update:^(HASH_UPDATE Account)
 *   description:^TransactionDescr = Transaction;
 */
export interface Transaction {
  accountAddress: Uint8Array;
  id: TransactionId;
  previousTransaction: TransactionId;
  now: number;
  outMessagesCount: number;
  originalStatus: AccountStatus;
  endStatus: AccountStatus;
  inMessage: Message | null;
  outMessages: Message[];
  totalFees: CurrencyCollection;
  stateUpdate: HashUpdate;
  description: TransactionDescription;
}
