import { Table, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";
import { STATUS_BILL_VI } from "~/modules/sale/bill/constants";
type propsType = {
  historyStatus: any;
};
const CLONE_STATUS_VI: any = STATUS_BILL_VI;
export default function ExpandHistoryPharmacy({
  historyStatus,
}: propsType): React.JSX.Element {
  const dataSource = Object.entries(historyStatus).map(
    ([status, createdAt], index) => ({
      key: index, // Khóa duy nhất cho mỗi hàng, thường là ID
      status: status, // Trạng thái
      createdAt: createdAt, // Ngày tạo
    })
  );
  return (
    <div>
      <h5>Logs</h5>
      <Table
        dataSource={dataSource}
        columns={[
          {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render(status) {
              return <span>{CLONE_STATUS_VI[status]}</span>;
            },
          },
          {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render(createdAt, record, index) {
              return (
                <Typography.Text strong>
                  {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
                </Typography.Text>
              );
            },
          },
        ]}
      />
    </div>
  );
}
