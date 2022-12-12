import { Builder } from 'ton3-core';
import { StateInit } from './StateInit';

export const storeStateInit =
  (stateInit: StateInit) =>
  (builder: Builder): Builder => {
    // split_depth:(Maybe (## 5))
    if (stateInit.splitDepth !== null) {
      builder.storeBit(1).storeUint(stateInit.splitDepth, 5);
    } else {
      builder.storeBit(0);
    }

    // special:(Maybe TickTock)
    if (stateInit.special !== null) {
      // tick_tock$_ tick:Bool tock:Bool = TickTock;
      builder
        .storeBit(1)
        .storeBit(stateInit.special.tick ? 1 : 0)
        .storeBit(stateInit.special.tock ? 1 : 0);
    } else {
      builder.storeBit(0);
    }

    // code:(Maybe ^Cell)
    if (stateInit.code !== null) {
      builder.storeBit(1).storeRef(stateInit.code);
    } else {
      builder.storeBit(0);
    }

    // data:(Maybe ^Cell)
    if (stateInit.data !== null) {
      builder.storeBit(1).storeRef(stateInit.data);
    } else {
      builder.storeBit(0);
    }

    // TODO: Implement it later. Requires additional tools for testing.
    builder.storeBit(0); // library:(HashmapE 256 SimpleLib)

    return builder;
  };
