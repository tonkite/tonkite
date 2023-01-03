import { AccountStatus } from '../AccountStatus';

export interface UninitializedAccount {
  status: AccountStatus.UNINITIALIZED;
  frozenHash: null;
  code: null;
  data: null;
}
