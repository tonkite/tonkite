export type BinTree<T> =
  | { type: 'leaf'; leaf: T }
  | { type: 'fork'; left: BinTree<T>; right: BinTree<T> };
