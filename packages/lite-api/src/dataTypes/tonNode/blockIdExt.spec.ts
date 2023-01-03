import { BufferReader, BufferWriter } from '../../buffer';
import { blockIdExt } from './blockIdExt';

const encodedBlockId = Buffer.from(
  'ffffffff000000000000008062518e01c51975c06c4f4d87183df1c3b8648d5abd843d0c70286835e1d0eae51541ea84a2a284f4186419da63b8deb314c1c2b2a22be3cf0e2cc6befe9663ac36c53c6f',
  'hex',
);

describe('liteServer.BlockIdExt', () => {
  test('should read BlockIdExt', () => {
    const data = blockIdExt.read(new BufferReader(encodedBlockId));

    expect(data.workchain).toBe(-1);
    expect(data.shard.toString(16)).toBe('8000000000000000');
    expect(data.seqno).toBe(26104162);

    expect(Buffer.from(data.root_hash).toString('hex')).toBe(
      'c51975c06c4f4d87183df1c3b8648d5abd843d0c70286835e1d0eae51541ea84',
    );

    expect(Buffer.from(data.file_hash).toString('hex')).toBe(
      'a2a284f4186419da63b8deb314c1c2b2a22be3cf0e2cc6befe9663ac36c53c6f',
    );
  });

  test('should write BlockIdExt', () => {
    const writer = new BufferWriter();

    // ffffffff
    // 0000008000000000
    // 62518e01
    // c51975c06c4f4d87183df1c3b8648d5abd843d0c70286835e1d0eae51541ea84
    // a2a284f4186419da63b8deb314c1c2b2a22be3cf0e2cc6befe9663ac36c53c6f

    blockIdExt.write(writer, {
      workchain: -1,
      shard: 0x8000000000000000n,
      seqno: 26104162,
      root_hash: Buffer.from(
        'c51975c06c4f4d87183df1c3b8648d5abd843d0c70286835e1d0eae51541ea84',
        'hex',
      ),
      file_hash: Buffer.from(
        'a2a284f4186419da63b8deb314c1c2b2a22be3cf0e2cc6befe9663ac36c53c6f',
        'hex',
      ),
    });

    expect(writer.buffer.toString('hex')).toBe(encodedBlockId.toString('hex'));
  });
});
