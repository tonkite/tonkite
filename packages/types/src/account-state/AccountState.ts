import { AccountStateUninitialized } from './AccountStateUninitialized';
import { AccountStateActive } from './AccountStateActive';
import { AccountStateFrozen } from './AccountStateFrozen';

/**
 * account_uninit$00 = AccountState;
 * account_active$1 _:StateInit = AccountState;
 * account_frozen$01 state_hash:bits256 = AccountState;
 */
export type AccountState = AccountStateUninitialized | AccountStateActive | AccountStateFrozen;
