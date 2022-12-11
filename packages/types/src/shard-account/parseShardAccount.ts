import { ShardAccount } from './ShardAccount';
import { Cell, Slice } from 'ton3-core';
import { loadShardAccount } from './loadShardAccount';

export function parseShardAccount(cell: Cell): ShardAccount {
  return loadShardAccount(Slice.parse(cell));
}
