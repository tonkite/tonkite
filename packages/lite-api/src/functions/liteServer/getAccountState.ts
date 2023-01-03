import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { BlockIdExt, blockIdExt } from '../../dataTypes/tonNode';
import { AccountId, accountId } from '../../dataTypes/liteServer';

export const getAccountState = (bufferWriter: BufferWriter, id: BlockIdExt, account: AccountId) => {
  bufferWriter.writeInt32LE(
    crc32(
      'liteServer.getAccountState id:tonNode.blockIdExt account:liteServer.accountId = liteServer.AccountState',
    ),
  );

  blockIdExt.write(bufferWriter, id);
  accountId.write(bufferWriter, account);
};
