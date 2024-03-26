import {
    createContext,
    ReactNode, useCallback, useContext, useMemo, useState
} from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import { useGetBill } from "../bill.hook";
import VoucherModule from '~/modules/vouchers';
import {  REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import { omit } from "lodash";
export type GlobalUpdateBill = {
    bill : any,
    isLoading : boolean,
    mutateBill : () => void,
    onOpenForm : () => void,
    
};
const UpdateBill = createContext<GlobalUpdateBill>({
    bill : null,
    isLoading : false,
    mutateBill : () => {},
    onOpenForm : () => {},
});

type UpdateBillProviderProps = {
  children: ReactNode;

};

export function UpdateBillProvider({
  children,

}: UpdateBillProviderProps): JSX.Element {
    const { id } = useParams();
    const [reFetch,setReFetch] = useState(false);
    const mutateBill = useCallback(() => setReFetch(!reFetch),[reFetch]);
    const [bill, isLoading] = useGetBill(id, reFetch);
    const {pharmacyId,totalPrice,codeSequence,_id,totalReceiptVoucherCompleted,remainAmount, remaining} = bill || {};
    
    const [isOpenForm, setIsOpenForm] = useState(false);

  const onOpenForm = () => {
    setIsOpenForm(true);
  };

  const onCloseForm = () => {
    setIsOpenForm(false);
  };
  
  return (
    <UpdateBill.Provider
      value={{
        bill,
        isLoading,
        mutateBill,
        onOpenForm,
      }}
    >
      {children}
      <ModalAnt
        title='Phiếu thu'
        open={isOpenForm}
        onCancel={onCloseForm}
        width={'auto'}
        footer={null}
        destroyOnClose
      >
        <VoucherModule.components.VoucherForm
          billId = {bill?._id}
          callback={mutateBill}
          onClose={() => onCloseForm()}
          pharmacyId={pharmacyId}
          refCollection={REF_COLLECTION_UPPER['PHARMA_PROFILE']}
          totalAmount={remaining}
          reason={`Thu tiền đơn hàng ${codeSequence || ""} `}
          from='Pharmacy'
          provider={pharmacyId}
          max={remainAmount}
          method={{
            data : omit(bill,['bill','billItems','historyStatus']),
            type : 'BILL'
          }}
        />
      </ModalAnt>
    </UpdateBill.Provider>
  );
}

const useUpdateBillStore = (): GlobalUpdateBill => useContext(UpdateBill);

export default useUpdateBillStore;
