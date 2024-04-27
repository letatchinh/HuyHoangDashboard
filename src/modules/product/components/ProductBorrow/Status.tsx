import React from 'react';
import { STATUS_VOUCHER_BORROW, STATUS_VOUCHER_BORROW_VI } from '../../constants';
type propsType = {
status: string
}
export default function StatusTag({status}:propsType) : React.JSX.Element {
  return (
    <div className={`status-product-borrow ${STATUS_VOUCHER_BORROW[status].toLowerCase()}`}>
      {STATUS_VOUCHER_BORROW_VI[status]}
    </div>
  )
}