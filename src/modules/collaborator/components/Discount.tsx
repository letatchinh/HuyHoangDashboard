import { Button, Popover, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import { DISCOUNT_TYPE_VI } from "~/constants/defaultValue";
import DiscountForm from "./DiscountForm";
type propsType = {
  discount: { discountType: "PERCENT" | "VALUE"; value: number };
  onUpdateProduct: (p: any) => void;
  loading: boolean;
};
const CLONE_DISCOUNT_TYPE_VI: any = DISCOUNT_TYPE_VI;

export default function Discount({
  discount,
  onUpdateProduct,
  loading,
}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const hide = useCallback(() => {
    setOpen(false);
  }, []);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <Popover
      trigger={["click"]}
      open={open}
      onOpenChange={handleOpenChange}
      content={
        <DiscountForm
          defaultValue={discount}
          onUpdateProduct={onUpdateProduct}
          hide={hide}
          loading={loading}
        />
      }
    >
      <Button size="small" type="text">
        <Typography.Text strong>
          {" "}
          {get(discount, "value", "")}{" "}
          {CLONE_DISCOUNT_TYPE_VI[get(discount, "discountType", "")]}
        </Typography.Text>
      </Button>
    </Popover>
  );
}
