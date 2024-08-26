<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tonkite/tonkite/main/assets/logo-dark.svg">
    <img alt="tonkite logo" src="https://raw.githubusercontent.com/tonkite/tonkite/main/assets/logo-light.svg" width="256" height="auto">
  </picture>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@tonkite/highload-wallet-v3"><img alt="NPM Version" src="https://img.shields.io/npm/v/%40tonkite%2Fhighload-wallet-v3"></a>
  <a href="https://www.npmjs.com/package/wagmi"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/%40tonkite%2Fhighload-wallet-v3"></a>
  <a href="https://github.com/tonkite/tonkite"><img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/tonkite/tonkite"></a>
  <a href="https://opensource.org/licenses/Apache-2.0"><img alt="License" src="https://img.shields.io/badge/License-Apache_2.0-green.svg"></a>
</p>

---

## Description

Wrapper for interacting with the `highload-wallet-v3` contract.

## Installation

Using npm:

```shell
npm install --save @tonkite/highload-wallet-v3
```

Using Yarn:
```shell
yarn add @tonkite/highload-wallet-v3
```

Using pnpm:

```shell
pnpm add @tonkite/highload-wallet-v3
```

## Quick Start

Initialize `TonClient`, `HighloadWalletV3`, `HighloadWalletV3QueryIdSequnce`:

```typescript
import { TonClient } from '@ton/ton';
import { HighloadWalletV3 } from '@tonkite/highload-wallet-v3';

/* ... */

// NOTE: You may also use `TonClient4` from `@ton/ton` package.
const tonClient = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: 'YOUR API KEY',
});

const queryIdSequence = HighloadWalletV3.newSequence(); // or `HighloadWalletV3.restoreSequence(xxx)`
const wallet = tonClient.open(new HighloadWalletV3(queryIdSequence, keyPair.publicKey));
```

Send a batch of messages:

```typescript
import { Address, SendMode, internal, toNano, comment } from '@ton/core';

/* ... */

await wallet.sendBatch(keyPair.secretKey, {
  messages: [
    {
      mode: SendMode.PAY_GAS_SEPARATELY,
      message: internal({
        to: Address.parse('UQDz0wQL6EEdgbPkFgS7nNmywzr468AvgLyhH7PIMALxPEND'),
        value: toNano('0.005'),
        body: comment('Hello Tonkite!'),
      }),
    },
    /* ... */
  ],

  /*
   * NOTE: This it subtotal for all messages + fees.
   *       This value can be omitted, but it's recommended to specify it.
   *       Otherwise, batches will be sent in different blocks (e.a. time-consuming).
   */
  valuePerBatch: toNano('0.015'),

  /*
   * NOTE: Time-shift because time may be out of sync.
   *       The contract accepts older messages, but not those ahead of time.
   */
  createdAt: Math.floor(Date.now() / 1000) - 60,
});
```

Store a final sequence state during a `timeout` time-window:

```typescript
// Store it somewhere after all the operations:
const lastValue = queryIdSequence.current();

/* ... */

// Restore it next time:
const queryIdSequence = HighloadWalletV3.restoreSequence(lastValue);
```

## Emergency Mode

For emergency cases, the wrapper supports emergency mode.
A special request identifier is reserved for this, which is not generated in normal mode.

To use emergency mode:

```typescript
const queryIdSequence = HighloadWalletV3.emergencySequence();
```

## License

Tonkite is [Apache 2.0](https://opensource.org/licenses/Apache-2.0) licensed.
