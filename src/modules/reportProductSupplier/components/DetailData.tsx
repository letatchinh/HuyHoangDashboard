import { ColumnsType } from "antd/es/table";
import React, { useMemo, useState } from "react";
import { getReportProductbody } from "../reportProductSupplier.modal";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useGetReportProductSuppliers,
  useReportProductSupplierPaging,
  useReportProductSupplierQueryParams,
} from "../reportProductSupplier.hook";
import { formatter } from "~/utils/helpers";
import Breadcrumb from "~/components/common/Breadcrumb";
type propsType = {
  // memoQueryData?: any;
  onParamChange?: any;
};
type  omitField = Array<keyof getReportProductbody>
const omitF ={omitField: ['page','limit','reportSize'] as omitField}
export default function DetailData({
  // memoQueryData,
  onParamChange,
}: propsType): React.JSX.Element {
  const paging = useReportProductSupplierPaging();
  const [{page,limit},setPaging] = useState<{[K:string]:any}>({page:1,limit:10})

  const [memoQueryData] = useReportProductSupplierQueryParams(omitF);
  const newMemoOfDetail = useMemo(()=>{
    return {
      ...memoQueryData,
      page,
      limit
    }
  },[page,limit,memoQueryData])
  const [data, isLoading] = useGetReportProductSuppliers(newMemoOfDetail);
  const columns: ColumnsType = [
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
