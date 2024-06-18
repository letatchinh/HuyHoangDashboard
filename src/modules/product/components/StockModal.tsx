import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import BaseBorderBox from '~/components/common/BaseBorderBox';
import { useGetStock, useResetAction } from '../product.hook';
export interface itemData {
  id: string | null;
  supplierId: string | null;
};
type propsType = {
  data: itemData | null | undefined;
};

export default function StockModal({ data }: propsType): React.JSX.Element {
  useResetAction();
  const [stockInfo,isLoading] = useGetStock(data);
  const columns: ColumnsType = useMemo(() => [
    {
      title: "Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
      width : 130,
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width : 130,
      align: "center",
    },
    {
      title: "Lô",
      dataIndex: "lotNumber",
      key: "lotNumber",
      width : 130,
      align: "center",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      width : 130,
      align: "center",
      render : (value) => {
        return dayjs(value).format("DD/MM/YYYY");
      }
    },
  ], [data]);
  return (
    <>
      {
        stockInfo?.map((item: any) =>
          <>
        <BaseBorderBox title={item?.unit?.name}>
            <TableAnt
              columns={columns}
              dataSource={item?.stockInfo}
              size='small'
              scroll={{ y: 500 }}
              pagination={false}
          />
          </BaseBorderBox>
          </>
        )
      }
    </>
  )
}