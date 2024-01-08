import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef } from 'antd';
import { Button, Checkbox, ColorPicker, Form, Input, Popconfirm, Table, Tag, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { Color } from 'antd/es/color-picker';
import { useUpdateStatusConfig } from '../statusConfig.hook';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Breadcrumb from '~/components/common/Breadcrumb';
import useTranslate from '~/lib/translation';
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
  priority: boolean;
}

interface EditableRowProps {
  index: number;
}

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
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
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
  name: string;
  color: string;
  backgroundColor: string;
  priority: boolean;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const StatusConfig: React.FC = () => {
  const { t }: any = useTranslate();
     const [colorHex, setColorHex] = useState<Color | string>("#1677ff");
  const [dataSource, setDataSource] = useState<DataType[]>([
    {
      key: '0',
      name: 'Edward King 0',
      backgroundColor: '#1677ff',
      color: '#fff',
      priority: false,
    },
    {
      key: '1',
      name: 'Edward King 1',
      color: '#1677ff',
      backgroundColor: 'red',
      priority: true,
    },
  ]);

  const handleColorChange = (color: Color, dataIndex: keyof DataType, key: React.Key) => {
    const hexColor = color.toHexString();
    // Update the state based on the key and dataIndex
    setDataSource((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, [dataIndex]: hexColor } : item
      )
    );
  };
  const [count, setCount] = useState(2);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: "Trạng thái",
      dataIndex: "name",
      width: "100px",
      key:'valueStatus',
      align: "center",
      // editable: true,
      render: (value, record) => (
        <Tag color={record.backgroundColor} style={{ color: record.color }}>
          {value}
        </Tag>
      )
    },
    {
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    },
    {
    title:'Màu chữ',
    dataIndex:'color',
    // editable: true,
    render: (_, record:any) => {
      return (
        <ColorPicker
  showText
  value={record?.color}
  onChange={(color) => handleColorChange(color, 'color', record.key)}
/>
      );
    }
    },
    {
        title:'Màu nền',
        dataIndex:'backgroundColor',
        // editable: true,
        render: (_, record:any) => {
          return (
            <ColorPicker
            showText
            value={record?.backgroundColor}
            onChange={(color) => handleColorChange(color, 'backgroundColor', record.key)}
          />
          );
        }
    },
    {
      title: <Tooltip title='Giá trị trạng thái này sẽ được ưu tiên chọn khi công việc được tạo mới'><span style={{cursor:'pointer'}}>Ưu tiên <ExclamationCircleOutlined/></span></Tooltip>,
      dataIndex: "priority",
      width: "100px",
      key:'priority',
      align: "center",
      render:(value,record)=>(
          <Checkbox
            checked={value}
            onChange={(e) => {
              if (value) return;
              // updateStatusConfig({
              //   priority: e.target.checked,
              //   isDefault:true,
              //   statusHidden:false,
              //   id: record._id
              // });
            }}
          />
        )      
    },
    {
      title:'Mặc định',
      dataIndex:'isDefault',
      key:'isDefault',
      align: "center",
      width:80,
      render: (value, record) => {
        const disable = Boolean(record.priority) &&Boolean(record.isDefault)
        const title = disable? 'Không thể thực hiện thao tác vì trạng thái hiện tại đang được ưu tiên' :'';
        return (
          <Tooltip title={title} >
            <Checkbox
            disabled={disable}
              checked={value}
              onChange={(e) => {
                // updateStatusConfig({
                //   isDefault: e.target.checked,
                //   id: record._id
                // });
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      title:'Quyền quản trị',
      dataIndex:'justAdmin',
      key:'justAdmin',
      align: "center",
      width:80,
      render: (value, record) => (
        <Checkbox checked={value} onChange={(e)=>{
          // if(!canUpdate) return 
          // updateStatusConfig({justAdmin:e.target.checked,id:record._id})
        }}/>
      )
    },
    {
      title:'Ẩn',
      dataIndex:'statusHidden',
      key:'statusHidden',
      align: "center",
      width:60,
      render: (value, record) => (
        <Tooltip  title={!record?.justAdmin? 'Quyền quản trị phải được bật': (record.priority === true )? 'Không thể thực hiện thao tác vì trạng thái này là "Ưu tiên"':''}>
          <Checkbox disabled={!record?.justAdmin||record.priority} checked={value} defaultChecked={value} onChange={(e)=>{
            // if(!canUpdate) return 
            // updateStatusConfig({statusHidden:e.target.checked,id:record._id})
          }}/>
        </Tooltip>
      )
    },
    // canDelete?
    {
      title: "Hành động",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      width:80,
      render: (_, record) =>
      // listStatusConfig?.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="dashed" style={{color:'red'}} size="small">Xoá</Button>
          </Popconfirm>
        // ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      name: `Edward King ${count}`,
    color:'#fff',
    backgroundColor: '#f1677f',
    priority: false,
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
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Breadcrumb title={t('statusConfig')} />
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Thêm cấu hình trạng thái
      </Button>
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

export default StatusConfig;