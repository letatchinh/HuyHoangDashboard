import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { InputRef } from 'antd';
import { Button, Checkbox, ColorPicker, Form, Input, Table, Tag, Tooltip, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Breadcrumb from '~/components/common/Breadcrumb';
import WithPermission from "~/components/common/WithPermission";
import useTranslate from '~/lib/translation';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import { useCreateStatusConfig, useDeleteStatusConfig, useGetListStatusConfig, useResetAction, useStatusConfigQueryParams, useUpdateStatusConfig } from '../statusConfig.hook';
const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
  _id: string;
  priority: boolean;
  color: string;
  backgroundColor: string;
  onPressEnter: () => void;
  isDefault: boolean;
  onBlur: () => void;
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
  dataIndex: string;
  record: any;
  max?: number;
  handleSave: (record: Item) => void;
};

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  max,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  const [, updateStatusConfig] = useUpdateStatusConfig();
  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async (field: any) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      updateStatusConfig({ ...values, id: record._id });
      setEditing(false)

    } catch (errInfo) {
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
  key?: React.Key;
  _id?: string;
  value?: string;
  color?: string;
  justAdmin?: boolean;
  backgroundColor?: string;
  priority?: boolean;
  isDefault?: boolean;
};
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
const StatusConfig: React.FC = () => {
  const { t }: any = useTranslate();
  const [, createStatusConfig] = useCreateStatusConfig();
  const [, deleteStatusConfig] = useDeleteStatusConfig();
  const [, updateStatusConfig] = useUpdateStatusConfig();
  const [query] = useStatusConfigQueryParams();
  const [listStatusConfig, isLoading] = useGetListStatusConfig(query);
  const canDelelte = useMatchPolicy(POLICIES.DELETE_TODOSTATUSCONFIG);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_TODOSTATUSCONFIG);
  useResetAction()
  const handleDelete = (_id: keyof DataType) => {
    deleteStatusConfig(_id);
  };
  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: "Trạng thái",
      dataIndex: "value",
      width: "100px",
      key: 'valueStatus',
      align: "center",
      // editable: true,
      render: (value, record) => (
        <Tag color={record.backgroundColor} style={{ color: record.color }}>
          {value}
        </Tag>
      )
    },
    {  
      title: 'Tên trạng thái',
      dataIndex: 'value',
      width: '30%',
      editable: canUpdate,
    },
    {
      title: 'Màu chữ',
      dataIndex: 'color',
      render: (_, record: any) => {
        return (
          <ColorPicker
            showText
            value={record?.color}
            onChange={(color) => {
              if (!canUpdate) return message.error("Bạn không có quyền thay đổi")
              updateStatusConfig({ ["color"]: color.toHexString(), id: record._id });
            }}
          />
        );
      }
    },
    {
      title: 'Màu nền',
      dataIndex: 'backgroundColor',
      render: (_, record: any) => {
        return (
          <ColorPicker
            showText
            value={record?.backgroundColor}
            onChange={(color) => {
              if (!canUpdate)  return message.error("Bạn không có quyền thay đổi")
              updateStatusConfig({ ["backgroundColor"]: color.toHexString(), id: record._id });
            }}
          />
        );
      }
    },
    {
      title: <Tooltip title='Giá trị trạng thái này sẽ được ưu tiên chọn khi công việc được tạo mới'><span style={{ cursor: 'pointer' }}>Ưu tiên <ExclamationCircleOutlined /></span></Tooltip>,
      dataIndex: "priority",
      width: "100px",
      key: 'priority',
      align: "center",
      render: (value, record) => (
        <Checkbox
          checked={value}
          onChange={(e) => {
            if (value) return;
            updateStatusConfig({
              priority: e.target.checked,
              isDefault: true,
              statusHidden: false,
              id: record._id
            });
          }}
        />
      )
    },
    {
      title: 'Mặc định',
      dataIndex: 'isDefault',
      key: 'isDefault',
      align: "center",
      width: 80,
      render: (value, record) => {
        const disable = Boolean(record.priority) && Boolean(record.isDefault)
        const title = disable ? 'Không thể thực hiện thao tác vì trạng thái hiện tại đang được ưu tiên' : '';
        return (
          <Tooltip title={title} >
            <Checkbox
              disabled={disable}
              checked={value}
              onChange={(e) => {
                updateStatusConfig({
                  isDefault: e.target.checked,
                  id: record._id
                });
              }}
            />
          </Tooltip>
        );
      }
    },
    {
      title: 'Quyền quản trị',
      dataIndex: 'justAdmin',
      key: 'justAdmin',
      align: "center",
      width: 80,
      render: (value, record) => (
        <Checkbox checked={value} onChange={(e) => {
          if (!canUpdate) return
          updateStatusConfig({ justAdmin: e.target.checked, id: record._id })
        }} />
      )
    },
    {
      title: 'Ẩn',
      dataIndex: 'statusHidden',
      key: 'statusHidden',
      align: "center",
      width: 60,
      render: (value, record) => (
        <Tooltip title={!record?.justAdmin ? 'Quyền quản trị phải được bật' : (record.priority === true) ? 'Không thể thực hiện thao tác vì trạng thái này là "Ưu tiên"' : ''}>
          <Checkbox disabled={!record?.justAdmin || record.priority} checked={value} defaultChecked={value} onChange={(e) => {
            if (!canUpdate) return
            updateStatusConfig({ statusHidden: e.target.checked, id: record._id })
          }} />
        </Tooltip>
      )
    },
    // canDelete?
    {
      title: "Hành động",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      width: 80,
      render: (_, record) =>
        listStatusConfig?.length >= 1 ? (
          <Tooltip title={!canDelelte ? 'Bạn không được cấp quyền thực hiện thao tác này' : ''}>
            <Button onClick={() => handleDelete(record._id)} disabled={!canDelelte} type="dashed" style={{ color: 'red' }} size="small">Xoá</Button>
          </Tooltip>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      value: 'Mặc định',
      key: 'DEFAULT',
      backgroundColor: "#0040ffff",
      color: '#ffffffff',
      justAdmin: false,
      isDefault: false,
    };
    createStatusConfig(newData)
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
      }),
    };
  });

  return (
    <div>
      <Breadcrumb title={t('Cấu hình trạng thái')} />
      <WithPermission permission={POLICIES.WRITE_TODOSTATUSCONFIG}>
        <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Thêm cấu hình trạng thái
        </Button>
      </WithPermission>

      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={listStatusConfig}
        columns={columns as ColumnTypes}
      />
    </div>
  );
};

export default StatusConfig;