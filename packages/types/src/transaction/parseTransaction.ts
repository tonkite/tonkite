import { Cell, Slice } from 'ton3-core';
import { Transaction } from './Transaction';
import { loadTransaction } from './loadTransaction';

export function parseTransaction(cell: Cell): Transaction {
  return loadTransaction(Slice.parse(cell));
}
