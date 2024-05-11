import React from 'react';
import { LANGUAGE,  STATUS_VOUCHER_BORROW_EN, STATUS_VOUCHER_BORROW_NAME_ROOT, } from '../../constants';
type propsType = {
status: string
}
export default function StatusTag({status}:propsType) : React.JSX.Element {
  return (
    <div className={`status-product-borrow ${STATUS_VOUCHER_BORROW_EN[status]?.toLowerCase()}`}>
      {STATUS_VOUCHER_BORROW_NAME_ROOT[status][LANGUAGE.VI]}
    </div>
  )
}