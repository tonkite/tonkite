import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';
import { AccountId, accountId } from '../../dataTypes/liteServer';
import { blockIdExt, BlockIdExt } from '../../dataTypes/tonNode';

const tag = crc32(
  'liteServer.runSmcMethod mode:# id:tonNode.blockIdExt account:liteServer.accountId method_id:long params:bytes = liteServer.RunMethodResult',
);

export const runSmcMethod = (
  bufferWriter: BufferWriter,
  id: BlockIdExt,
  account: AccountId,
  methodId: bigint,
  params: Uint8Array,
) => {
  bufferWriter.writeUInt32LE(tag);

  const mode =
    1 | // include proof & shard_proof
    (1 << 1) | // include state_proof
    (1 << 2) | // include result
    (1 << 3) | // include init_c7
    (1 << 4); // include lib_extras

  bufferWriter.writeUInt32LE(mode);
  blockIdExt.write(bufferWriter, id);
  accountId.write(bufferWriter, account);
  bufferWriter.writeInt64LE(methodId);
  bufferWriter.writeBytes(params);
};
