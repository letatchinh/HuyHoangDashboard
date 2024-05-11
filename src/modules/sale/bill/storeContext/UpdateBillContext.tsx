import {
    createContext,
    ReactNode, useCallback, useContext, useMemo, useState
} from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import { useGetBill } from "../bill.hook";
import VoucherModule from '~/modules/vouchers';
import {  REF_COLLECTION, REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import { omit } from "lodash";
import PaymentVoucherFormPharmacy from "~/modules/paymentVoucher/components/PaymentVoucherFormPharmacy";
export type GlobalUpdateBill = {
    bill : any,
    isLoading : boolean,
    mutateBill : () => void,
    onOpenForm: () => void,
    onOpenFormPayment: () => void
    compareMoney: number
};
const UpdateBill = createContext<GlobalUpdateBill>({
    bill : null,
    isLoading : false,
    mutateBill : () => {},
    onOpenForm: () => { },
    onOpenFormPayment: () => { },
    compareMoney: 0
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
    const {pharmacyId,totalPrice,codeSequence,_id,totalReceiptVoucherCompleted,remainAmount, remaining, pair, refCollection} = bill || {};
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [isOpenFormPayment, setIsOpenFormPayment] = useState(false);
    // const refCo
    console.log(refCollection?.toUpperCase(),'refCollection?.toUpperCase()');
    
  const compareMoney = useMemo(() => pair - totalPrice, [bill]);
  
  const onOpenForm = () => {
    setIsOpenForm(true);
  };

  const onCloseForm = () => {
    setIsOpenForm(false);
  };

  const onOpenFormPayment = () => {
    setIsOpenFormPayment(true);
  };

  const onCloseFormPayment = () => {
    setIsOpenFormPayment(false);
  };
  
  return (
    <UpdateBill.Provider
      value={{
        bill,
        isLoading,
        mutateBill,
        onOpenForm,
        onOpenFormPayment,
        compareMoney
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
          {...refCollection === 'pharma_profile' && {pharmacyId}}
          {...refCollection === 'partner' && {partnerId: pharmacyId}}
          refCollection={REF_COLLECTION_UPPER[refCollection?.toUpperCase()]}
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
      <ModalAnt
        title='Phiếu chi'
        open={isOpenFormPayment}
        onCancel={onCloseFormPayment}
        width={'auto'}
        footer={null}
        destroyOnClose
      >
        <PaymentVoucherFormPharmacy
          initData={{
            pharmacyId: pharmacyId,
            refCollection: REF_COLLECTION.PHARMA_PROFILE,
            debt: compareMoney,
            note: 'Chi cho nhà thuốc vì thu dư',
            totalAmount: compareMoney,
          }}
        />
      </ModalAnt>
    </UpdateBill.Provider>
  );
}

const useUpdateBillStore = (): GlobalUpdateBill => useContext(UpdateBill);

export default useUpdateBillStore;
