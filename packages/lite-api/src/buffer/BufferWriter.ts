import { TLBoolean } from './TLBoolean';

export class BufferWriter {
  #buffer = Buffer.alloc(0);

  writeInt32LE(value: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32LE(value);
    this.#buffer = Buffer.concat([this.#buffer, buffer]);
  }

  writeUInt32LE(value: number) {
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(value);
    this.#buffer = Buffer.concat([this.#buffer, buffer]);
  }

  writeInt64LE(value: bigint) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64LE(value);
    this.#buffer = Buffer.concat([this.#buffer, buffer]);
  }

  writeUint64LE(value: bigint) {
    const buffer = Buffer.alloc(8);
    buffer.writeBigUInt64LE(value);
    this.#buffer = Buffer.concat([this.#buffer, buffer]);
  }

  writeUInt8(value: number) {
    const buffer = Buffer.alloc(1);
    buffer.writeUInt8(value);
    this.#buffer = Buffer.concat([this.#buffer, buffer]);
  }

  writeBytes(data: Uint8Array) {
    const lengthSize = data.length < 254 ? 1 : 4;
    const paddingSize = 4 - ((lengthSize + data.length) % 4);

    const buffer = Buffer.alloc(lengthSize + data.length + paddingSize);

    if (data.length < 254) {
      buffer.writeUInt8(data.length);
    } else {
      buffer.writeUInt8(0xfe);
      buffer.writeUIntLE(data.length, 1, 3);
    }

    buffer.fill(data, lengthSize, lengthSize + data.length);

    this.#buffer = Buffer.concat([this.#buffer, buffer]);
  }

  writeBuffer(value: Uint8Array) {
    this.#buffer = Buffer.concat([this.#buffer, value]);
  }

  writeBool(value: boolean) {
    this.writeUInt32LE(value ? TLBoolean.TRUE : TLBoolean.FALSE);
  }

  get buffer(): Buffer {
    return this.#buffer;
  }
}
