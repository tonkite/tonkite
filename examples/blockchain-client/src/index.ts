import { ADNLClient, ADNLClientTCP } from 'adnl';
import Debug from 'debug';
import { BufferReader, BufferWriter } from './buffer';
import * as dataTypes from './dataTypes';
import * as functions from './functions';
import { integerToIP } from './utils';
import {
  AccountState,
  AllShardsInfo,
  BlockData,
  BlockHeader,
  MasterchainInfo,
  Version,
} from './dataTypes/liteServer';
import EventEmitter from 'events';
import { BlockIdExt } from './dataTypes/tonNode';
import { LookupBlockInput } from './functions/liteServer';
import { Address, BOC, Cell, Slice, Utils } from 'ton3-core';
import { loadAccount, loadAccountState, loadShardAccount, loadShardHashes } from '@tonkite/types';
import { Builder, Coins } from 'ton3-core';
import process from 'process';
import util from 'util';
import { LiteClientError } from './LiteClientError';
import { LiteClient } from './LiteClient';

function normalize(value: unknown): any {
  if (value === null) {
    return null;
  }

  if (
    typeof value === 'bigint' ||
    typeof value === 'boolean' ||
    typeof value === 'function' ||
    typeof value === 'number' ||
    typeof value === 'string'
  ) {
    return value;
  }

  if (value instanceof Address) {
    return value.toString('raw');
  }

  if (value instanceof Cell) {
    return BOC.toBase64Standard(value);
  }

  if (value instanceof Coins) {
    return value.toNano();
  }

  if (value instanceof Slice) {
    return BOC.toBase64Standard(new Builder().storeSlice(value).cell());
  }

  if (value instanceof Uint8Array) {
    return Utils.Helpers.bytesToHex(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([propertyKey, propertyValue]) => [
        propertyKey,
        normalize(propertyValue),
      ]),
    );
  }

  throw new Error('uknown' + typeof value);
}

export function dump(value: unknown) {
  process.stdout.write(
    util.inspect(normalize(value), {
      colors: true,
      depth: 10,
    }),
  );
}

const debug = Debug('lite-client');

const LITE_SERVERS = [
  {
    ip: -1010174498,
    port: 34192,
    id: {
      '@type': 'pub.ed25519',
      key: 'qeG5qOMXVyejV0RUPvEnDSh7+3c2eJjsSpf77Th+wwk=',
    },
  },
  {
    ip: 1097621562,
    port: 46850,
    id: {
      '@type': 'pub.ed25519',
      key: 'gVU2DaB9W45Gbn3ERI7ssTGbiUR1zLJBWX8ZZ93DQQs=',
    },
  },
  {
    ip: -1903916592,
    port: 38788,
    id: {
      '@type': 'pub.ed25519',
      key: 'Hj/1PzUzYJYQcGcy7s7vC2ECGebdN/XXr4AR2Uwg9Eo=',
    },
  },
];

const LITE_SERVER = LITE_SERVERS[Math.floor(Math.random() * LITE_SERVERS.length)];

const ADNL_PUB_KEY = LITE_SERVER.id.key;

const URL = `tcp://${integerToIP(LITE_SERVER.ip)}:${LITE_SERVER.port}`;

async function main() {
  const adnlClient = new ADNLClientTCP(URL, ADNL_PUB_KEY);
  const liteClient = new LiteClient(adnlClient);

  await new Promise<void>((resolve, reject) => {
    adnlClient
      .on('connect', () => debug('@connect'))
      .on('close', () => debug('@close'))
      .on('error', reject)
      .on('ready', resolve);

    adnlClient.connect();
  });

  debug('@beforeQueries');
  const masterchainInfo = await liteClient.getMasterchainInfo();

  const blockTransactions = await liteClient.listBlockTransactions({
    workchain: 0,
    shard: 0x8000000000000000n,
    seqno: 30888580,
    root_hash: Buffer.from(
      '44310b806bf5d141b8f21da52b7fa117e281270a187283fb17ed05b603048660',
      'hex',
    ),
    file_hash: Buffer.from(
      '3d5daa9658d70a3795948f1f1d5ef7c0993f63dd2efaf864fe29e2f1d62fa785',
      'hex',
    ),
  });

  const accountTransactions = await liteClient.getTransactions(
    {
      workchain: 0,
      id: blockTransactions.ids[0].account!,
    },
    blockTransactions.ids[0].lt!,
    blockTransactions.ids[0].hash!,
  );

  dump(accountTransactions);

  debug('@afterQueries');

  // IT WORKS:
  // const as = Slice.parse(BOC.fromStandard(accountState.state));
  // dump(loadAccount(as));
  // console.log(as.bits.length);

  // const lastBlock = await liteClient.getBlock(masterchainInfo.last);
  // const allShardsInfo = await liteClient.getAllShardsInfo({
  //   workchain: -1,
  //   shard: 0x8000000000000000n,
  //   seqno: 9515750,
  //   root_hash: Utils.Helpers.hexToBytes(
  //     '3c1f32b082d240311d5b49ffff67cb1fbb89ef338b1dc6e6fae37d243b6c84b6',
  //   ),
  //   file_hash: Utils.Helpers.hexToBytes(
  //     '7e343b62d2f8301028f431a5d1c221900bd882d492887c08a52fe3334d1431fb',
  //   ),
  // });

  // console.log(Buffer.from(allShardsInfo.data).toString('hex'));

  // dump(loadShardHashes(Slice.parse(BOC.fromStandard(allShardsInfo.data))));

  // debug(
  //   'lastBlock workchain:%d shard:%s seqno:%d data:%s...',
  //   lastBlock.id.workchain,
  //   lastBlock.id.shard.toString(16),
  //   lastBlock.id.seqno,
  //   Buffer.from(lastBlock.data).subarray(0, 16).toString('hex'),
  // );

  // debug(
  //   'allShardsInfo workchain:%d shard:%s seqno:%d data:%s...',
  //   allShardsInfo.id.workchain,
  //   allShardsInfo.id.shard.toString(16),
  //   allShardsInfo.id.seqno,
  //   Buffer.from(allShardsInfo.data).subarray(0, 16).toString('hex'),
  // );

  await adnlClient.end();
}

main().catch((error: Error) => debug('@error', error));
