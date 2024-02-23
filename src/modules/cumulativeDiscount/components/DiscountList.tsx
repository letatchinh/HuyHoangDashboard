import { PlusCircleOutlined } from "@ant-design/icons";
import {
  Button, Form
} from "antd";
import React, { useMemo } from "react";
import UnitModule from '~/modules/productUnit';
import {
  TYPE_DISCOUNT, TYPE_REPEAT, TYPE_REWARD, TYPE_VALUE
} from "../constants";
import { TypePropsDiscountList } from "../cumulativeDiscount.modal";
import DiscountItem from "./DiscountItem";
export default function DiscountList({
  loading,
  form,
  target,
  supplierId
}: TypePropsDiscountList): React.JSX.Element {
  const defaultValueDiscount = useMemo(
    () => ({
      typeDiscount: TYPE_DISCOUNT["DISCOUNT.CORE"],
      valueType: TYPE_VALUE.VALUE,
      typeReward: TYPE_REWARD.VALUE,
      target,
      timesReward : 1,
      typeRepeat : TYPE_REPEAT.noTime
    }),
    [target]
  );

  const [units,isLoading] = UnitModule.hook.useGetListProductUnitAll();

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
              supplierId={supplierId}
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
