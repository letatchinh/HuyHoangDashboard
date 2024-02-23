import React, { useEffect, useMemo, useState } from "react";
import { useFetchState } from "~/utils/hook";
import ProductModule from "~/modules/product";
import { get } from "lodash";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Statistic,
} from "antd";
import { formatter } from "~/utils/helpers";
import apis from "../supplier.api";
import dayjs from "dayjs";
import {
  BarChartOutlined,
  FilterOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { FormFieldSearch, SearchByType } from "../supplier.modal";
import TableAnt from "~/components/Antd/TableAnt";
import { ColumnsType } from "antd/es/table/InternalTable";
import ChartBill from "./ChartBill";
type propsType = {
  query?: any;
  searchByVi?: any;
  searchBy?: any;
};
const columns: ColumnsType = [
  {
    title: "Mã đơn hàng",
    dataIndex: "codeSequence",
    key: "codeSequence",
  },
  {
    title: "Tổng giá trị",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render(totalPrice, record, index) {
      return formatter(totalPrice);
    },
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render(createdAt, record, index) {
      return dayjs(createdAt).format("DD-MM-YYYY HH:mm:ss");
    },
  },
];
export default function SaleReport({
  query,
  searchBy,
  searchByVi,
}: propsType): React.JSX.Element {
  const [typeShow, setTypeShow] = useState<"chart" | "table">("chart");
  const [bills, loadingBills] = useFetchState({
    api: apis.getBills,
    query,
    useDocs: false,
  });

  return (
    <div>
      <Space>
        <Button
          onClick={() => setTypeShow("chart")}
          type={typeShow === "chart" ? "primary" : "default"}
          icon={<BarChartOutlined />}
        ></Button>
        <Button
          onClick={() => setTypeShow("table")}
          type={typeShow === "table" ? "primary" : "default"}
          icon={<TableOutlined />}
        ></Button>
      </Space>
      {typeShow === "table" && (
        <TableAnt
          dataSource={get(bills, "bills", [])}
          columns={columns}
          loading={loadingBills}
          pagination={false}
          size="small"
          scroll={{ y: 500 }}
        />
      )}
      {typeShow === "chart" && (
        <ChartBill
          loadingBills={loadingBills}
          data={bills}
          searchBy={searchBy}
          searchByVi={searchByVi}
        />
      )}
    </div>
  );
}
