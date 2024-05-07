import { DeleteOutlined, InfoCircleTwoTone } from "@ant-design/icons";
import { Button, Divider, Flex, Popconfirm, Row, Space } from "antd";
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
    <Flex justify="center" vertical gap={10}>
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
      <WithPermission permission={POLICIES.DELETE_PRODUCT}>
        <Space align="center" style={{justifyContent:'center'}}>
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
        </Space>
      </WithPermission>
    </Flex>
  );
}
