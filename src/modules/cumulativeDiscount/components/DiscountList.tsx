import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button, Form
} from "antd";
import React, { useMemo } from "react";
import { useGetListProductUnitNoParam } from "~/modules/productUnit/productUnit.hook";
import {
  TYPE_DISCOUNT, TYPE_REWARD, TYPE_VALUE
} from "../constants";
import { TypePropsDiscountList } from "../cumulativeDiscount.modal";
import DiscountItem from "./DiscountItem";

export default function DiscountList({
  loading,
  form,
  target,
}: TypePropsDiscountList): React.JSX.Element {
  const defaultValueDiscount = useMemo(
    () => ({
      typeDiscount: TYPE_DISCOUNT["DISCOUNT.CORE"],
      valueType: TYPE_VALUE.VALUE,
      typeReward: TYPE_REWARD.VALUE,
      target,
    }),
    [target]
  );

  const [units, isLoading] = useGetListProductUnitNoParam();

  return (
    <Form.List name={"cumulativeDiscount"}>
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }: any, index) => (
              <DiscountItem 
              form={form}
              index={index}
              restField={restField}
              key={key}
              loading={loading}
              name={name}
              remove={remove}
              units={units}
              target={target}
              />
            ))}
            <Button
              onClick={() => add(defaultValueDiscount)}
              icon={<PlusCircleOutlined />}
            >
              Thêm chiết khấu
            </Button>
          </>
        );
      }}
    </Form.List>
  );
}
