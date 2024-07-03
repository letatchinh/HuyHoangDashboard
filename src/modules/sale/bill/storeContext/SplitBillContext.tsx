import { get } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CreateSplitBill } from "../components/SplitBill/constant";

type propsSplitBill = {
  children: React.ReactNode;
  bill: any;
};
export type GlobalSplitBill = {
  bill?: any;
  productsReady: any[];
  productsUnReady: any[];
  listBill?: any[];
  data: any[];
  onSubmit: () => void
};
const SplitBill = createContext<GlobalSplitBill>({
  bill: null,
  productsReady: [],
  productsUnReady: [],
  listBill: [],
  data: [],
  onSubmit: () => {},
});

export function SplitBillProvider({
  children,
  bill,
}: propsSplitBill): React.JSX.Element {
  const [listBill, setListBill] = useState<any>([]);
  const [data, setData] = useState<any[]>([]);

  const onSubmit = () => {
    try {
      const submitData: CreateSplitBill = {
        id: get(bill, "_id"),
        billSplit: data
      };
      console.log(submitData,'submitData')
    } catch (error) {
      
    }
  }
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
      pair: bill?.pair
    }));
    setData(newData);
  }, [listBill]);
  
  return (
    <SplitBill.Provider
      value={{
        productsReady,
        productsUnReady,
        listBill,
        data,
        onSubmit
      }}
    >
      {children}
    </SplitBill.Provider>
  );
}

const useSplitBillStore = (): GlobalSplitBill => useContext(SplitBill);

export default useSplitBillStore;
