import { Builder, Cell, CellType, Slice } from 'ton3-core';

const INT64_MIN = -0x8000000000000000n;
const INT64_MAX = 0x7fffffffffffffffn;

export type StackValue = null | bigint | number | Cell | Slice | Builder | StackValue[];

export class Stack {
  static serialize(values: StackValue[]): Cell {
    // vm_stack#_ depth:(## 24) stack:(VmStackList depth) = VmStack;
    const builder = new Builder();
    builder.storeUint(values.length, 24);
    Stack.serializeStackList(builder, values);
    return builder.cell();
  }

  private static serializeStackList(builder: Builder, list: StackValue[]) {
    if (!list.length) return;

    // rest:^(VmStackList n)
    const rest = new Builder();
    Stack.serializeStackList(rest, list.slice(0, list.length - 1));
    builder.storeRef(rest.cell());

    // tos
    Stack.serializeStackValue(builder, list[list.length - 1]);
  }

  private static serializeStackValue(builder: Builder, value: StackValue) {
    if (value === null) {
      // vm_stk_null#00 = VmStackValue;
      return builder.storeUint(0x00, 8);
    }

    if (typeof value === 'number') {
      if (isNaN(value)) {
        // vm_stk_nan#02ff = VmStackValue;
        return builder.storeInt(0x02ff, 16);
      } else {
        // vm_stk_tinyint#01 value:int64 = VmStackValue;
        return builder.storeUint(0x01, 8).storeInt(value, 64);
      }
    }

    if (typeof value === 'bigint') {
      if (value >= INT64_MIN && value <= INT64_MAX) {
        // vm_stk_tinyint#01 value:int64 = VmStackValue;
        return builder.storeUint(0x01, 8).storeInt(value, 64);
      } else {
        // vm_stk_int#0201_ value:int257 = VmStackValue;
        return builder.storeUint(0x0100, 15).storeInt(value, 257);
      }
    }

    // vm_stk_cell#03 cell:^Cell = VmStackValue;
    if (value instanceof Cell) {
      return builder.storeUint(0x03, 8).storeRef(value);
    }

    // _ cell:^Cell st_bits:(## 10) end_bits:(## 10) { st_bits <= end_bits }
    //   st_ref:(#<= 4) end_ref:(#<= 4) { st_ref <= end_ref } = VmCellSlice;
    // vm_stk_slice#04 _:VmCellSlice = VmStackValue;
    if (value instanceof Slice) {
      return builder
        .storeUint(0x04, 8)
        .storeUint(0, 10)
        .storeUint(value.bits.length, 10)
        .storeUint(0, 3)
        .storeUint(value.refs.length, 3)
        .storeRef(new Builder().storeSlice(value).cell());
    }

    // vm_stk_builder#05 cell:^Cell = VmStackValue;
    if (value instanceof Builder) {
      return builder.storeUint(0x05, 8).storeRef(value.cell());
    }

    // vm_tupref_nil$_ = VmTupleRef 0;
    // vm_tupref_single$_ entry:^VmStackValue = VmTupleRef 1;
    // vm_tupref_any$_ {n:#} ref:^(VmTuple (n + 2)) = VmTupleRef (n + 2);
    // vm_tuple_nil$_ = VmTuple 0;
    // vm_tuple_tcons$_ {n:#} head:(VmTupleRef n) tail:^VmStackValue = VmTuple (n + 1);
    // vm_stk_tuple#07 len:(## 16) data:(VmTuple len) = VmStackValue;
    if (Array.isArray(value)) {
      let head: Cell | null = null;
      let tail: Cell | null = null;

      for (let i = 0; i < value.length; i++) {
        [head, tail] = [tail, head];

        if (i > 1) {
          head = new Builder().storeRef(tail!).storeRef(head!).cell();
        }

        const tailBuilder = new Builder();
        Stack.serializeStackValue(tailBuilder, value[i]);
        tail = tailBuilder.cell();
      }

      builder.storeUint(0x07, 8).storeUint(value.length, 16);

      if (head) {
        builder.storeRef(head);
      }

      if (tail) {
        builder.storeRef(tail);
      }

      return builder;
    }

    throw new Error('Stack value type is not supported.');
  }

  static deserialize<S extends StackValue[] = StackValue[]>(cell: Cell): S {
    // vm_stack#_ depth:(## 24) stack:(VmStackList depth) = VmStack;
    const slice = Slice.parse(cell);
    const depth = slice.loadUint(24);

    return Stack.deserializeStackList(depth, slice) as S;
  }

  private static deserializeStackList(depth: number, slice: Slice): StackValue[] {
    /**
     * vm_stk_cons#_ {n:#} rest:^(VmStackList n) tos:VmStackValue = VmStackList (n + 1);
     * vm_stk_nil#_ = VmStackList 0;
     */

    const stack: StackValue[] = [];

    for (let i = 0; i < depth; i++) {
      const rest = slice.loadRef();
      const value = Stack.deserializeStackValue(slice);

      stack.unshift(value);
      slice = Slice.parse(rest);
    }

    return stack;
  }

  private static deserializeStackValue(slice: Slice): StackValue {
    const type = slice.loadUint(8);

    switch (type) {
      // vm_stk_null#00 = VmStackValue;
      case 0x00:
        return null;

      // vm_stk_tinyint#01 value:int64 = VmStackValue;
      case 0x01:
        return slice.loadBigInt(64);

      // vm_stk_int#0201_ value:int257 = VmStackValue;
      // vm_stk_nan#02ff = VmStackValue;
      case 0x02:
        if (slice.loadUint(7)) {
          slice.loadBit(); // 0xff - 8 bits
          return NaN;
        }

        return slice.loadBigInt(64);

      // vm_stk_cell#03 cell:^Cell = VmStackValue;
      case 0x03:
        return slice.loadRef();

      // _ cell:^Cell st_bits:(## 10) end_bits:(## 10) { st_bits <= end_bits }
      //   st_ref:(#<= 4) end_ref:(#<= 4) { st_ref <= end_ref } = VmCellSlice;
      // vm_stk_slice#04 _:VmCellSlice = VmStackValue;
      case 0x04:
        return Stack.deserializeStackValueSlice(slice);

      // vm_stk_builder#05 cell:^Cell = VmStackValue;
      case 0x05:
        const cell = slice.loadRef();
        return new Builder().storeSlice(Slice.parse(cell));

      // vm_stk_cont#06 cont:VmCont = VmStackValue;
      case 0x06:
        throw new Error('Continuations are not supported yet.');

      // vm_stk_tuple#07 len:(## 16) data:(VmTuple len) = VmStackValue;
      case 0x07:
        return Stack.deserializeStackValueTuple(slice);

      default:
        throw new Error('Stack value type is not supported.');
    }
  }

  private static deserializeStackValueSlice(slice: Slice) {
    const startBits = slice.loadUint(10);
    const endBits = slice.loadUint(10);
    const startRefs = slice.loadUint(3);
    const endRefs = slice.loadUint(3);
    const cell = slice.loadRef();

    return Slice.parse(
      new Cell({
        bits: cell.bits.slice(startBits, endBits),
        refs: slice.refs.slice(startRefs, endRefs),
        type: CellType.Ordinary,
      }),
    );
  }

  private static deserializeStackValueTuple(slice: Slice): StackValue {
    // vm_tupref_nil$_ = VmTupleRef 0;
    // vm_tupref_single$_ entry:^VmStackValue = VmTupleRef 1;
    // vm_tupref_any$_ {n:#} ref:^(VmTuple (n + 2)) = VmTupleRef (n + 2);
    // vm_tuple_nil$_ = VmTuple 0;
    // vm_tuple_tcons$_ {n:#} head:(VmTupleRef n) tail:^VmStackValue = VmTuple (n + 1);
    // vm_stk_tuple#07 len:(## 16) data:(VmTuple len) = VmStackValue;

    const length = slice.loadUint(16);
    const items: StackValue[] = [];

    if (length === 0) {
      return [];
    }

    if (length === 1) {
      const tail = slice.loadRef();
      return [Stack.deserializeStackValue(Slice.parse(tail))];
    }

    let head = Slice.parse(slice.loadRef());
    let tail = Slice.parse(slice.loadRef());

    items.unshift(Stack.deserializeStackValue(tail));

    for (let i = 0; i < length - 2; i++) {
      const current = head;
      head = Slice.parse(current.loadRef());
      tail = Slice.parse(current.loadRef());

      items.unshift(Stack.deserializeStackValue(tail));
    }

    items.unshift(Stack.deserializeStackValue(head));

    return items;
  }
}
