import { InfoCircleTwoTone, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Tooltip } from "antd";
import React from "react";
import { DataCheckWarehouse } from "~/modules/warehouse/warehouse.modal";
import { STATUS_BILL } from "../constants";

type propsType = {
  onCheckWarehouse?: (data: DataCheckWarehouse) => void;
  branchId: number;
  isSubmitLoading?: boolean;
  canDelete?: boolean;
  canUpdate: boolean;
  title?: string;
  statusBill?: string;
  onOpenModalSelectWarehouse?: () => void;
};
export default function Action({
  onCheckWarehouse,
  branchId,
  isSubmitLoading,
  canDelete,
  canUpdate,
  title = "",
  statusBill,
  onOpenModalSelectWarehouse,
}: propsType): React.JSX.Element {
  const items: MenuProps["items"] = [
    ...(canUpdate
      ? [
          {
            label:
              statusBill !== STATUS_BILL.NEW ? (
                <Tooltip title="Chỉ được kiểm kho ở đơn hàng đang xử lý">
                  <Button
                    disabled={statusBill !== STATUS_BILL.NEW}
                    icon={<InfoCircleTwoTone />}
                    onClick={() =>
                      onOpenModalSelectWarehouse && onOpenModalSelectWarehouse()
                    }
                    type="primary"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    Kiểm kho
                  </Button>
                </Tooltip>
              ) : (
                <Button
                  disabled={statusBill !== STATUS_BILL.NEW}
                  icon={<InfoCircleTwoTone />}
                  onClick={() =>
                    onOpenModalSelectWarehouse && onOpenModalSelectWarehouse()
                  }
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
