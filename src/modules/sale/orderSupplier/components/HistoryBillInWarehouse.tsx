import { Flex, List, Typography } from "antd";
import React from "react";
import dayjs from "dayjs";
import { STATUS_ORDER_SUPPLIER, STATUS_ORDER_SUPPLIER_VI } from "../constants";
type propsType = {
  data: any[];
};
type statusType = 'CREATED' | keyof typeof STATUS_ORDER_SUPPLIER  ;
export default function HistoryBillInWarehouse({
  data,
}: propsType): React.JSX.Element {
  return (
    <List
      bordered
      dataSource={data}
      renderItem={(item) => {
        const status: statusType = item?.status;
        return (
          <List.Item>
            <Typography.Text mark>{STATUS_ORDER_SUPPLIER_VI[status === 'CREATED' ? 'NEW' : status]}</Typography.Text>
            <Typography.Text style={{ marginLeft: "10px", fontWeight: 600 }}>
            {' '}{item?.fullName}
            </Typography.Text>
            {' '}{dayjs(item?.date).format("DD/MM/YYYY HH:mm:ss")}
            <Typography.Text style={{ marginLeft: "10px", backgroundColor: '#BBE9FF' }}>
            {' '}{item?.note}
            </Typography.Text>
          </List.Item>
        );
      }}
    />
  );
};
