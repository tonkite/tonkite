export interface BlockId {
  readonly workchain: number;
  readonly shard: bigint;
  readonly seqno: number;
  readonly rootHash: Uint8Array;
  readonly fileHash: Uint8Array;
}
