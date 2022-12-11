import { Address } from 'ton3-core';
import { StorageInfo } from '../storage-info';
import { AccountStorage } from '../account-storage';
/**
 * account_none$0 = Account;
 * account$1 addr:MsgAddressInt storage_stat:StorageInfo
 *           storage:AccountStorage = Account;
 */
export type Account = {
  address: Address;
  storageStat: StorageInfo;
  storage: AccountStorage;
};
