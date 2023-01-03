import { FutureSplitMerge } from '../future-split-merge';
import { CurrencyCollection } from '../currency-collection';

export interface ShardDescription {
  seq_no: number;
  reg_mc_seqno: number;
  start_lt: bigint;
  end_lt: bigint;
  root_hash: Uint8Array;
  file_hash: Uint8Array;
  before_split: boolean;
  before_merge: boolean;
  want_split: boolean;
  want_merge: boolean;
  nx_cc_updated: boolean;
  flags: number;
  next_catchain_seqno: number;
  next_validator_shard: bigint;
  min_ref_mc_seqno: number;
  gen_utime: number;
  split_merge_at: FutureSplitMerge;
  fees_collected: CurrencyCollection;
  funds_created: CurrencyCollection;
}
