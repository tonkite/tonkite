import { Slice } from 'ton3-core';
import { loadFutureSplitMerge } from '../future-split-merge';
import { loadCurrencyCollection } from '../currency-collection';
import { ShardDescription } from './ShardDescription';

export function loadShardDescription(slice: Slice): ShardDescription {
  const type = slice.loadUint(4);
  const next = type === 0xa ? Slice.parse(slice.loadRef()) : null;

  return {
    seq_no: slice.loadUint(32),
    reg_mc_seqno: slice.loadUint(32),
    start_lt: slice.loadBigUint(64),
    end_lt: slice.loadBigUint(64),
    root_hash: slice.loadBytes(256),
    file_hash: slice.loadBytes(256),
    before_split: !!slice.loadBit(),
    before_merge: !!slice.loadBit(),
    want_split: !!slice.loadBit(),
    want_merge: !!slice.loadBit(),
    nx_cc_updated: !!slice.loadBit(),
    flags: slice.loadUint(3),
    next_catchain_seqno: slice.loadUint(32),
    next_validator_shard: slice.loadBigUint(64),
    min_ref_mc_seqno: slice.loadUint(32),
    gen_utime: slice.loadUint(32),
    split_merge_at: loadFutureSplitMerge(slice),
    fees_collected: loadCurrencyCollection(next ?? slice),
    funds_created: loadCurrencyCollection(next ?? slice),
  };
}
