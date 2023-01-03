import { Coins } from 'ton3-core';

export interface StorageStats {
  readonly lastPaid: Date | null;
  readonly duePayment: Coins | null;
  readonly usage: Readonly<{
    bits: number;
    cells: number;
    publicCells: number;
  }>;
}
