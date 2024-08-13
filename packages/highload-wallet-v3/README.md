<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tonkite/tonkite/main/assets/logo-dark.svg">
    <img alt="tonkite logo" src="https://raw.githubusercontent.com/tonkite/tonkite/main/assets/logo-light.svg" width="auto" height="128">
  </picture>
</p>

<p align="center">
  Tonkite is a toolkit for TON development.
<p>

---

## Description

Wrapper for `highload-wallet-v3`.

## Installation

```shell
pnpm add @tonkite/highload-wallet-v3
```

## Quick Start

Initialize `TonClient`, `HighloadWalletV3`, `HighloadWalletV3QueryIdSequnce`:

```typescript
import { TonClient } from '@ton/ton';
import { HighloadWalletV3 } from '@tonkite/highload-wallet-v3';
import { HighloadWalletV3Reader } from './highload-wallet-v3-reader';

/* ... */

const tonClient = new TonClient({
  endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  apiKey: 'YOUR API KEY',
});

const queryIdSequence = HighloadWalletV3.newSequence(); // or `HighloadWalletV3.restoreSequence(xxx)`
const wallet = tonClient.open(
  new HighloadWalletV3(queryIdSequence, keyPair.publicKey),
);
```

Send a batch of messages:

```typescript
await wallet.sendBatch(keyPair.secretKey, {
  messages: [
    {
      mode: SendMode.PAY_GAS_SEPARATELY,
      message: internal({
        to: Address.parse('UQDz0wQL6EEdgbPkFgS7nNmywzr468AvgLyhH7PIMALxPEND'),
        value: toNano('0.005'),
        body: beginCell().storeUint(0, 32).storeStringTail('Hello.').endCell(),
      }),
    },
    {
      mode: SendMode.PAY_GAS_SEPARATELY,
      message: internal({
        to: Address.parse('UQDz0wQL6EEdgbPkFgS7nNmywzr468AvgLyhH7PIMALxPEND'),
        value: toNano('0.005'),
        body: beginCell().storeUint(0, 32).storeStringTail('Hello.').endCell(),
      }),
    },
    /* ... */
  ],
  // NOTE: This it subtotal for all messages + fees.
  //       This value can be omitted, but it's recommended to specify it.
  //       Otherwise, batches will be sent in different blocks (e.a. time-consuming).
  valuePerBatch: toNano('0.015'),
  // NOTE: Time-shift because time may be out of sync.
  //       The contract accepts older messages, but not those ahead of time.
  createdAt: Math.floor(Date.now() / 1000) - 60,
});
```

Store a sequence state during a `timeout` time-window:

```typescript
// Store it somewhere:
const lastValue = queryIdSequence.current();

/* ... */

// Restore it next time:
const queryIdSequence = HighloadWalletV3.restoreSequence(lastValue);
```

## License

<a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache_2.0-green.svg" alt="License"></a>
