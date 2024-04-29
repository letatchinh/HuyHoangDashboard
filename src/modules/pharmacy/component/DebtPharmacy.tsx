import { ColumnsType } from "antd/es/table";
import { formatter } from "~/utils/helpers";
import {
  useGetPharmacyDebt,
  usePharmacyDebtQuery,
  usePharmacyPaging,
} from "../pharmacy.hook";
import TableAnt from "~/components/Antd/TableAnt";
import moment from "moment";
// import ColumnActions from "~/components/common/ColumnAction";
import { useMemo, useState } from "react";
import {
  Row,
} from "antd";
// import PharmacyForm from "./PharmacyForm";
import { propsType } from "../pharmacy.modal";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface UserProps {
  currentTab: string | undefined;
}

export default function DebtPharmacy(props: propsType) {
  const { pharmacyId } = props;
  const [query, onTableChange] = usePharmacyDebtQuery();
  // const defaultDate = useMemo(
  //   () => ({
  //     startDate: dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
  //     endDate: dayjs().endOf("month").format("YYYY-MM-DDTHH:mm:ss"),
  //   }),
  //   []
  // );
  const newQuery = useMemo(
    () => ({
      ...query,
      pharmaId: pharmacyId,
      // ...date,
      // status: searchByStatus?.toString(),
    }),
    [pharmacyId, query]
  );
  const [data, isLoading] = useGetPharmacyDebt(newQuery);
  
  const paging = usePharmacyPaging();
  
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "codeSequence",
        key: "codeSequence",
        width: 120,
        render(codeSequence) {
          return (
            <Link className="link_" to={`/bill?keyword=${codeSequence}`} target={'_blank'}>
              {codeSequence}
            </Link>
          );
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      {
        title: "Giá trị đơn hàng",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 200,
        render(value) {
          return formatter(value);
        },
      },
      {
        title: "Phương thức thanh toán",
        dataIndex: "debtType",
        key: "debtType",
        width: 250,
        
      },
      {
        title: "Đã thanh toán",
        dataIndex: "pair",
        key: "pair",
        width: 120,
        render(value) {
          return formatter(value);
        },
      },
      {
        title: "Nợ",
        dataIndex: "resultDebt",
        key: "resultDebt",
        width: 120,
        render(value) {
          return formatter(value);
        },
      },
    ],
    []
  );

  return (
    <div>
      <Row className="mb-3" justify={"space-between"}>
        {/* <Col span={8}>
          <Search
            enterButton="Tìm kiếm"
            placeholder="Nhập để tìm kiếm"
            allowClear
            onSearch={() => onParamChange({ keyword })}
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
        </Col> */}
      </Row>

        <TableAnt
          dataSource={data}
          loading={isLoading}
          // rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          onChange={onTableChange}
          pagination={{
            ...paging,
            // onChange(page, pageSize) {
            //   onParamChange({ page, limit: pageSize });
            // },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
        />
    </div>
  );
}
