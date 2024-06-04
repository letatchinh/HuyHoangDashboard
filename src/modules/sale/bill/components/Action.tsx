import {
  InfoCircleTwoTone,
  MoreOutlined
} from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import React from "react";
import { DataCheckWarehouse } from "~/modules/warehouse/warehouse.modal";
import useCreateBillStore from "../storeContext/CreateBillContext";

type propsType = {
  onCheckWarehouse?: (data: DataCheckWarehouse) => void;
  branchId: number;
  isSubmitLoading?: boolean;
  canDelete?: boolean;
  canUpdate: boolean;
  title?: string;
  onOpenModalSelectWarehouse?: () => void
};
export default function Action({
  onCheckWarehouse,
  branchId,
  isSubmitLoading,
  canDelete,
  canUpdate,
  title = '',
  onOpenModalSelectWarehouse
}: propsType): React.JSX.Element {
  const items: MenuProps["items"] = [
    ...(canUpdate
      ? [
          {
            label: (
              <Button
                icon={<InfoCircleTwoTone />}
                onClick={() => onOpenModalSelectWarehouse && onOpenModalSelectWarehouse()}
                type="primary"
                size="small"
                style={{ width: "100%" }}
              >
                Kiểm kho
              </Button>
            ),
            key: "1",
          },
        ]
      : []),
    // ...(canDelete
    //   ? [
    //       {
    //         label: (
    //           <Popconfirm
    //             title={`Bạn muốn xoá ${title} này?`}
    //             onConfirm={() => onDelete && onDelete(_id)}
    //             okText="Xoá"
    //             cancelText="Huỷ"
    //           >
    //             <Button
    //               loading={isSubmitLoading}
    //               danger
    //               size="small"
    //               icon={<DeleteOutlined />}
    //               style={{ width: "100%" }}
    //             >
    //               Xoá
    //             </Button>
    //           </Popconfirm>
    //         ),
    //         key: "2",
    //       },
    //     ]
    //   : []),
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
