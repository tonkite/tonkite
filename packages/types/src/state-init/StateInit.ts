import { Cell, HashmapE } from 'ton3-core';
import { TickTock } from './tick-tock';
import { SimpleLibrary } from './simple-library';

/**
 * _ split_depth:(Maybe (## 5)) special:(Maybe TickTock)
 *   code:(Maybe ^Cell) data:(Maybe ^Cell)
 *   library:(HashmapE 256 SimpleLib) = StateInit;
 */

export interface StateInit {
  splitDepth: number | null;
  special: TickTock | null;
  code: Cell | null;
  data: Cell | null;
  libraries: HashmapE<bigint, SimpleLibrary> | null;
}
