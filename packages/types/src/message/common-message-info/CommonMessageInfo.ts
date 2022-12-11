import { CommonMessageInfoInternal } from './CommonMessageInfoInternal';
import { CommonMessageInfoExternalIn } from './CommonMessageInfoExternalIn';
import { CommonMessageInfoExternalOut } from './CommonMessageInfoExternalOut';

export type CommonMessageInfo =
  | CommonMessageInfoInternal
  | CommonMessageInfoExternalIn
  | CommonMessageInfoExternalOut;
