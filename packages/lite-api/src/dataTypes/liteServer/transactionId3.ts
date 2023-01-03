import { BufferReader, BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';

export interface TransactionId3 {
  account: Uint8Array;
  lt: bigint;
}

export const transactionId3 = {
  tag: crc32('liteServer.transactionId3 account:int256 lt:long = liteServer.TransactionId3'),
  read: (bufferReader: BufferReader): TransactionId3 => {
    const account = bufferReader.readBuffer(32);
    const lt = bufferReader.readUint64LE();

    return {
      account,
      lt,
    };
  },

  write: (bufferWriter: BufferWriter, transaction: TransactionId3) => {
    bufferWriter.writeBuffer(transaction.account);
    bufferWriter.writeUint64LE(transaction.lt);
  },
};
