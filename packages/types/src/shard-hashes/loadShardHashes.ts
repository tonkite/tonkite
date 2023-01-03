import { HashmapE, Slice, Utils } from 'ton3-core';
import { BinTree, loadBinTree } from '../bin-tree';
import { loadShardDescription, ShardDescription } from '../shard-description';
import { Shard } from './Shard';
import { WorkchainShards } from './WorkchainShards';

/**
 * Loads `_ (HashmapE 32 ^(BinTree ShardDescr)) = ShardHashes;`
 */
export function loadShardHashes(slice: Slice): WorkchainShards[] {
  const allShards = HashmapE.parse(32, slice, {
    deserializers: {
      key: (k) => Utils.Numbers.bitsToIntUint(k, { type: 'int' }),
      value: (v) => {
        const walkShardBinTree = (
          node: BinTree<ShardDescription>,
          shard: bigint,
        ): [bigint, ShardDescription][] => {
          if (node.type === 'leaf') {
            return [[shard, node.leaf]];
          }

          const delta = (shard & (~shard + 1n)) >> 1n;

          return [
            ...walkShardBinTree(node.left, shard - delta),
            ...walkShardBinTree(node.right, shard + delta),
          ];
        };

        return walkShardBinTree(
          loadBinTree(Slice.parse(v.refs[0]), loadShardDescription),
          1n << 63n,
        );
      },
    },
  });

  return [...allShards].map(
    ([workchain, shards]): WorkchainShards => ({
      workchain,
      shards: shards.map(
        ([shard, description]): Shard => ({
          id: shard,
          description,
        }),
      ),
    }),
  );
}
