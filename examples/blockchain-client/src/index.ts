import Debug from 'debug';
import { ADNLClientTCP } from 'adnl';
import { BlockchainClient } from '@tonkite/core';
import { BlockchainClientLiteAPI } from '@tonkite/client-lite-api';
import { LiteClient } from '@tonkite/lite-api';
import process from 'process';
import PQueue from 'p-queue';
import { BlockTracker } from './BlockTracker';

const debug = Debug('tonkite:examples:blockchain-client');

const config = {
  liteServers: [
    {
      url: 'tcp://142.132.137.208:38788',
      publicKey: 'Hj/1PzUzYJYQcGcy7s7vC2ECGebdN/XXr4AR2Uwg9Eo=',
    },
  ],
};

async function createBlockchainClient(): Promise<BlockchainClient> {
  // Lite API
  const adnlClient = new ADNLClientTCP(config.liteServers[0].url, config.liteServers[0].publicKey);
  const liteClient = new LiteClient(adnlClient);

  await new Promise<void>((resolve, reject) => {
    adnlClient.on('error', reject).on('ready', resolve);
    adnlClient.connect();
  });

  process.on('exit', () => {
    adnlClient.end();
  });

  return new BlockchainClientLiteAPI(liteClient);
}

async function main() {
  const blockchainClient = await createBlockchainClient();

  const blockTracker = new BlockTracker(blockchainClient);
  const tickQueue = new PQueue({ concurrency: 1 });

  setInterval(() => tickQueue.add(() => blockTracker.tick()), 1_000);
}

main().catch((error: Error) => debug('@error', error));
