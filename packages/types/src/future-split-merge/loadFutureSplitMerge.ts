import { Slice } from 'ton3-core';
import { FutureSplitMerge } from './FutureSplitMerge';

export function loadFutureSplitMerge(slice: Slice): FutureSplitMerge {
  if (!slice.loadBit()) {
    return { type: 'none' };
  }

  if (!slice.loadBit()) {
    return {
      type: 'split',
      split_utime: slice.loadUint(32),
      interval: slice.loadUint(32),
    };
  }

  return {
    type: 'merge',
    merge_utime: slice.loadUint(32),
    interval: slice.loadUint(32),
  };
}
