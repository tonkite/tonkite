import { Bit, Builder, Cell, HashmapE, Slice, Utils } from 'ton3-core';
import type { Transaction } from './Transaction';
import { loadAccountStatus } from '../account-status';
import { loadCurrencyCollection } from '../currency-collection';
import { loadHashUpdate } from '../hash-update';
import { loadTransactionDescription } from '../transaction-description';
import { loadMessage, Message } from '../message';

export function loadTransaction(slice: Slice): Transaction {
  const hash = Utils.Helpers.hexToBytes(new Builder().storeSlice(slice).cell().hash());

  if (slice.loadUint(4) !== 0b0111) {
    throw new Error('Not a Transaction');
  }

  const accountAddress = slice.loadBytes(256); // account_addr:bits256
  const lt = slice.loadBigUint(64); // lt:uint64
  const previousTransactionHash = slice.loadBytes(256); // prev_trans_hash:bits256
  const previousTransactionLt = slice.loadBigUint(64); // prev_trans_lt:uint64
  const now = slice.loadUint(32); // now:uint32
  const outMessagesCount = slice.loadUint(15); // outmsg_cnt:uint15

  const originalStatus = loadAccountStatus(slice); // orig_status:AccountStatus
  const endStatus = loadAccountStatus(slice); // end_status:AccountStatus

  const messages = Slice.parse(slice.loadRef()); // ^[ in_msg:(Maybe ^(Message Any)) out_msgs:(HashmapE 15 ^(Message Any)) ]

  const inMessage = messages.loadBit() ? loadMessage(Slice.parse(messages.loadRef())) : null;

  const outMessages = Array.from(
    HashmapE.parse<bigint, Message>(15, messages, {
      deserializers: {
        key: (key: Bit[]) => Utils.Numbers.bitsToBigUint(key).value,
        value: (value: Cell) => loadMessage(Slice.parse(Slice.parse(value).loadRef())),
      },
    }),
  ).map(([_, message]) => message);

  const totalFees = loadCurrencyCollection(slice); // total_fees:CurrencyCollection

  const stateUpdate = loadHashUpdate(Slice.parse(slice.loadRef())); // state_update:^(HASH_UPDATE Account)

  const description = loadTransactionDescription(Slice.parse(slice.loadRef())); // description:^TransactionDescr = Transaction;

  return {
    accountAddress,
    id: {
      lt,
      hash,
    },
    previousTransaction: {
      lt: previousTransactionLt,
      hash: previousTransactionHash,
    },
    now,
    outMessagesCount,
    originalStatus,
    endStatus,
    inMessage,
    outMessages,
    totalFees,
    stateUpdate,
    description,
  };
}
