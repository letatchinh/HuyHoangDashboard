import { Form } from "antd";
import { compact, concat, forIn, get } from "lodash";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  cumulativeDiscountType,
  conditionType,
} from "~/modules/product/product.modal";
import BillModule from "~/modules/bill";
import { v4 } from "uuid";
import { useGetDebtRule } from "../bill.hook";
import { billItem, DebtType } from "../bill.modal";
import { reducerDiscountBillItems } from "../bill.service";
const TYPE_DISCOUNT = {
  "DISCOUNT.CORE": "DISCOUNT.CORE",
  "DISCOUNT.SOFT": "DISCOUNT.SOFT",
  LK: "LK",
};
const TARGET = {
  product : "product",
  supplier : "supplier",
}
// type typeCumulativeDiscount = {
//   typeReward: string;
//   value: string;
//   name: string;
//   valueType: string;
//   target: string;
//   targetId: string;
//   typeDiscount: string;
//   session: string;
//   code: string;
//   _id: string;
// };
export type DataItem = billItem & {
  key: number;
  name: string;
};
type Bill = {
  billItems: DataItem[];
  pharmacyId: string;
};

type DiscountDetail = {
  ["DISCOUNT.CORE"]: number;
  ["DISCOUNT.SOFT"]: number;
  ["LK"]: number;
};
export type GlobalCreateBill = {
  billItems: DataItem[];
  onSave: (newRow: DataItem) => void;
  onAdd: (newRow: Omit<DataItem, "key">) => void;
  onRemove: (productId: string) => void;
  form: any;
  onValueChange: (newValue: any, allValues: any) => void;
  totalPrice: number;
  totalQuantity: number;
  totalPriceAfterDiscount: number;
  totalDiscount: number;
  totalDiscountFromProduct: DiscountDetail | null;
  totalDiscountFromSupplier: DiscountDetail | null;
  verifyData : (callback?:any) => void,
  debt : DebtType[];
};
const CreateBill = createContext<GlobalCreateBill>({
  billItems: [],
  onSave: () => {},
  onAdd: () => {},
  onRemove: () => {},
  form: null,
  onValueChange: () => {},
  totalPrice: 0,
  totalQuantity: 0,
  totalPriceAfterDiscount: 0,
  totalDiscount : 0,
  totalDiscountFromProduct : null,
  totalDiscountFromSupplier: null,
  verifyData: () => {},
  debt : [],
});

type CreateBillProviderProps = {
  children: ReactNode;
  bill: Bill;
  onChangeBill: (newObjData: any) => void;
  verifyData : () => void
};

export function CreateBillProvider({
  children,
  bill,
  onChangeBill,
  verifyData,
}: CreateBillProviderProps): JSX.Element {
  
  const [billItems, setBillItems] = useState<DataItem[]>([]);
  
  const [form] = Form.useForm();
  const [debt,isLoadingDebt] = useGetDebtRule();
  
  // Controller Data
  const onSave = (row: DataItem) => {
    const newData: DataItem[] = [...billItems];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    const computedRow = {
      ...row,
    };

    newData.splice(index, 1, { ...item, ...computedRow });
    onChangeBill({
      billItems: newData,
    });
  };

  const onAdd = (row: Omit<DataItem, "key">) => {
    const newData = [...billItems, { ...row, key: v4() }];
    onChangeBill({
      billItems: newData,
    });
  };

  const onRemove = (key: string) => {
    const newData = billItems?.filter(
      (item: billItem) => get(item, "key") !== key
    );
    onChangeBill({
      billItems: newData,
    });
  };

  useEffect(() => {
    setBillItems(get(bill, "billItems", []));
    const initDebt = debt?.find((debt : DebtType) => get(debt, "key") === "COD");
    form.setFieldsValue({
      ...bill,
      debtType : get(initDebt,'key')
    });
  }, [bill, form,debt]);

  const onValueChange = (value: any, values: any) => {
    const key: any = Object.keys(value)[0];
    switch (key) {
      case "pharmacyId":
        onChangeBill({
          pharmacyId: value[key],
        });
        break;

      default:
        break;
    }
  };

  const totalPrice = useMemo(
    () =>
      billItems?.reduce(
        (sum: number, cur: any) =>
          sum + get(cur, "price") * get(cur, "quantity"),
        0
      ),
    [billItems]
  );
  const totalPriceAfterDiscount = useMemo(
    () =>
      billItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalPrice"),
        0
      ),
    [billItems]
  );
  const totalDiscount = useMemo(
    () =>
      billItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalDiscount"),
        0
      ),
    [billItems]
  );
  const totalDiscountFromProduct = useMemo(
    () =>
      billItems?.reduce(
        (sum: any, cur: any) => {
          console.log(cur,'current');
          
          const newSum : any = {};
          forIn(TYPE_DISCOUNT,(value : any,key : any) => {
            newSum[key] = sum[key] +  get(cur,['totalDiscountDetailFromProduct',key],0)
          })
          return newSum
        },
        {
          [TYPE_DISCOUNT["DISCOUNT.CORE"]]: 0,
          [TYPE_DISCOUNT["DISCOUNT.SOFT"]]: 0,
          [TYPE_DISCOUNT.LK]: 0,
        }
      ),
    [billItems]
  );
  const totalDiscountFromSupplier = useMemo(
    () =>
      billItems?.reduce(
        (sum: any, cur: any) => {
          const newSum : any = {};
          forIn(TYPE_DISCOUNT,(value : any,key : any) => {
            newSum[key] = sum[key] +  get(cur,['totalDiscountDetailFromSupplier',key],0)
          })
          return newSum
        },
        {
          [TYPE_DISCOUNT["DISCOUNT.CORE"]]: 0,
          [TYPE_DISCOUNT["DISCOUNT.SOFT"]]: 0,
          [TYPE_DISCOUNT.LK]: 0,
        }
      ),
    [billItems]
  );

  const totalQuantity = useMemo(
    () =>
      billItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "quantity"),
        0
      ),
    [billItems]
  );

  useEffect(() => {
    if (get(bill, "billItems", [])?.length) {
      const newBillItems: any[] = reducerDiscountBillItems(get(bill, "billItems", []))
      setBillItems(newBillItems);
    }
  }, [totalPrice, bill]);

  return (
    <CreateBill.Provider
      value={{
        billItems,
        onSave,
        onAdd,
        onRemove,
        form,
        onValueChange,
        totalPrice,
        totalQuantity,
        totalPriceAfterDiscount,
        totalDiscount,
        totalDiscountFromProduct,
        totalDiscountFromSupplier,
        verifyData,
        debt,
      }}
    >
      {children}
    </CreateBill.Provider>
  );
}

const useCreateBillStore = (): GlobalCreateBill => useContext(CreateBill);

export default useCreateBillStore;
