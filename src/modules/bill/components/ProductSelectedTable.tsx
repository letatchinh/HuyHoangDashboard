import dayjs from 'dayjs';
import React from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import { EditableCell, EditableRow } from '~/components/common/EditableComponent';
import useCreateBillStore from '~/store/createBillContext';
type propsType = {

}
export default function ProductSelectedTable(props:propsType) : React.JSX.Element {
    const {clonedDataSource,onSave} = useCreateBillStore();
    console.log(clonedDataSource,'clonedDataSource');
    
    const columns  = [
        {
          title: 'STT',
          dataIndex: 'index',
          key: 'index',
          render: (text : any, record : any, index : number) => index + 1
        },
        {
          title: 'Tên thuốc',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Số lô',
          dataIndex: 'lotNumber',
          key: 'lotNumber',
          editable: true,
          component: 'Input',
          required: true,
        },
        {
          title: 'Ngày hết hạn lô',
          dataIndex: 'expirationDate',
          key: 'expirationDate',
          component: 'DatePicker',
          required: true,
          editable: true,
          render: (item : any) => item && dayjs(item).format("MM-DD-YYYY HH:mm:ss")
        },
      ];
    
      const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };
    
      const tableProps = {
        components,
        columns: columns?.map((col : any) => {
              if (!col.editable) {
                return col;
              }
              return {
                ...col,
                onCell: (record : any, rowIndex : any) => {
                  const editable = typeof col.editable === "function" ? col.editable(record) : !!col.editable
                  const max = typeof col.max === "function" ? col.max(record) : null;
                  return {
                    record,
                    rowIndex,
                    editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
    
                    component: col.component,
                    required: col.required,
                    max,
                    handleSave : onSave,
                  }
                },
              };
            }) ,
    
        // use cloned data source so that it can be submitted when complete
        dataSource: clonedDataSource
      }

    return (
        <TableAnt 
        {...tableProps}
        pagination={false}  
        />
    )
}