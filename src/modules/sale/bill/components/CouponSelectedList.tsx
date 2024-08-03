import { List } from "antd";
import React, { useMemo } from "react";
import EmptyData from "~/components/Antd/EmptyData";
import Coupon from "~/modules/coupon/components/Coupon";
import { CouponInSelect } from "~/modules/coupon/coupon.modal";
import useCreateBillStore from "../storeContext/CreateBillContext";
type propsType = {};
export default function CouponSelectedList(
  props: propsType
): React.JSX.Element {
  const { couponSelected } = useCreateBillStore();
  const dataSource = useMemo(
    () => [...couponSelected.bill, ...couponSelected.ship],
    [couponSelected]
  );
  return (
    <div style={{ maxHeight: "90vh", overflowY: "scroll", width: "100%" }}>
      {!dataSource?.length && <EmptyData messCheck={false}/>}
      {dataSource?.map((item: CouponInSelect) => (
        <Coupon readOnly key={item._id} coupon={item} />
      ))}
    </div>
  );
}
