import {
  createContext,
  ReactNode, useCallback, useContext, useMemo, useState
} from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import {  REF_COLLECTION, REF_COLLECTION_UPPER, WH_VOUCHER_STATUS } from "~/constants/defaultValue";
import { get, omit, sumBy } from "lodash";
import PaymentVoucherFormPharmacy from "~/modules/paymentVoucher/components/PaymentVoucherFormPharmacy";
import VoucherModule from '~/modules/vouchers';
import { useGetWarehouse, useGetWarehouseByBranchLinked } from "~/modules/warehouse/warehouse.hook";
import { useGetBill } from "../bill.hook";
import LogisticForm from "~/modules/logistic/components/LogisticForm";
import useNotificationStore from "~/store/NotificationContext";
import SplitBillForm from "../components/SplitBill/SplitBillForm";

export type GlobalUpdateBill = {
    bill : any,
    isLoading : boolean,
    mutateBill : () => void,
    onOpenForm: () => void,
    onOpenFormPayment: () => void
    compareMoney: number,
    totalRevenueInVouchers: number;
    refCollection: any,
    onOpenFormLogistic: () => void;
    onCloseFormLogistic: () => void;
    checkboxPayment: string | null;
    setCheckboxPayment: (p: string | null) => void;
    listWarehouse: any[];
    isLoadingWarehouse: boolean;
    warehouseInfo: any;
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
    onOpenFormLogistic: () => { },
    onCloseFormLogistic: () => { },
    checkboxPayment: null,
    setCheckboxPayment: (p: string | null) => { },
    listWarehouse: [],
    isLoadingWarehouse: false,
    warehouseInfo: null,
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
    const [logisticOpen, setLogisticOpen] = useState(false);
    const [checkboxPayment, setCheckboxPayment] = useState<string | null>(null);
    const [listWarehouse, isLoadingWarehouse] = useGetWarehouseByBranchLinked();
  
    const totalRevenueInVouchers = useMemo(() => {
      if (bill?.receiptVouchers?.length > 0) {
        const data = bill?.receiptVouchers?.filter((item: any)=> (item?.status !== WH_VOUCHER_STATUS.REJECT && item?.status !== WH_VOUCHER_STATUS.CUSTOMER_CANCEL));
        return sumBy([...data], (item) => get(item, 'totalAmount', 0));
      };
      return 0;
    }, [bill]);
  const compareMoney = useMemo(() => totalReceiptVoucherCompleted - (totalPrice), [bill, totalReceiptVoucherCompleted]);
  const maxMoneyCanReceipt = useMemo(() => {
    if (bill && totalReceiptVoucherCompleted > 0) {
      return Number(bill?.totalAmount) - Number(totalRevenueInVouchers) > 0 ? Number(bill?.totalAmount) - Number(totalRevenueInVouchers) : 0
    };
    return totalPrice
  }, [bill, totalReceiptVoucherCompleted]);
  
  const warehouseInfo = useMemo(() => (listWarehouse || [])?.find((item: any) => item._id === bill?.warehouseId), [bill?.warehouseId, listWarehouse]);
 
  //Warehouse

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

  const onOpenFormLogistic = () => {
    setLogisticOpen(true);
  };

  const onCloseFormLogistic = () => {
    setLogisticOpen(false);
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
        onOpenFormLogistic,
        onCloseFormLogistic,
        checkboxPayment,
        setCheckboxPayment,
        listWarehouse,
        isLoadingWarehouse,
        warehouseInfo,
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
          totalAmount={get(bill,'remaining',0)}
          reason={`Thu tiền đơn hàng ${codeSequence || ""} `}
          from='Pharmacy'
          provider={pharmacyId}
          max={maxMoneyCanReceipt}
          method={{
            data : omit(bill,['bill','billItems','historyStatus']),
            type : 'BILL'
          }}
          totalRevenueInVouchers={get(bill, 'totalReceiptVoucherWaiting',0)}
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
      <ModalAnt
        title='Chi phí vận chuyển'
        open={logisticOpen}
        onCancel={onCloseFormLogistic}
        width={'auto'}
        footer={null}
        destroyOnClose
      >
        <LogisticForm
          bill = {bill}
          onCloseFormLogistic = {onCloseFormLogistic}
          setCheckboxPayment = {(p: string | null) => setCheckboxPayment(p)}
          checkboxPayment={checkboxPayment}
          deliveryAddressId={bill?.deliveryAddressId}
          dataTransportUnit={bill?.bill?.dataTransportUnit}
          pharmacy={bill?.pharmacy}
          id={bill?._id}
          warehouseInfo={warehouseInfo}
        />
      </ModalAnt>
    </UpdateBill.Provider>
  );
}

const useUpdateBillStore = (): GlobalUpdateBill => useContext(UpdateBill);

export default useUpdateBillStore;
