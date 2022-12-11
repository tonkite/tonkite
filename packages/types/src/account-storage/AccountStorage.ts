import { CurrencyCollection } from '../currency-collection';
import { AccountState } from '../account-state/AccountState';

/**
 * account_storage$_ last_trans_lt:uint64
 *     balance:CurrencyCollection state:AccountState
 *   = AccountStorage;
 */
export interface AccountStorage {
  lastTransactionLt: bigint;
  balance: CurrencyCollection;
  state: AccountState;
}
