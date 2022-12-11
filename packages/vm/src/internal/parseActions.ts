import { Cell, Slice } from 'ton3-core';
import { CurrencyCollection, loadCurrencyCollection, loadMessage, Message } from '@tonkite/types';

enum OutActionType {
  SEND_MESSAGE = 0x0ec3c86d,
  SET_CODE = 0xad4de08e,
  RESERVE_CURRENCY = 0x36e6b809,
  CHANGE_LIBRARY = 0x26fa1dd4,
}

export interface SendMessageAction {
  type: 'send_message';
  mode: number;
  outMessage: Message;
}

export interface SetCodeAction {
  type: 'set_code';
  newCode: Cell;
}

export interface ReserveCurrencyAction {
  type: 'reserve_currency';
  mode: number;
  currency: CurrencyCollection;
}

export interface ChangeLibraryAction {
  type: 'change_library';
  mode: number;
  library: Cell | Uint8Array;
}

export type OutAction =
  | SendMessageAction
  | SetCodeAction
  | ReserveCurrencyAction
  | ChangeLibraryAction;

export function loadOutAction(slice: Slice): OutAction {
  const type = slice.loadUint(32);

  switch (type) {
    /**
     * action_send_msg#0ec3c86d mode:(## 8)
     *   out_msg:^(MessageRelaxed Any) = OutAction;
     */
    case OutActionType.SEND_MESSAGE:
      return {
        type: 'send_message',
        mode: slice.loadUint(8),
        outMessage: loadMessage(Slice.parse(slice.loadRef())),
      };

    /**
     * action_set_code#ad4de08e new_code:^Cell = OutAction;
     */
    case OutActionType.SET_CODE:
      return {
        type: 'set_code',
        newCode: slice.loadRef(),
      };

    /**
     * action_reserve_currency#36e6b809 mode:(## 8)
     *   currency:CurrencyCollection = OutAction;
     */
    case OutActionType.RESERVE_CURRENCY:
      return {
        type: 'reserve_currency',
        mode: slice.loadUint(8),
        currency: loadCurrencyCollection(slice),
      };

    /**
     * libref_hash$0 lib_hash:bits256 = LibRef;
     * libref_ref$1 library:^Cell = LibRef;
     * action_change_library#26fa1dd4 mode:(## 7) { mode <= 2 } libref:LibRef = OutAction;
     */
    case OutActionType.CHANGE_LIBRARY:
      return {
        type: 'change_library',
        mode: slice.loadUint(7),
        library: slice.loadBit() ? slice.loadRef() : slice.loadBytes(256),
      };

    default:
      throw new Error(
        `OutAction type is not supported (type = 0x${type.toString(16).padStart(8, '0')})`,
      );
  }
}

/**
 * out_list_empty$_ = OutList 0;
 * out_list$_ {n:#} prev:^(OutList n) action:OutAction = OutList (n + 1);
 */
export function parseOutList(outList: Cell): OutAction[] {
  const list = Slice.parse(outList);

  // out_list_empty$_ = OutList 0;
  if (!list.refs.length) {
    return [];
  }

  return [...parseOutList(list.loadRef()), loadOutAction(list)];
}
