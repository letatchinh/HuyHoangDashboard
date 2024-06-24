import { InfoCircleTwoTone, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Popconfirm, Tooltip } from "antd";
import React from "react";
import { DataCheckWarehouse } from "~/modules/warehouse/warehouse.modal";
import useBranchContext from "../store/BranchContext";

type propsType = {
  isSubmitLoading?: boolean;
  title?: string;
  id: string | null;
};
export default function Action({id}: propsType): React.JSX.Element {
  const {
    openFormApiKey,
    deleteWarehouseLink,
    openFormDeleteWarehouseLinked,
    canUpdateWarehouse,
    canDeleteWarehouse
  } = useBranchContext();
  const items: MenuProps["items"] = [
    ...(canUpdateWarehouse ?[{
      label: (
        <Button
          onClick={() => openFormApiKey(id)}
          type="primary"
          size="small"
          style={{ width: "100%" }}
        >
          Liên kết kho
        </Button>
      ),
      key: "1",
    }]:[]),
    ...(canDeleteWarehouse ?[{
      label: (
        <Button
          style={{ marginRight: "10px", width: "100%" }}
          danger
          type="primary"
          onClick={() => openFormDeleteWarehouseLinked(id)}
          size="small"
        >
          {" "}
          Xoá mã liên kết{" "}
        </Button>
      ),
      key: "2",
    }] : []),
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
