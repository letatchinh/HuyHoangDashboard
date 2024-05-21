import { ColumnsType } from "antd/es/table";
import React, { useMemo } from "react";
import apis from "../reportProductSupplier.api";
import { getReportProductbody } from "../reportProductSupplier.modal";
import { useFetchState } from "~/utils/hook";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
type propsType = {
  query?: any;
  date?: any;
};
export default function DetailData(props: propsType): React.JSX.Element {
  const { query, date } = props;
  const memoQueryData = useMemo(
    () => ({
      api: apis.getListData,
      query: query,
      useDocs: true,
      required: ["dataType"] as (keyof getReportProductbody)[],
      ...date,
    }),
    [query, date]
  );
  const [data, isLoading] = useFetchState(memoQueryData);
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
    },
  ];
  return (
    <div>
      <WhiteBox>
        <TableAnt
          dataSource={data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
        //   pagination={{
            // ...paging,
            // onChange(page, pageSize) {
              // onParamChange({ page, limit: pageSize });
            // },
            // showTotal: (total) => `Tổng cộng: ${total}`,
        //   }}
        //   pagination={false}
        //   stickyTop
        />
      </WhiteBox>
    </div>
  );
}
