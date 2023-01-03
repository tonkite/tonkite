import { AccountStatus } from '../AccountStatus';

export interface FrozenAccount {
  status: AccountStatus.FROZEN;
  frozenHash: Uint8Array;
  code: null;
  data: null;
}
