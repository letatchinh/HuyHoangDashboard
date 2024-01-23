import { Table } from 'antd';
import React from 'react';
import { useGetReceiptVouchers, useReceiptVoucherQueryParams } from '~/modules/receiptVoucher/receiptVoucher.hook';
type propsType = {

}
export default function ReceiptVouchers(props: propsType): React.JSX.Element {
  const [query, onTableChange] = useReceiptVoucherQueryParams();
  const [vouchers, isLoading] = useGetReceiptVouchers(query);
  console.log(vouchers, 'vouchers')
  return (
    <>
      <Table/>
    </>
  )
}