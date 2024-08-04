import { Button, Popconfirm, Space } from "antd";
import React from "react";
import WithPermission from "./WithPermission";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
type propsType = {
  onOpenForm: any;
  onDelete: any;
  _id: string;
  textName?: string;
  isSubmitLoading?: boolean;
//   record?: any;
  permissionUpdate?: any;
  permissionDelete?: any;
};
export default function ColumnAction(props: propsType): React.JSX.Element {
  const {
    onOpenForm,
    onDelete,
    _id,
    textName,
    isSubmitLoading,
    permissionUpdate,
    permissionDelete,
  } = props;
  return (
    <Space direction="vertical">
      <WithPermission permission={permissionUpdate}>
        <Button
          block
          icon={<InfoCircleOutlined />}
          onClick={() => onOpenForm(_id)}
          size="small"
        >
          Cập nhật
        </Button>
      </WithPermission>

      <WithPermission permission={permissionDelete}>
        <Popconfirm
          title={`Bạn muốn xoá ${textName} này?`}
          onConfirm={() => onDelete(_id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button
            block
            loading={isSubmitLoading}
            danger
            size="small"
            icon={<DeleteOutlined />}
          >
            Xoá
          </Button>
        </Popconfirm>
      </WithPermission>
    </Space>
  );
}
