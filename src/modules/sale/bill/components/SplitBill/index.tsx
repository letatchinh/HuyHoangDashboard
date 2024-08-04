import React from 'react';
import { SplitBillProvider } from '../../storeContext/SplitBillContext';
import SplitBillForm from './SplitBillForm';
type propsType = {
  bill: any;
  onCloseSplitBillForm: () => void;
  closeModalCheckWarehouse: () => void
};
export default function SplitBill({bill, onCloseSplitBillForm, closeModalCheckWarehouse}:propsType) : React.JSX.Element {
  return (
    <SplitBillProvider bill={bill} onCloseSplitBillForm = {onCloseSplitBillForm} closeModalCheckWarehouse = {closeModalCheckWarehouse}>
      <SplitBillForm/>
    </SplitBillProvider>
  )
};