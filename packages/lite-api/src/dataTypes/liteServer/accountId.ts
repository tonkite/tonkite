import { crc32 } from '../../utils';
import { BufferWriter } from '../../buffer';

export interface AccountId {
  workchain: number;
  id: Uint8Array;
}

export const accountId = {
  tag: crc32('liteServer.accountId workchain:int id:int256 = liteServer.AccountId'),
  write: (bufferWriter: BufferWriter, account: AccountId) => {
    bufferWriter.writeInt32LE(account.workchain);
    bufferWriter.writeBuffer(account.id);
  },
};
