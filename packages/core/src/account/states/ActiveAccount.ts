import { AccountStatus } from '../AccountStatus';
import { Cell } from 'ton3-core';

export interface ActiveAccount {
  status: AccountStatus.ACTIVE;
  frozenHash: null;
  code: Cell;
  data: Cell;
}
