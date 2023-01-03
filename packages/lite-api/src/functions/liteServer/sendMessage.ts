import { BufferWriter } from '../../buffer';
import { crc32 } from '../../utils';

const tag = crc32('liteServer.sendMessage body:bytes = liteServer.SendMsgStatus');

export const sendMessage = (bufferWriter: BufferWriter, body: Uint8Array) => {
  bufferWriter.writeInt32LE(tag);
  bufferWriter.writeBytes(body);
};
