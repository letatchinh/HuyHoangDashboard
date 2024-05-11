import {
  DeleteOutlined,
  InfoCircleTwoTone,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Popconfirm } from "antd";
import React from "react";
type propsType = {
  onDetailClick?: (_id: string) => void;
  onDelete?: (_id: string) => void;
  _id: string;
  isSubmitLoading?: boolean;
  canDelete?: boolean;
  canUpdate?: boolean;
  title?:string
};
export default function Action({
  onDetailClick,
  onDelete,
  _id,
  isSubmitLoading,
  canDelete,
  canUpdate,
  title = ''
}: propsType): React.JSX.Element {
  const items: MenuProps["items"] = [
    ...(canUpdate
      ? [
          {
            label: (
              <Button
                icon={<InfoCircleTwoTone />}
                onClick={() => onDetailClick && onDetailClick(_id)}
                type="primary"
                size="small"
                style={{ width: "100%" }}
              >
                Xem chi tiết
              </Button>
            ),
            key: "1",
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            label: (
              <Popconfirm
                title={`Bạn muốn xoá ${title} này?`}
                onConfirm={() => onDelete && onDelete(_id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button
                  loading={isSubmitLoading}
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ width: "100%" }}
                >
                  Xoá
                </Button>
              </Popconfirm>
            ),
            key: "2",
          },
        ]
      : []),
  ];

  return (
    <Dropdown
      placement="bottomLeft"
      menu={{
        items,
      }}
      trigger={["click"]}
    >
      <Button type="primary" shape="circle" icon={<MoreOutlined />}></Button>
    </Dropdown>
  );
}
