import { Slice } from 'ton3-core';
import { loadCommonMessageInfoInternal } from './loadCommonMessageInfoInternal';
import { loadCommonMessageInfoExternalIn } from './loadCommonMessageInfoExternalIn';
import { loadCommonMessageInfoExternalOut } from './loadCommonMessageInfoExternalOut';
import { CommonMessageInfo } from './CommonMessageInfo';

export function loadCommonMessageInfo(slice: Slice): CommonMessageInfo {
  if (!slice.loadBit()) {
    return loadCommonMessageInfoInternal(slice);
  }

  if (!slice.loadBit()) {
    return loadCommonMessageInfoExternalIn(slice);
  }

  return loadCommonMessageInfoExternalOut(slice);
}
