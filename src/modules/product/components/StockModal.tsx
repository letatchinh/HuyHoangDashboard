import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import { useGetStock, useResetAction } from "../product.hook";
import { Spin } from "antd";
import { formatNumberThreeComma } from "~/utils/helpers";
import { head } from "lodash";
export interface itemData {
  id: string | null;
  supplierId: string | null;
  variantId?: string | null;
  name?: string | null;
}
type propsType = {
  data: itemData | null | undefined;
};

export default function StockModal({ data }: propsType): React.JSX.Element {
  useResetAction();
  const [stockInfo, isLoading] = useGetStock(data);
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 130,
        align: "center",
        render: (value: number) => formatNumberThreeComma(value || 0),
      },
      {
        title: "Lô",
        dataIndex: "lotNumber",
        key: "lotNumber",
        width: 130,
        align: "center",
      },
      {
        title: "Ngày hết hạn",
        dataIndex: "expirationDate",
        key: "expirationDate",
        width: 130,
        align: "center",
        render: (value) => {
          return dayjs(value).format("DD/MM/YYYY");
        },
      },
    ],
    [data,stockInfo]
  );
  return (
    isLoading ? <div>Đang tải... <Spin/></div> : 
      <>
        <h6>{stockInfo?.data?.length > 0 && stockInfo?.data[0]?.name}</h6>
          { stockInfo?.data?.map((item: any) => {
            return (
              <BaseBorderBox title={item?.warehouseName}>
                <TableAnt
                  columns={columns}
                  dataSource={item?.batches ?? []}
                  size="small"
                  scroll={{ y: 500 }}
                  pagination={false}
                // loading={isLoading}
                />
              </BaseBorderBox>
            )
          })}
      </>
  );
}
