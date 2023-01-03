import { ShardDescription } from '../shard-description';

export interface Shard {
  id: bigint;
  description: ShardDescription;
}
