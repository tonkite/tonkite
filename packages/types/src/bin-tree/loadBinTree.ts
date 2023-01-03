import { Slice } from 'ton3-core';
import { BinTree } from './BinTree';

export function loadBinTree<T>(node: Slice, loader: (slice: Slice) => T): BinTree<T> {
  if (!node.loadBit()) {
    // bt_leaf$0 {X:Type} leaf:X = BinTree X;
    return {
      type: 'leaf',
      leaf: loader(node),
    };
  }

  // bt_fork$1 {X:Type} left:^(BinTree X) right:^(BinTree X) = BinTree X;
  return {
    type: 'fork',
    left: loadBinTree(Slice.parse(node.loadRef()), loader),
    right: loadBinTree(Slice.parse(node.loadRef()), loader),
  };
}
