import { crc32 } from '../../utils';
import { BufferReader } from '../../buffer';
import { BlockIdExt, blockIdExt } from '../tonNode';

export interface RunMethodResult {
  mode: number;
  id: BlockIdExt;
  shardblk: BlockIdExt;
  shard_proof: Uint8Array | null;
  proof: Uint8Array | null;
  state_proof: Uint8Array | null;
  init_c7: Uint8Array | null;
  lib_extras: Uint8Array | null;
  exit_code: number;
  result: Uint8Array | null;
}

export const runMethodResult = {
  tag: crc32(
    'liteServer.runMethodResult mode:# id:tonNode.blockIdExt shardblk:tonNode.blockIdExt shard_proof:mode.0?bytes proof:mode.0?bytes state_proof:mode.1?bytes init_c7:mode.3?bytes lib_extras:mode.4?bytes exit_code:int result:mode.2?bytes = liteServer.RunMethodResult',
  ),

  read: (bufferReader: BufferReader): RunMethodResult => {
    const mode = bufferReader.readUint32LE();
    const id = blockIdExt.read(bufferReader);
    const shardblk = blockIdExt.read(bufferReader);
    const shard_proof = mode & 1 ? bufferReader.readBytes() : null;
    const proof = mode & 1 ? bufferReader.readBytes() : null;
    const state_proof = (mode << 1) & 1 ? bufferReader.readBytes() : null;
    const init_c7 = (mode << 3) & 1 ? bufferReader.readBytes() : null;
    const lib_extras = (mode << 4) & 1 ? bufferReader.readBytes() : null;
    const exit_code = bufferReader.readUint32LE();
    const result = (mode << 2) & 1 ? bufferReader.readBytes() : null;

    return {
      mode,
      id,
      shardblk,
      shard_proof,
      proof,
      state_proof,
      init_c7,
      lib_extras,
      exit_code,
      result,
    };
  },
};
