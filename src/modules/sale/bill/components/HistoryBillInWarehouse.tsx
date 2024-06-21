import { List, Typography } from "antd";
import React from "react";
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
import dayjs from "dayjs";
type propsType = {
  data: any[];
};
type statusType = keyof typeof STATUS_BILL;
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
            <Typography.Text mark>{STATUS_BILL_VI[status]}</Typography.Text>
            {' '}{dayjs(item?.date).format("DD/MM/YYYY HH:mm:ss")}
          </List.Item>
        );
      }}
    />
  );
};
