import { Cell } from 'ton3-core';
import { CommonMessageInfo } from './common-message-info';
import { StateInit } from '../state-init';

/**
 * message$_ {X:Type} info:CommonMsgInfo
 *   init:(Maybe (Either StateInit ^StateInit))
 *   body:(Either X ^X) = Message X;
 */

export interface Message {
  info: CommonMessageInfo;
  init: StateInit | null;
  body: Cell;
}
