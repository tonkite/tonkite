export type FutureSplitMerge =
  | { type: 'none' }
  | { type: 'split'; split_utime: number; interval: number }
  | { type: 'merge'; merge_utime: number; interval: number };
