import { Slice } from 'ton3-core';
import { TickTock } from './TickTock';

export function loadTickTock(slice: Slice): TickTock {
  const tick = !!slice.loadBit();
  const tock = !!slice.loadBit();

  return {
    tick,
    tock,
  };
}
