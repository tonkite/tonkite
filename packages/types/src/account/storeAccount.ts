import { Builder } from 'ton3-core';
import { Account } from './Account';
import { storeAccountState } from '../account-state';

export const storeAccount =
  (account: Account | null) =>
  (builder: Builder): Builder => {
    if (account === null) {
      return builder.storeBit(0);
    }

    builder
      .storeBit(1) // account$1
      .storeAddress(account.address) // addr:MsgAddressInt
      // used:StorageUsed
      .storeVarUint(0, 7) // cells:(VarUInteger 7)
      .storeVarUint(0, 7) // bits:(VarUInteger 7)
      .storeVarUint(0, 7) // public_cells:(VarUInteger 7)
      .storeUint(0, 32) // last_paid:uint32
      .storeBit(0) // due_payment:(Maybe Grams)
      // storage
      .storeUint(0, 64) // last_trans_lt:uint64
      .storeCoins(account.storage.balance.coins) // balance:CurrencyCollection
      .storeBit(0); // other:ExtraCurrencyCollection

    storeAccountState(account.storage.state)(builder);

    return builder;
  };
