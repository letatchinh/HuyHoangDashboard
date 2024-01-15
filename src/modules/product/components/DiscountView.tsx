import { Divider, Typography } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import React, { useMemo } from "react";
import { formatter } from "~/utils/helpers";
import {
  TYPE_DISCOUNT,
  TYPE_DISCOUNT_VI,
  TYPE_REWARD,
  TYPE_REWARD_VI,
  TYPE_VALUE_VI,
} from "../constants";
type propsType = {
  data: any;
  units: any;
};
const Layout = ({ label, value }: { label: string; value: any }) => (
  <p>
    {label}: <Typography.Text strong>{value}</Typography.Text>
  </p>
);
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
const CLONE_TYPE_VALUE_VI: any = TYPE_VALUE_VI;
const CLONE_TYPE_REWARD_VI: any = TYPE_REWARD_VI;

export default function DiscountView({
  data,
  units,
}: propsType): React.JSX.Element {
  console.log(data, "data");
  console.log(units, "units");

  const conditionText = useMemo(() => {
    const applyUnit = units?.find(
      (unit: any) => get(unit, "_id") === get(data, "applyUnit")
    );
    let text = `Từ ${formatter(get(data, "condition.gte"))} ${
      applyUnit ? get(applyUnit, "name", "") : "Đ"
    } `;
    if (get(data, "condition.lte")) {
      text += `đến ${formatter(get(data, "condition.lte"))} ${
        applyUnit ? get(applyUnit, "name", "") : "Đ"
      }`;
    }
    return text;
  }, [data, units]);

  const valueText = useMemo(() => {
    let text = "";
    if (get(data, "typeReward") === TYPE_REWARD.VALUE) {
      text =
        formatter(get(data, "value", "")) +
        CLONE_TYPE_VALUE_VI[get(data, "valueType")];
    } else {
      text = CLONE_TYPE_REWARD_VI[get(data, "typeReward")];
    }
    return text;
  }, [data]);

  const TimeText = useMemo(() => {
    let text = "";
    if (get(data, "applyTimeSheet.isRepeat")) {
      text = `Lặp lại hằng tháng từ ngày ${dayjs(
        get(data, "applyTimeSheet.gte")
      ).format("DD")} đến ngày ${dayjs(get(data, "applyTimeSheet.lte")).format(
        "DD"
      )}`;
    } else {
      text = `Từ ${dayjs(get(data, "applyTimeSheet.gte")).format(
        "DD-MM-YYYY"
      )} đến ${dayjs(get(data, "applyTimeSheet.lte")).format("DD-MM-YYYY")}`;
    }
    return text;
  }, [data]);

  return (
    <div>
      <Layout label="Tên chiết khấu" value={get(data, "name", "")} />
      <Layout
        label="Loại chiết khấu"
        value={CLONE_TYPE_DISCOUNT_VI[get(data, "typeDiscount", "")]}
      />
      <Layout label="Giá trị chiết khấu" value={valueText} />
      {get(data, "typeDiscount") === TYPE_DISCOUNT.LK && (
        <>
          <Layout label="Điều kiện nhận" value={conditionText} />
          <Layout label="Thời gian áp dụng" value={TimeText} />
        </>
      )}
    </div>
  );
}
