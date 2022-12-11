import { Cell } from 'ton3-core';

/**
 * simple_lib$_ public:Bool root:^Cell = SimpleLib;
 */
export interface SimpleLibrary {
  isPublic: boolean;
  root: Cell;
}
