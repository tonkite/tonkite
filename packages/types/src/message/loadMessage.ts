import { Builder, Slice } from 'ton3-core';
import { loadCommonMessageInfo } from './common-message-info';
import { loadStateInit } from '../state-init';
import { Message } from './Message';

export function loadMessage(slice: Slice): Message {
  const info = loadCommonMessageInfo(slice);
  const init = slice.loadBit()
    ? loadStateInit(slice.loadBit() ? Slice.parse(slice.loadRef()) : slice)
    : null;

  const body = slice.loadBit() ? slice.loadRef() : new Builder().storeSlice(slice).cell();

  return {
    info,
    init,
    body,
  };
}
