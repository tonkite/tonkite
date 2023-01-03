import { crc32 } from '../../utils';
import { BufferReader } from '../../buffer';

export interface TransactionId {
  account: Uint8Array | null;
  lt: bigint | null;
  hash: Uint8Array | null;
}

export const transactionId = {
  tag: crc32(
    'liteServer.transactionId mode:# account:mode.0?int256 lt:mode.1?long hash:mode.2?int256 = liteServer.TransactionId',
  ),

  read: (bufferReader: BufferReader): TransactionId => {
    const mode = bufferReader.readUint32LE();
    const account = mode & 1 ? bufferReader.readBuffer(32) : null;
    const lt = mode & (1 << 1) ? bufferReader.readUint64LE() : null;
    const hash = mode & (1 << 2) ? bufferReader.readBuffer(32) : null;

    return {
      account,
      lt,
      hash,
    };
  },

  write: () => {},
};
