import { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useGetReportProductSuppliers,
  useReportOverviewPaging,
  useReportProductSupplierQueryParams,
} from "../reportOverview.hook";
import { formatter } from "~/utils/helpers";
import Breadcrumb from "~/components/common/Breadcrumb";
import {
  checkKeyContainsGroupByRangerDate,
  getReportProductbody,
} from "../reportOverview.modal";
import dayjs from "dayjs";
type propsType = {
  // memoQueryData?: any;
  onParamChange?: any;
};
type omitField = Array<keyof getReportProductbody>;
const omitF = { omitField: ["page", "limit", "reportSize"] as omitField };
export default function DetailData({
  // memoQueryData,
  onParamChange,
}: propsType): React.JSX.Element {
  const paging = useReportOverviewPaging();
  const [activeTab, setActiveTab] = useState(true);
  const [{ page, limit }, setPaging] = useState<{ [K: string]: any }>({
    page: 1,
    limit: 10,
  });

  const [memoQueryData] = useReportProductSupplierQueryParams(omitF);
  const newMemoOfDetail = useMemo(() => {
    return {
      ...memoQueryData,
      page,
      limit,
    };
  }, [page, limit, memoQueryData]);
  const [data, isLoading] = useGetReportProductSuppliers(newMemoOfDetail);
  const resultKey = checkKeyContainsGroupByRangerDate(newMemoOfDetail.dataType);
  // const resultCode = () =>{
  //   return newMemoOfDetail.dataType.includes("City") || newMemoOfDetail.dataType.includes("Area");
  // }
  // console.log(resultCode, "resultCode");
  
  const columns: ColumnsType = [
    {
      title: "STT",
      key: "index",
      width: 50,
      render: (text, record, index) => {
        return (+newMemoOfDetail.page - 1) * newMemoOfDetail.limit + index + 1;
      },
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (record) => {
        return formatter(record);
      },
    },
    ...(resultKey === true ? [
      {
      title: "Ngày",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (record: any) => {
        return dayjs(record).format("DD-MM-YYYY")
      }
    }
  ] : [])
  ];
  return (
    <div>
      <Breadcrumb title={"Báo cáo chi tiết"} />
      <WhiteBox>
        <TableAnt
          dataSource={data || []}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={{
            ...paging,
            showTotal: (total) => {
              return `Tổng cộng: ${total}`;
            },
            onChange: (page, pageSize) => {
              setPaging({ page: page, limit: pageSize });
            },

            showSizeChanger: true,
          }}
          stickyTop
        />
      </WhiteBox>
    </div>
  );
}
