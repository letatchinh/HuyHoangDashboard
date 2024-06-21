import {
    createContext,
    ReactNode, useCallback, useContext, useMemo, useState
} from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import { useGetBill } from "../bill.hook";
import VoucherModule from '~/modules/vouchers';
import {  REF_COLLECTION, REF_COLLECTION_UPPER, WH_VOUCHER_STATUS } from "~/constants/defaultValue";
import { get, omit, sumBy } from "lodash";
import PaymentVoucherFormPharmacy from "~/modules/paymentVoucher/components/PaymentVoucherFormPharmacy";
import { STATUS_BILL } from "../constants";
export type GlobalUpdateBill = {
    bill : any,
    isLoading : boolean,
    mutateBill : () => void,
    onOpenForm: () => void,
    onOpenFormPayment: () => void
    compareMoney: number,
    totalRevenueInVouchers: number;
    refCollection: any,
};
const UpdateBill = createContext<GlobalUpdateBill>({
    bill : null,
    isLoading : false,
    mutateBill : () => {},
    onOpenForm: () => { },
    onOpenFormPayment: () => { },
    compareMoney: 0,
    totalRevenueInVouchers: 0,
    refCollection: null,

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
    const totalRevenueInVouchers = useMemo(() => {
      if (bill?.receiptVouchers?.length > 0) {
        const data = bill?.receiptVouchers?.filter((item: any)=> (item?.status !== WH_VOUCHER_STATUS.REJECT && item?.status !== WH_VOUCHER_STATUS.CUSTOMER_CANCEL));
        return sumBy([...data], (item) => get(item, 'totalAmount', 0));
      };
      return 0;
    }, [bill]);
  const compareMoney = useMemo(() => (pair || 0) - (totalPrice), [bill, totalReceiptVoucherCompleted]);
  const maxMoneyCanReceipt = useMemo(() => {
    if (bill && totalReceiptVoucherCompleted > 0) {
      return Number(bill?.totalAmount) - Number(totalRevenueInVouchers) > 0 ? Number(bill?.totalAmount) - Number(totalRevenueInVouchers) : 0
    };
    return totalPrice
  },[bill, totalReceiptVoucherCompleted]);
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
        compareMoney,
        totalRevenueInVouchers,
        refCollection,
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
          totalAmount={totalPrice}
          reason={`Thu tiền đơn hàng ${codeSequence || ""} `}
          from='Pharmacy'
          provider={pharmacyId}
          max={maxMoneyCanReceipt}
          method={{
            data : omit(bill,['bill','billItems','historyStatus']),
            type : 'BILL'
          }}
          totalRevenueInVouchers={totalRevenueInVouchers}
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
            note: 'Chi cho khách hàng B2B vì thu dư',
            totalAmount: compareMoney,
          }}
        />
      </ModalAnt>
    </UpdateBill.Provider>
  );
}

const useUpdateBillStore = (): GlobalUpdateBill => useContext(UpdateBill);

export default useUpdateBillStore;
