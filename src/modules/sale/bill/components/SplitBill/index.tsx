import React from 'react';
import { SplitBillProvider } from '../../storeContext/SplitBillContext';
import SplitBillForm from './SplitBillForm';
type propsType = {
  bill: any
};
export default function SplitBill({bill}:propsType) : React.JSX.Element {
  return (
    <SplitBillProvider bill={bill}>
      <SplitBillForm/>
    </SplitBillProvider>
  )
};