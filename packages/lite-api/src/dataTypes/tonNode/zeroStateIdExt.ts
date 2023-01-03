import { BufferReader } from '../../buffer';

export interface ZeroStateIdExt {
  workchain: number;
  root_hash: Uint8Array;
  file_hash: Uint8Array;
}

export const zeroStateIdExt = {
  // tonNode.zeroStateIdExt workchain:int root_hash:int256 file_hash:int256 = tonNode.ZeroStateIdExt;
  read: (dataReader: BufferReader): ZeroStateIdExt => {
    const workchain = dataReader.readInt32LE();
    const root_hash = dataReader.readBuffer(32);
    const file_hash = dataReader.readBuffer(32);

    return {
      workchain,
      root_hash,
      file_hash,
    };
  },
};
