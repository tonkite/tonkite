import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { AccountId, accountId } from '../../dataTypes/liteServer';

const tag = crc32(
  'liteServer.getTransactions count:# account:liteServer.accountId lt:long hash:int256 = liteServer.TransactionList',
);

export const getTransactions = (
  bufferWriter: BufferWriter,
  count: number,
  account: AccountId,
  lt: bigint,
  hash: Uint8Array,
) => {
  bufferWriter.writeInt32LE(tag);
  bufferWriter.writeUInt32LE(count);
  accountId.write(bufferWriter, account);
  bufferWriter.writeUint64LE(lt);
  bufferWriter.writeBuffer(hash);
};
