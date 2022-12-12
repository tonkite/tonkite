import { Builder } from 'ton3-core';
import { AccountState } from './AccountState';
import { storeStateInit } from '../state-init';

export const storeAccountState =
  (state: AccountState) =>
  (builder: Builder): Builder => {
    switch (state.type) {
      // account_active$1 _:StateInit = AccountState;
      case 'active':
        builder.storeBit(1);
        return storeStateInit(state)(builder);

      // account_frozen$01 state_hash:bits256 = AccountState;
      case 'frozen':
        return builder.storeUint(0b01, 2).storeBytes(state.stateHash);

      // account_uninit$00 = AccountState;
      default:
      case 'uninitialized':
        return builder.storeUint(0b00, 2);
    }
  };
