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
import { v4 } from "uuid";
import { useGetDebtRule, useResetBillAction } from "../bill.hook";
import { quotation, DebtType } from "../bill.modal";
import { reducerDiscountQuotationItems } from "../bill.service";
import QuotationModule from '~/modules/sale/quotation';
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
export type DataItem = quotation & {
  key: number;
  name: string;
};
type Bill = {
  quotationItems: DataItem[];
  pharmacyId: string;
};

type DiscountDetail = {
  ["DISCOUNT.CORE"]: number;
  ["DISCOUNT.SOFT"]: number;
  ["LK"]: number;
};
export type GlobalCreateBill = {
  quotationItems: DataItem[];
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
  onRemoveTab : () => void,
  debt : DebtType[];
  bill : any
};
const CreateBill = createContext<GlobalCreateBill>({
  quotationItems: [],
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
  onRemoveTab: () => {},
  debt : [],
  bill : null
});

type CreateBillProviderProps = {
  children: ReactNode;
  bill: Bill;
  onChangeBill: (newObjData: any) => void;
  verifyData : () => void
  onRemoveTab : () => void
};

export function CreateBillProvider({
  children,
  bill,
  onChangeBill,
  verifyData,
  onRemoveTab,
}: CreateBillProviderProps): JSX.Element {
  QuotationModule.hook.useResetQuotation();
  const [quotationItems, setQuotationItems] = useState<DataItem[]>([]);
  const [form] = Form.useForm();
  const [debt,isLoadingDebt] = useGetDebtRule();
  
  // Controller Data
  const onSave = (row: DataItem) => {
    const newData: DataItem[] = [...quotationItems];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    const computedRow = {
      ...row,
    };
    const newItemData = { ...item,
       ...computedRow ,
       quantity : Number((get(row, "quantityActual", 1) * get(row, "variant.exchangeValue", 1)).toFixed(1)),
      };

    newData.splice(index, 1, newItemData);
    
    onChangeBill({
      quotationItems: newData,
    });
  };

  const onAdd = (row: Omit<DataItem, "key">) => {
    const newData = [...quotationItems, { ...row, key: v4() }];
    onChangeBill({
      quotationItems: newData,
    });
  };

  const onRemove = (key: string) => {
    const newData = quotationItems?.filter(
      (item: quotation) => get(item, "key") !== key
    );
    onChangeBill({
      quotationItems: newData,
    });
  };



  
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
      quotationItems?.reduce(
        (sum: number, cur: any) =>
          sum + get(cur, "price") * get(cur, "quantity"),
        0
      ),
    [quotationItems]
  );
  const totalPriceAfterDiscount = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalPrice"),
        0
      ),
    [quotationItems]
  );
  const totalDiscount = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalDiscount"),
        0
      ),
    [quotationItems]
  );
  const totalDiscountFromProduct = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: any, cur: any) => {
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
    [quotationItems]
  );
  const totalDiscountFromSupplier = useMemo(
    () =>
      quotationItems?.reduce(
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
    [quotationItems]
  );

  const totalQuantity = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "quantity"),
        0
      ),
    [quotationItems]
  );

  // Initalize Data And Calculate Discount
  useEffect(() => {
    const initDebt = debt?.find((debt : DebtType) => get(debt, "key") === "COD");
    form.setFieldsValue({
      debtType : get(initDebt,'key'),
      pharmacyId : get(bill,'pharmacyId'),
    });
    if (get(bill, "quotationItems", [])?.length) {
      const newQuotationItems: any[] = reducerDiscountQuotationItems(get(bill, "quotationItems", []));
      setQuotationItems(newQuotationItems);
    }
  }, [bill,debt,form,totalPrice]);

  return (
    <CreateBill.Provider
      value={{
        quotationItems,
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
        onRemoveTab,
        bill,
      }}
    >
      {children}
    </CreateBill.Provider>
  );
}

const useCreateBillStore = (): GlobalCreateBill => useContext(CreateBill);

export default useCreateBillStore;
