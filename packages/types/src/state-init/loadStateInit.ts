import { Bit, Cell, HashmapE, Slice, Utils } from 'ton3-core';
import { StateInit } from './StateInit';
import { loadTickTock } from './tick-tock';
import { loadSimpleLibrary, SimpleLibrary } from './simple-library';

export function loadStateInit(slice: Slice): StateInit {
  const splitDepth = slice.loadBit() ? slice.loadUint(5) : null;
  const special = slice.loadBit() ? loadTickTock(slice) : null;
  const code = slice.loadBit() ? slice.loadRef() : null;
  const data = slice.loadBit() ? slice.loadRef() : null;
  const libraries = slice.loadBit()
    ? HashmapE.parse<bigint, SimpleLibrary>(256, Slice.parse(slice.loadRef()), {
        deserializers: {
          key: (key: Bit[]) => Utils.Numbers.bitsToBigUint(key).value,
          value: (value: Cell) => loadSimpleLibrary(Slice.parse(value)),
        },
      })
    : null;

  return {
    splitDepth,
    special,
    code,
    data,
    libraries,
  };
}
