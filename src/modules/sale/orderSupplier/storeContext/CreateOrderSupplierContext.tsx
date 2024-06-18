import { Form } from "antd";
import { forIn, get } from "lodash";
import {
  createContext,
  ReactNode, useCallback, useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { v4 } from "uuid";
import OrderSupplierModule from '~/modules/sale/orderSupplier';
import BillModule from '~/modules/sale/bill';
import { onVerifyData, reducerDiscountOrderSupplierItems } from "../orderSupplier.service";
import { DEFAULT_DEBT_TYPE } from "../constants";
import { orderSupplier } from "../orderSupplier.modal";
import ModalAnt from "~/components/Antd/ModalAnt";
import RadioButtonWarehouseInSupplier from "~/modules/warehouse/components/RadioButtonWarehouseInSupplier";
import { useGetWarehouse } from "~/modules/warehouse/warehouse.hook";
const TYPE_DISCOUNT = {
  "DISCOUNT.CORE": "DISCOUNT.CORE",
  "DISCOUNT.SOFT": "DISCOUNT.SOFT",
  LK: "LK",
};

export type DataItem = orderSupplier & {
  key: number;
  name: string;
};
type Bill = {
  orderSupplierItems: DataItem[];
  supplierId: string;
};

type DiscountDetail = {
  ["DISCOUNT.CORE"]: number;
  ["DISCOUNT.SOFT"]: number;
  ["LK"]: number;
};
export type GlobalCreateOrderSupplier = {
  orderSupplierItems: DataItem[];
  onSave: (newRow: DataItem) => void;
  onAdd: (newRow: Omit<DataItem, "key">) => void;
  onRemove: (productId: string) => void;
  form: any;
  onValueChange: (newValue: any, allValues: any) => void;
  totalPrice: number;
  totalQuantity: number;
  totalPriceAfterDiscount: number;
  totalAmount: number;
  totalDiscount: number;
  totalDiscountFromProduct: DiscountDetail | null;
  totalDiscountFromSupplier: DiscountDetail | null;
  verifyData : (callback?:any) => void,
  onRemoveTab : () => void,
  debt : any[];
  bill : any,
  onOpenModalResult : (data:any) => void
  mutateReValidate: () => void
  onOpenModalWarehouse: () => void;
  onCloseModalWarehouse: () => void
};
const CreateOrderSupplier = createContext<GlobalCreateOrderSupplier>({
  orderSupplierItems: [],
  onSave: () => {},
  onAdd: () => {},
  onRemove: () => {},
  form: null,
  onValueChange: () => {},
  totalPrice: 0,
  totalQuantity: 0,
  totalPriceAfterDiscount: 0,
  totalAmount: 0,
  totalDiscount : 0,
  totalDiscountFromProduct : null,
  totalDiscountFromSupplier: null,
  verifyData: () => {},
  onRemoveTab: () => {},
  debt : [],
  bill : null,
  onOpenModalResult: () => {},
  mutateReValidate: () => { },
  onOpenModalWarehouse: () => { },
  onCloseModalWarehouse: () => { }
});

type CreateBillProviderProps = {
  children: ReactNode;
  bill: Bill;
  onChangeBill: (newObjData: any) => void;
  verifyData : () => void
  onRemoveTab : () => void
  onOpenModalResult : (data:any) => void
};

export function CreateOrderSupplierProvider({
  children,
  bill,
  onChangeBill,
  verifyData,
  onRemoveTab,
  onOpenModalResult,
}: CreateBillProviderProps): JSX.Element {
  const [form] = Form.useForm();
  console.log(bill,'bill')
  OrderSupplierModule.hook.useResetOrderSupplier();
  const [countReValidate,setCountReValidate] = useState(1);
  const [orderSupplierItems, setOrderSupplierItems] = useState<DataItem[]>([]);
  
  const [debt, isLoadingDebt] = BillModule.hook.useGetDebtRule();
  
  const [isOpenWarehouse, setIsOpenWarehouse] = useState(false);
  const [warehouseDefault, isLoadingWarehouseDefault] = useGetWarehouse();

  // Controller Data
  const onSave = (row: DataItem) => {
    const newData: DataItem[] = [...orderSupplierItems];
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
      orderSupplierItems: newData,
    });
  };

  const onAdd = (row: Omit<DataItem, "key">) => {
    const newData = [...orderSupplierItems, { ...row, key: v4() }];
    onChangeBill({
      orderSupplierItems: newData,
    });
  };

  const onRemove = (key: string) => {
    const newData = orderSupplierItems?.filter(
      (item: any) => get(item, "key") !== key
    );
    onChangeBill({
      orderSupplierItems: newData,
    });
  };

  // Trigger ReValidation Bill Sample and discount
  const mutateReValidate = useCallback(() => {
    setCountReValidate(countReValidate+1);
  },[countReValidate]);

  useEffect(() => {
    if(countReValidate > 1){
      verifyData();
    }
  },[countReValidate]);


  const onValueChange = (value: any, values: any) => {
        
    const key: any = Object.keys(value)[0];
    switch (key) {
      case "supplierId":
        onChangeBill({
          supplierId: value[key],
        });
        // Revalidate after change Pharmacy
        mutateReValidate();
        break;

      case "debtType":
        if(values[key] === 'COD'){
          onChangeBill({
            pair: 0,
          });
        }
        
        // Revalidate after change Pharmacy
        mutateReValidate();
        break;

      default:
        break;
    }
  };

  const pair = Form.useWatch('pair',form) || 0;
  const totalPrice = useMemo(
    () =>
      orderSupplierItems?.reduce(
        (sum: number, cur: any) =>
          sum + get(cur, "unitPrice") * get(cur, "quantityActual"),
        0
      ),
    [orderSupplierItems]
  );

  const totalAmount = useMemo(
    () =>
      orderSupplierItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalPrice"),
        0
      ),
    [orderSupplierItems]
  );

  const totalPriceAfterDiscount = useMemo(
    () =>
    totalAmount - pair,
    [orderSupplierItems,pair]
  );
  const totalDiscount = useMemo(
    () =>
      orderSupplierItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalDiscount"),
        0
      ),
    [orderSupplierItems]
  );
  const totalDiscountFromProduct = useMemo(
    () =>
      orderSupplierItems?.reduce(
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
    [orderSupplierItems]
  );
  const totalDiscountFromSupplier = useMemo(
    () =>
      orderSupplierItems?.reduce(
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
    [orderSupplierItems]
  );

  const totalQuantity = useMemo(
    () =>
      orderSupplierItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "quantityActual",0),
        0
      ),
    [orderSupplierItems]
  );

  const onOpenModalWarehouse = () => {
    setIsOpenWarehouse(true);
  };
  const onCloseModalWarehouse = () => {
    setIsOpenWarehouse(false);
  };
  const onAddWarehouse = (data: any) => {
    onChangeBill({
      warehouseId: get(data, "warehouseId"),
      warehouseName: get(data, "name.vi",''),
      warehouseBranchId: get(data, "_id"),
    });
  };

  // Initalize Data And Calculate Discount
  useEffect(() => {
    const initDebt = debt?.find((debt : any) => get(debt, "key") === DEFAULT_DEBT_TYPE);    
    form.setFieldsValue({
      debtType :  form.getFieldValue('debtType') || get(bill,'debtType') ||  get(initDebt,'key'),
      supplierId : get(bill,'supplierId'),
      pair : get(bill,'pair',0)
    });
    if (get(bill, "supplierId")) {
      const newOrderSupplierItems: any[] = reducerDiscountOrderSupplierItems(get(bill, "orderSupplierItems", []));
      setOrderSupplierItems(newOrderSupplierItems);
    }
  }, [bill,debt,form,totalPrice]);

  return (
    <CreateOrderSupplier.Provider
      value={{
        orderSupplierItems,
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
        onOpenModalResult,
        mutateReValidate,
        totalAmount,
        onOpenModalWarehouse,
        onCloseModalWarehouse
      }}
    >
      {children}
      <ModalAnt
        open={isOpenWarehouse}
        onCancel={onCloseModalWarehouse}
        destroyOnClose
        footer={null}
      >
        <RadioButtonWarehouseInSupplier
          warehouseDefault={warehouseDefault}
          isLoadingWarehouse={isLoadingWarehouseDefault}
          onClick={onAddWarehouse}
          value={get(bill, "warehouseId")}
          onCancel = {onCloseModalWarehouse}
        />
      </ModalAnt>
    </CreateOrderSupplier.Provider>
  );
}

const useCreateOrderSupplierStore = (): GlobalCreateOrderSupplier => useContext(CreateOrderSupplier);

export default useCreateOrderSupplierStore;
