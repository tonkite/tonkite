import EventEmitter from 'events';
import { ADNLClient } from 'adnl';
import Debug from 'debug';
import { BufferReader, BufferWriter } from './buffer';
import * as dataTypes from './dataTypes';
import { LiteClientError } from './LiteClientError';
import {
  AccountId,
  AccountState,
  AllShardsInfo,
  BlockData,
  BlockHeader,
  BlockTransactions,
  MasterchainInfo,
  RunMethodResult,
  SendMsgStatus,
  TransactionId3,
  TransactionList,
  Version,
} from './dataTypes/liteServer';
import * as functions from './functions';
import { BlockIdExt } from './dataTypes/tonNode';
import { LookupBlockInput } from './functions/liteServer';
import { Utils } from 'ton3-core';

const debug = Debug('tonkite:lite-api:client');

let counter = 0;

const nextQueryId = () => {
  const queryId = Buffer.from(
    '0000000095d6fecb497dfd0aa5f031e7d412986b5ce720496db512052e8f2d10',
    'hex',
  );
  queryId.writeUInt32LE(counter);
  counter += 1;
  return queryId;
};

const createADNLQuery = (queryId: Buffer, query: Buffer) => {
  const queryPadding = 4 - ((query.length + 1) % 4);
  const buffer = Buffer.alloc(4 + 32 + 1 + query.length + queryPadding);

  // crc32('adnl.message.query query_id:int256 query:bytes = adnl.Message')
  buffer.writeUInt32LE(0xb48bf97a);

  // query_id:int256
  queryId.copy(buffer, 4);

  // query:bytes
  buffer.writeUInt8(query.length, 4 + 32);
  query.copy(buffer, 4 + 32 + 1);

  return buffer;
};

export class LiteClient {
  #events = new EventEmitter();

  constructor(private readonly adnlClient: ADNLClient) {
    adnlClient.on('data', (data: Buffer) => {
      const dataReader = new BufferReader(data);
      const adnlAnswer = dataTypes.adnl.answerMessage.read(dataReader);

      const [tag, answer] = this.parseLiteServerAnswer(adnlAnswer.answer);

      this.#events.emit(adnlAnswer.queryId.toString('hex'), {
        tag,
        answer,
      });
    });
  }

  /**
   * Parses an answer with a parser (chosen according to a tag)
   * @param dataReader
   * @private
   */
  private parseLiteServerAnswer(dataReader: BufferReader) {
    const tag = dataReader.readInt32LE();
    const codecs = Object.values(dataTypes.liteServer) as any[];
    const codec = codecs.find((codec) => codec.tag === tag);

    if (!codec) {
      throw new Error(`Data type 0x${tag.toString(16).padStart(8, '0')} is not supported.`);
    }

    return [tag, codec.read(dataReader)];
  }

  protected query<T>(dataWriterFn: (dataWriter: BufferWriter) => void): Promise<T> {
    const dataWriter = new BufferWriter();
    dataWriterFn(dataWriter);

    const queryWriter = new BufferWriter();
    dataTypes.liteServer.query.write(queryWriter, dataWriter.buffer);

    const queryId = nextQueryId();

    this.adnlClient.write(createADNLQuery(queryId, queryWriter.buffer));

    return new Promise<T>((resolve, reject) => {
      this.#events.once(queryId.toString('hex'), ({ tag, answer }) => {
        if (tag === dataTypes.liteServer.error.tag) {
          reject(new LiteClientError(answer.message, answer.code));
          return;
        }

        resolve(answer);
      });
    });
  }

  getMasterchainInfo() {
    debug('query getMasterchainInfo()');
    return this.query<MasterchainInfo>((dataWriter) => {
      functions.liteServer.getMasterchainInfo(dataWriter);
    });
  }

  getTime() {
    debug('query getTime()');
    return this.query<string>((dataWriter) => {
      functions.liteServer.getTime(dataWriter);
    });
  }

  getVersion() {
    debug('query getVersion()');
    return this.query<Version>((dataWriter) => {
      functions.liteServer.getVersion(dataWriter);
    });
  }

  getBlock(blockId: BlockIdExt) {
    debug('query getBlock()');
    return this.query<BlockData>((dataWriter) => {
      functions.liteServer.getBlock(dataWriter, blockId);
    });
  }

  getAllShardsInfo(blockId: BlockIdExt) {
    debug('query getAllShardsInfo()');
    return this.query<AllShardsInfo>((dataWriter) => {
      functions.liteServer.getAllShardsInfo(dataWriter, blockId);
    });
  }

  getState(blockId: BlockIdExt) {
    debug('query getState()');
    return this.query<unknown>((dataWriter) => {
      functions.liteServer.getState(dataWriter, blockId);
    });
  }

  getBlockHeader(blockId: BlockIdExt, mode: number) {
    debug('query getBlockHeader()');
    return this.query<BlockHeader>((dataWriter) => {
      functions.liteServer.getBlockHeader(dataWriter, blockId, mode);
    });
  }

  lookupBlock(input: LookupBlockInput) {
    debug('query lookupBlock()');
    return this.query<BlockHeader>((dataWriter) => {
      functions.liteServer.lookupBlock(dataWriter, input);
    });
  }

  getAccountState(blockId: BlockIdExt, account: AccountId) {
    debug(
      'query getAccountState(%d, %d, %s)',
      blockId.workchain,
      blockId.seqno,
      `${account.workchain}:${Utils.Helpers.bytesToHex(account.id)}`,
    );

    return this.query<AccountState>((dataWriter) => {
      functions.liteServer.getAccountState(dataWriter, blockId, account);
    });
  }

  listBlockTransactions(
    blockId: BlockIdExt,
    count: number = 20,
    after: TransactionId3 | null = null,
    options: {
      reverseOrder?: boolean;
      wantProof?: boolean;
    } = {},
  ) {
    return this.query<BlockTransactions>((dataWriter) => {
      debug('query listBlockTransactions()');
      functions.liteServer.listBlockTransactions(
        dataWriter,
        blockId,
        count,
        after,
        !!options.reverseOrder,
        !!options.wantProof,
      );
    });
  }

  getTransactions(account: AccountId, lt: bigint, hash: Uint8Array, count: number = 20) {
    debug(
      'query getTransactions(%s, %s, %s)',
      `${account.workchain}:${Utils.Helpers.bytesToHex(account.id)}`,
      lt.toString(10),
      Utils.Helpers.bytesToHex(hash),
    );

    return this.query<TransactionList>((dataWriter) => {
      functions.liteServer.getTransactions(dataWriter, count, account, lt, hash);
    });
  }

  runSmcMethod(id: BlockIdExt, account: AccountId, methodId: bigint, params: Uint8Array) {
    debug('query runSmcMethod()');
    return this.query<RunMethodResult>((dataWriter) => {
      functions.liteServer.runSmcMethod(dataWriter, id, account, methodId, params);
    });
  }

  sendMessage(body: Uint8Array) {
    debug('query sendMessage()');
    return this.query<SendMsgStatus>((dataWriter) => {
      functions.liteServer.sendMessage(dataWriter, body);
    });
  }
}
