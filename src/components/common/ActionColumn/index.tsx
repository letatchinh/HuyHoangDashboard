import { DeleteOutlined, InfoCircleTwoTone } from "@ant-design/icons";
import { Button, Divider, Popconfirm, Row } from "antd";
import React from "react";
import WithPermission from "../WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
type propsType = {
  onDetailClick?: (_id: string) => void;
  onDelete?: (_id: string) => void;
  _id: string;
  isSubmitLoading?: boolean;
  title?:string
};
export default function ActionColumn({
  onDetailClick,
  onDelete,
  _id,
  isSubmitLoading,
  title,
}: propsType): React.JSX.Element {
  return (
    <Row justify={"center"} align={"middle"} wrap={false}>
      <WithPermission permission={POLICIES.UPDATE_PRODUCT}>
        <Button
          icon={<InfoCircleTwoTone />}
          onClick={() => onDetailClick && onDetailClick(_id)}
          type="primary"
          size="small"
        >
          {title ? title :'Xem chi tiết'}
        </Button>
      </WithPermission>
      <Divider type="vertical" />
      <WithPermission permission={POLICIES.DELETE_PRODUCT}>
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
      </WithPermission>
    </Row>
  );
}
