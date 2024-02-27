import { Flex, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { formatter, getRandomColor } from "~/utils/helpers";
type propsType = {
  bills: {
    billId: string;
    codeSequence: string;
    quantity: number;
    totalPrice: number;
    _id: string;
  }[];
  discount : any,
  cumulativeAmount : number,
  cumulativeQuantity : number
};
const WIDTH = 600;

export default function ProcessBillItem({
  bills,
  cumulativeAmount,
  cumulativeQuantity,
  discount
}: propsType): React.JSX.Element {
  const progress = bills.map((item) => ({
      ...item,
    percent: !get(discount, "applyVariantId") ? +((get(item, "totalPrice") / cumulativeAmount) * 100).toFixed(2) : +((get(item, "quantity") / cumulativeQuantity) * 100).toFixed(2),
    // percentQuantity: +((get(item, "quantity") / cumulativeQuantity) * 100).toFixed(2),
    color : getRandomColor(),
  }));
  return (
    <>
    <Flex
      style={{ borderRadius: 50, height: 10, width: WIDTH, overflow: "hidden" }}
    >
      {progress?.map((item) => {
        return (
            <span
              style={{
                height: "100%",
                width: `${get(item, "percent", 0)}%`,
                background: get(item,'color'),
              }}
            ></span>
          )
      })}
    </Flex>
    <Flex
    gap={30}
    style={{maxWidth : WIDTH}}
    wrap={'wrap'}
    >
      {progress?.map((item) => {
        return (
            <Flex align={'center'} gap={5}>

            <span
              style={{
                  height: 10,
                  width: 10,
                  background: get(item,'color'),
                  borderRadius : '50%'
                }}
                >
            </span>
            <Typography.Link strong onClick={() => window.open("/bill/" + get(item,'billId'))}>
            {get(item,'codeSequence')}
            </Typography.Link>
            <span>
                {formatter(!get(discount, "applyVariantId") ? get(item,'totalPrice') : get(item,'quantity'))}(<Typography.Text type="secondary">{get(item, "percent", 0)}%</Typography.Text>)
            </span>
                </Flex>
          )
      })}
    </Flex>
    </>
  );
}
