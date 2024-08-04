import { Input } from 'antd';
import React from 'react';
import BaseBorderBox from '~/components/common/BaseBorderBox';
type propsType = {
  setNoteForWarehouse: any;
  noteForWarehouse: string;
  placeholder?: string
};

export default function NoteWarehouse({
  noteForWarehouse,
  setNoteForWarehouse,
  placeholder = '',
}:propsType) : React.JSX.Element {
  return (
    <BaseBorderBox title={"Ghi chú"}>
      <Input.TextArea placeholder={placeholder} value={noteForWarehouse} onChange={(e: any) => setNoteForWarehouse(e.target.value)} />
      </BaseBorderBox>
  )
};