import { DeleteOutlined, InfoCircleTwoTone } from "@ant-design/icons";
import { Button, Divider, Popconfirm, Row } from "antd";
import React from "react";
type propsType = {
  onDetailClick?: (_id: string) => void;
  onDelete?: (_id: string) => void;
  _id: string;
  isSubmitLoading?: boolean;
};
export default function ActionColumn({
  onDetailClick,
  onDelete,
  _id,
  isSubmitLoading,
}: propsType): React.JSX.Element {
  return (
    <Row justify={"center"} align={"middle"} wrap={false}>
      <Button
        icon={<InfoCircleTwoTone />}
        onClick={() => onDetailClick && onDetailClick(_id)}
        type="primary"
        size="small"
      >
        Xem chi tiết
      </Button>
      <Divider type="vertical" />
      <Popconfirm
        title="Bạn muốn xoá nhà cung cấp này?"
        onConfirm={() => onDelete && onDelete(_id)}
        okText="Xoá"
        cancelText="Huỷ"
      >
       {onDelete ?<Button
          loading={isSubmitLoading}
          danger
          size="small"
          icon={<DeleteOutlined />}
        >
          Xoá
        </Button>:null}
      </Popconfirm>
    </Row>
  );
}
