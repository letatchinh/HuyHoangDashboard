import { get } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CreateSplitBill } from "../components/SplitBill/constant";
import { useResetBillInSplitAction, useSplitBill } from "../bill.hook";
import { Modal } from "antd";
import ModalRedirectQuotation from "../components/SplitBill/ModalRedirectQuotation";
import { useDispatch } from "react-redux";
import { billSliceAction } from "../redux/reducer";

type propsSplitBill = {
  children: React.ReactNode;
  bill: any;
  onCloseSplitBillForm: () => void;
  closeModalCheckWarehouse: () => void;
};
export type GlobalSplitBill = {
  bill?: any;
  productsReady: any[];
  productsUnReady: any[];
  listBill?: any[];
  data: any[];
  onSubmit: () => void;
  onCloseSplitBillForm: () => void;
  isSubmitLoading: boolean;
};
const SplitBill = createContext<GlobalSplitBill>({
  bill: null,
  productsReady: [],
  productsUnReady: [],
  listBill: [],
  data: [],
  onSubmit: () => { },
  onCloseSplitBillForm: () => { },
  isSubmitLoading: false,
});

export function SplitBillProvider({
  children,
  bill,
  onCloseSplitBillForm,
  closeModalCheckWarehouse,
}: propsSplitBill): React.JSX.Element {
  const [listBill, setListBill] = useState<any>([]);
  const [isOpen, setIsOpen] = useState<any>(false);
  const [dataCallback, setDataCallback] = useState<any>();
  const [data, setData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const [isSubmitLoading, onSplitBill] = useSplitBill(() => {
    dispatch(billSliceAction.resetActionInSplit());
    onOpen();
  });
  useResetBillInSplitAction();

  const onCallbackSplitBill = (data: any[]) => {
    setDataCallback(data);
  };
  const onSubmit = () => {
    try {
      const submitData: CreateSplitBill = {
        id: get(bill, "_id"),
        billSplit: data,
      };
      onSplitBill({ ...submitData, callback: onCallbackSplitBill});
    } catch (error) {
      console.log(error, 'error in split bill')
    }
  };

  const productsReady = useMemo(() => get(bill, "billItems", []).filter(
    ({ statusCheckWarehouse }: { statusCheckWarehouse: boolean }) =>
      statusCheckWarehouse
  ),[bill]);
  const productsUnReady =useMemo(() => get(bill, "billItems", []).filter(
    ({ statusCheckWarehouse }: { statusCheckWarehouse: boolean }) =>
      !statusCheckWarehouse
  ), [bill]);

  const totalPrice = (billItems: any[]) => {
    return billItems?.reduce(
    (sum: number, cur: any) =>
      sum + get(cur, "price") * get(cur, "quantity"),
    0
  )}; // Tổng giá trị đơn hàng chưa chiếc khấu
  
  const totalQuantity = (billItems: any[]) =>
    billItems?.reduce(
      (sum: number, cur: any) => sum + get(cur, "quantity", 0),
      0
    );
  
  // 
    function distributePayments(totalPaid: number, bills: any) {
      let remainingAmount = totalPaid;
      let updatedOrders = bills.map((bill:any )=> ({ ...bill }));
    
      for (let order of updatedOrders) {
        if (remainingAmount <= 0) break;
    
        if (remainingAmount >= order.totalPrice) {
          order.pair = order.totalPrice;
          remainingAmount -= order.totalPrice;
        } else {
          order.pair = remainingAmount;
          remainingAmount = 0;
        }
      }
    
      return updatedOrders;
  };
    
  //HANDLE FORM
  const onOpen = () => {
    setIsOpen(true);
  };
  
  const onClose = () => {
    setIsOpen(false);
    onCloseSplitBillForm();
    closeModalCheckWarehouse();
  };
  
  //
  useEffect(() => {
    if (bill) {
      setListBill([productsReady, productsUnReady]);
    };
  }, [bill]);

  useEffect(() => {
    const newData = listBill?.map((item: any[]) => ({
      billItems: item,
      totalPrice: totalPrice(item),
      totalQuantity: totalQuantity(item),
      pair: bill?.pair || 0,
    }));
    let newBills = distributePayments(bill?.totalReceiptVoucherCompleted, newData);
    newBills = newBills.map((item: any) => ({
      ...item,
      remaining: (+item?.totalPrice) - (+item?.pair) || 0,
    }));
    setData(newBills);
  }, [listBill]);
  
  return (
    <SplitBill.Provider
      value={{
        productsReady,
        productsUnReady,
        listBill,
        data,
        onSubmit,
        onCloseSplitBillForm,
        isSubmitLoading,
      }}
    >
      {children}
      <Modal
        open={isOpen}
        onCancel={onClose}
        destroyOnClose
        afterClose={onClose}
        footer={null}
        width={'max-content'}
      >
        <ModalRedirectQuotation data={dataCallback} onCancel={onClose}/>
      </Modal>
    </SplitBill.Provider>
  );
}

const useSplitBillStore = (): GlobalSplitBill => useContext(SplitBill);

export default useSplitBillStore;
