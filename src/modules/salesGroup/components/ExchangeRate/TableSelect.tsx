import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef } from 'antd';
import { Button, Form, Input, InputNumber, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import SelectExchange from './SelectExchange';

type InputRef = GetRef<typeof Input>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  supplierAId: string;
  exchangeRateA: number;
  exchangeRateB: number;
  supplierBId: string;
};

interface EditableRowProps {
  index: number;
};

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  type: string;
  selectOptions?: any[],
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  type,
  handleSave,
  selectOptions,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  // useEffect(() => {
  //   if (editing) {
  //     (inputRef.current! as HTMLInputElement ).focus();
  //   }
  // }, [editing]);

  const toggleEdit = () => {
    console.log(dataIndex,'dataIndex')
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  useEffect(() => {
    console.log(form.getFieldsValue())
  },[form])
  const save = async () => {
    try {
      const values = await form.validateFields();
      console.log(values,'values')
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      type === 'number' ? (  <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} là bắt buộc!`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>) : (
           <Form.Item
           style={{ margin: 0 }}
           name={dataIndex}
           rules={[
             {
               required: true,
               message: `${title} là bắt buộc!`,
             },
           ]}
         >
            <SelectExchange
              onSelect ={(value) => {
                save();
              }}
            />
         </Form.Item>
      )
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  supplierAId: string;
  exchangeRateA: number;
  exchangeRateB: number;
  supplierBId: string;
};

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface Props{
  id?: any
};
const TableSelect = ({ id }: Props) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const [count, setCount] = useState(0);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      supplierAId: '',
      exchangeRateA: 1,
      exchangeRateB: 1,
      supplierBId: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData,'newData')
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  //Columns
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex?: string , selectOptions?: any[], type?: string, })[] = [
    {
      title: 'Nhà cung cấp đầu',
      dataIndex: 'supplierAId',
      width: '30%',
      editable: true,
      selectOptions: [],
      type: 'select',
      render: (text: string,  rc, index) =>(
        <SelectExchange/>
      )
    },
    {
      title: 'Tỉ lệ quy đổi đầu',
      dataIndex: 'exchangeRateA',
      width: '15%',
      editable: true,
      type: 'number',
      render: (text: string, rc, index) =>(
        <InputNumber
          min={1}
          defaultValue={1}
          width={'100%'}
        />
      ),
    },
    {
      title: 'Nhà cung cấp cuối',
      dataIndex: 'supplierBId',
      width: '30%',
      editable: true,
      type: 'select',
      render: (text: string,  rc, index) =>(
        <SelectExchange/>
      )
    },
    {
      title: 'Tỉ lệ quy đổi cuối',
      dataIndex: 'exchangeRateB',
      width: '15%',
      editable: true,
      type: 'number',
      render: (text: string,  rc, index) =>(
        <InputNumber
          min={1}
          defaultValue={1}
          width={'100%'}
        />
      ),
    },
    // {
    //   title: 'operation',
    //   dataIndex: 'operation',
    //   render: (_, record: { key: React.Key }) =>
    //     dataSource.length >= 1 ? (
    //       <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
    //         <a>Delete</a>
    //       </Popconfirm>
    //     ) : null,
    // },
  ];
  const columns = defaultColumns.map((col) => {
    if (!col?.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        type: col.type,
        selectOptions: col.selectOptions,
        handleSave,
      }),
    };
  });

  return (
    <div style={{width : '100%', padding : 10}}>
      <div style={{display : 'flex',justifyContent : 'flex-end'}}>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Thêm hàng
        </Button>
      </div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default TableSelect;