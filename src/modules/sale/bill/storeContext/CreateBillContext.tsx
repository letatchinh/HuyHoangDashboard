import { Form } from "antd";
import { forIn, get } from "lodash";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";
import ModalAnt from "~/components/Antd/ModalAnt";
import { useGetCollaborator } from "~/modules/collaborator/collaborator.hook";
import LogisticForm, {
  ValueApplyBill,
} from "~/modules/logistic/components/LogisticForm";
import { PAYER_OPTION } from "~/modules/logistic/logistic.modal";
import QuotationModule from "~/modules/sale/quotation";
import RadioButtonWarehouseNotFetch from "~/modules/warehouse/components/RadioButtonWarehouseNotFetch";
import {
  findMatchingManagementArea,
  useGetWarehouse,
  useGetWarehouseByBranchLinked
} from "~/modules/warehouse/warehouse.hook";
import useNotificationStore from "~/store/NotificationContext";
import { getValueOfPercent } from "~/utils/helpers";
import { DEFAULT_DEBT_TYPE } from "../../quotation/constants";
import { useGetDebtRule } from "../bill.hook";
import { DebtType, FeeType, quotation } from "../bill.modal";
import { reducerDiscountQuotationItems } from "../bill.service";
import { defaultFee } from "../constants";
const TYPE_DISCOUNT = {
  "DISCOUNT.CORE": "DISCOUNT.CORE",
  "DISCOUNT.SOFT": "DISCOUNT.SOFT",
  LK: "LK",
};

export type DataItem = quotation & {
  key: number;
  name: string;
};
type Bill = {
  quotationItems: DataItem[];
  pharmacyId: string;
  fee?: FeeType[];
  dataTransportUnit?: ValueApplyBill;
  deliveryAddress?: string;
  warehouseId?: number;
  totalPrice: number;
};

type DiscountDetail = {
  ["DISCOUNT.CORE"]: number;
  ["DISCOUNT.SOFT"]: number;
  ["LK"]: number;
};
export type GlobalCreateBill = {
  quotationItems: DataItem[];
  onSave: (newRow: DataItem | any) => void;
  onAdd: (newRow: Omit<DataItem, "key">) => void;
  onRemove: (productId: string) => void;
  form: any;
  onValueChange: (newValue: any, allValues: any) => void;
  totalPrice: number;
  totalQuantity: number;
  totalPriceAfterDiscount: number;
  totalAmount: number;
  totalDiscount: number;
  totalDiscountOther: number;
  totalDiscountFromProduct: DiscountDetail | null;
  totalDiscountFromSupplier: DiscountDetail | null;
  verifyData: (callback?: any) => void;
  onRemoveTab: () => void;
  debt: DebtType[];
  bill: any;
  onOpenModalResult: (data: any) => void;
  onChangeBill: (data: any) => void;
  mutateReValidate: () => void;
  address: any[];
  setAddress: (p: any) => void;
  setFormAndLocalStorage: (newValue: any) => void;
  partner: any;
  setWarehouseId: (p: any) => void;
  warehouseId: number | undefined;
  isOpenModalSelectWarehouse: boolean;
  onOpenModalSelectWarehouse: () => void;
  onCloseModalSelectWarehouse: () => void;
  onOpenFormLogistic: () => void;
  onCloseFormLogistic: () => void;
  checkboxPayment: string | null;
  setCheckboxPayment: (p: string | null) => void;
  onAddLogisticFee: (data: any) => void;
  setPharmacyInfo: (data: any) => void;
  pharmacyInfo: any;
  warehouseInfo: any;
  updateWarehouseInBill: (warehouseId: string) => any;
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
  totalAmount: 0,
  totalDiscount: 0,
  totalDiscountOther: 0,
  totalDiscountFromProduct: null,
  totalDiscountFromSupplier: null,
  verifyData: () => {},
  onRemoveTab: () => {},
  debt: [],
  bill: null,
  onOpenModalResult: () => {},
  mutateReValidate: () => {},
  onChangeBill: () => {},
  address: [],
  setAddress: () => {},
  setFormAndLocalStorage: () => {},
  partner: null,
  setWarehouseId: () => {},
  warehouseId: undefined,
  isOpenModalSelectWarehouse: false,
  onOpenModalSelectWarehouse: () => {},
  onCloseModalSelectWarehouse: () => {},
  onOpenFormLogistic: () => {},
  onCloseFormLogistic: () => {},
  checkboxPayment: null,
  setCheckboxPayment: (p: string | null) => {},
  onAddLogisticFee: () => {},
  setPharmacyInfo: () => {},
  pharmacyInfo: null,
  warehouseInfo: null,
  updateWarehouseInBill: () => {}
});

type CreateBillProviderProps = {
  children: ReactNode;
  bill: Bill;
  onChangeBill: (newObjData: any) => void;
  verifyData: () => void;
  onRemoveTab: () => void;
  onOpenModalResult: (data: any) => void;
};

export function CreateBillProvider({
  children,
  bill,
  onChangeBill,
  verifyData,
  onRemoveTab,
  onOpenModalResult,
}: CreateBillProviderProps): JSX.Element {
  QuotationModule.hook.useResetQuotation();
  const [countReValidate, setCountReValidate] = useState(1);
  const [quotationItems, setQuotationItems] = useState<DataItem[]>([]);
  const [form] = Form.useForm();
  const [debt, isLoadingDebt] = useGetDebtRule();
  const [address, setAddress] = useState([]);
  const [warehouseId, setWarehouseId] = useState<number | undefined>();
  const [partner, loadingPartner]: any = useGetCollaborator(
    get(bill, "pharmacyId")
  );
  const [logisticOpen, setLogisticOpen] = useState(false);
  const [checkboxPayment, setCheckboxPayment] = useState<string | null>(null);
  const { onNotify } = useNotificationStore();
  const [pharmacyInfo, setPharmacyInfo] = useState<any>();
  const [warehouseDefault, isLoading] = useGetWarehouse(); //Fetch warehouse default by area
  const [listWarehouse, isLoadingWarehouse] = useGetWarehouseByBranchLinked(); // Get all warehouse linked with branch
  const warehouseInfo = useMemo(() => (listWarehouse || [])?.find((item: any) => item._id === bill?.warehouseId), [bill?.warehouseId, listWarehouse]);
  // Controller Data
  const onSave = (row: DataItem) => {
    const newData: DataItem[] = [...quotationItems];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    const computedRow = {
      ...row,
    };
    const newItemData = {
      ...item,
      ...computedRow,
      quantity: Number(
        (
          get(row, "quantityActual", 1) * get(row, "variant.exchangeValue", 1)
        ).toFixed(1)
      ),
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

  // Trigger ReValidation Bill Sample and discount
  const mutateReValidate = useCallback(() => {
    setCountReValidate(countReValidate + 1);
  }, [countReValidate]);

  useEffect(() => {
    if (countReValidate > 1) {
      verifyData();
    }
  }, [countReValidate]);

  const onValueChange = (value: any, values: any) => {
    const key: any = Object.keys(value)[0];
    switch (key) {
      case "pharmacyId":
        onChangeBill({
          pharmacyId: value[key],
        });
        // Revalidate after change Pharmacy
        mutateReValidate();
        break;

      case "fee":
        // const newFee = values[key]?.map((item:FeeType) => item?.typeValue === 'PERCENT' && item?.value > 100 ? {...item,value : 100} : item);
        const newFee = values[key];
        setFormAndLocalStorage({
          fee: newFee,
        });

        break;

      case "deliveryAddress":
        setFormAndLocalStorage({
          [key]: values[key],
        });
        break;

      case "debtType":
        if (values[key] === "COD") {
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

  const pair = Form.useWatch("pair", form) || 0;
  const fee = Form.useWatch("fee", form) || 0;
  const totalLogisticFeeByPayer: number = useMemo(
    () =>
      bill?.dataTransportUnit?.payer === PAYER_OPTION.SYSTEM
        ? 0
        : bill?.dataTransportUnit?.totalFee ?? 0,
    [bill?.dataTransportUnit, fee]
  );
  const findLogisticInFee = useMemo(
    () => (fee || [])?.find((item: any) => item?.typeFee === "LOGISTIC")?.value,
    [bill?.dataTransportUnit, fee]
  );
  const totalPrice = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) =>
          sum + get(cur, "price") * get(cur, "quantityActual"),
        0
      ),
    [quotationItems]
  ); // Tổng giá trị đơn hàng chưa chiếc khấu

  const totalAmount = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalPrice"),
        0
      ),
    [quotationItems]
  );
  const totalFee = useMemo(
    () =>
      (fee || [])?.reduce(
        (sum: number, cur: FeeType) =>
          sum +
          (cur?.typeValue === "PERCENT"
            ? getValueOfPercent(totalPrice, cur?.value)
            : cur?.value),
        0
      ),
    [fee, totalPrice]
  );

  const totalPriceAfterDiscount = useMemo(
    () =>
      // Change from + totalFee became  + totalLogisticFeeByPayer   + (totalFee - totalLogisticFeeByPayer) because i don't want to change old value
      totalAmount -
      pair +
      totalLogisticFeeByPayer +
      (totalFee - findLogisticInFee),
    [quotationItems, pair, totalFee, totalLogisticFeeByPayer, findLogisticInFee]
  );

  const totalDiscount = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalDiscount"),
        0
      ),
    [quotationItems]
  );

  const totalDiscountOther = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "totalDiscountOther", 0),
        0
      ),
    [quotationItems]
  );

  const totalDiscountFromProduct = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: any, cur: any) => {
          const newSum: any = {};
          forIn(TYPE_DISCOUNT, (value: any, key: any) => {
            newSum[key] =
              sum[key] + get(cur, ["totalDiscountDetailFromProduct", key], 0);
          });
          return newSum;
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
          const newSum: any = {};
          forIn(TYPE_DISCOUNT, (value: any, key: any) => {
            newSum[key] =
              sum[key] + get(cur, ["totalDiscountDetailFromSupplier", key], 0);
          });
          return newSum;
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
        (sum: number, cur: any) => sum + get(cur, "quantityActual", 0),
        0
      ),
    [quotationItems]
  );
  // Initalize Data And Calculate Discount
  useEffect(() => {
    const initDebt = debt?.find(
      (debt: DebtType) => get(debt, "key") === DEFAULT_DEBT_TYPE
    );
    form.setFieldsValue({
      debtType:
        form.getFieldValue("debtType") ||
        get(bill, "debtType") ||
        get(initDebt, "key"),
      pharmacyId: get(bill, "pharmacyId"),
      pair: get(bill, "pair", 0),
      fee: get(bill, "fee", defaultFee),
      deliveryAddress: get(bill, "deliveryAddress"),
    });
    if (get(bill, "pharmacyId")) {
      const newQuotationItems: any[] = reducerDiscountQuotationItems(
        get(bill, "quotationItems", [])
      );
      setQuotationItems(newQuotationItems);
    }
  }, [bill, debt, form, totalPrice]);

  // Init warehouse

  const setFormAndLocalStorage = useCallback((newValue: any) => {
    form.setFieldsValue({
      ...newValue,
    });
    onChangeBill({
      ...newValue,
    });
  }, []);

  //Warehouse
  const [isOpenModalSelectWarehouse, setOpenModalSelectWarehouse] =
    useState(false);
  const onOpenModalSelectWarehouse = () => setOpenModalSelectWarehouse(true);
  const onCloseModalSelectWarehouse = () => setOpenModalSelectWarehouse(false);

  const onOpenFormLogistic = () => {
    setLogisticOpen(true);
  };

  const onCloseFormLogistic = () => {
    setLogisticOpen(false);
  };

  const onAddLogisticFee = (data: any) => {
    if (bill?.quotationItems?.length <= 0) {
      return onNotify?.error(
        "Đơn hàng chưa có sản phẩm nên không thể áp phí vận chuyển"
      );
    }
    try {
      const newBill = {
        ...bill,
        fee: bill?.fee?.map((item: any) =>
          item?.typeFee === "LOGISTIC"
            ? { ...item, value: data?.totalFee }
            : item
        ),
        dataTransportUnit: data,
      };
      onChangeBill(newBill);
      onCloseFormLogistic();
    } catch (error) {
      onNotify?.error("Có lỗi xảy ra khi gắn phí vận chuyển vào đơn hàng");
    }
  };

  const onConfirmWarehouse = (data: any) => {
    const findWarehouse = listWarehouse?.find(
      (item: any) => item?._id === data?.warehouseId
    );
    setFormAndLocalStorage({
      warehouseId: findWarehouse?._id,
      warehouseName: findWarehouse?.name?.vi,
    });
    onCloseModalSelectWarehouse();
  };

  const findWarehouseDefault = (warehouseId: string) => {
    return listWarehouse?.find(
      (item: any) => item?._id === warehouseId
    );
  };
  const updateWarehouseInBill = (warehouseId: string) => {
    const data = findWarehouseDefault(warehouseId);
        setFormAndLocalStorage({
        ...bill,
        warehouseName: data?.name?.vi,
      });
  };
  useEffect(() => {
    if ((pharmacyInfo || partner) && !bill?.warehouseId) {
      const address = get(pharmacyInfo, 'data.addressDelivery', get(pharmacyInfo, 'data.address', ''))
      if (warehouseDefault?.length > 0) {
          const findWarehouseDefault = findMatchingManagementArea(address, (warehouseDefault));
          console.log(
            `Địa chỉ nằm trong khu vực của kho: ${findWarehouseDefault?.name?.vi}`
          );
          // onNotify?.success(`Địa chỉ nằm trong khu vực của kho: ${findWarehouseDefault?.name?.vi}`);
          setFormAndLocalStorage({
            ...bill,
            warehouseId: findWarehouseDefault?.warehouseId,
            warehouseName: findWarehouseDefault?.name?.vi,
          });
          setWarehouseId(findWarehouseDefault?.warehouseId);
        } else {
            setFormAndLocalStorage({
              ...bill,
              warehouseId: listWarehouse[0]?._id,
              warehouseName: listWarehouse[0]?.name?.vi,
            });
          setWarehouseId(warehouseDefault[0]?._id);
          console.log("Địa chỉ không thuộc khu vực kho mặc định nào");
          // onNotify?.warning(`Địa chỉ không thuộc khu vực kho mặc định nào, kho xuất hàng đang được chọn tự động`);
        };   
    };
  }, [warehouseDefault, pharmacyInfo, partner, listWarehouse]);
console.log(bill,'bill')
console.log(pharmacyInfo,'pharmacyInfo')
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
        onOpenModalResult,
        mutateReValidate,
        totalAmount,
        onChangeBill,
        totalDiscountOther,
        address,
        setAddress,
        setFormAndLocalStorage,
        partner,
        setWarehouseId,
        warehouseId,
        isOpenModalSelectWarehouse,
        onOpenModalSelectWarehouse,
        onCloseModalSelectWarehouse,
        onOpenFormLogistic,
        onCloseFormLogistic,
        checkboxPayment,
        setCheckboxPayment,
        onAddLogisticFee,
        setPharmacyInfo,
        pharmacyInfo,
        warehouseInfo,
        updateWarehouseInBill,
      }}
    >
      {children}
      <ModalAnt
        destroyOnClose
        title="Chọn kho xuất hàng"
        open={isOpenModalSelectWarehouse}
        onCancel={onCloseModalSelectWarehouse}
        onOk={onCloseModalSelectWarehouse}
        width={600}
        footer={false}
      >
        <RadioButtonWarehouseNotFetch
          warehouseDefault={warehouseDefault}
          setValue={setWarehouseId}
          value={warehouseId ?? bill?.warehouseId}
          onCancel={onCloseModalSelectWarehouse}
          title="Xác nhận"
          isLoadingWarehouse={isLoading}
          onClick={onConfirmWarehouse}
          updateWarehouseInBill={updateWarehouseInBill}
          // isConfirmChangeLogistic 
          listWarehouseLinked={listWarehouse}
        />
      </ModalAnt>
      <ModalAnt
        title="Chi phí vận chuyển"
        open={logisticOpen}
        onCancel={onCloseFormLogistic}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <LogisticForm
          onCloseFormLogistic={onCloseFormLogistic}
          checkboxPayment={checkboxPayment}
          setCheckboxPayment={setCheckboxPayment}
          bill={bill}
          deliveryAddressId={
            !get(bill, "dataUpdateQuotation")
              ? (get(bill, "deliveryAddressId") ??
                get(pharmacyInfo, "data.address"))
              : get(bill, "deliveryAddressId")
          }
          pharmacy={pharmacyInfo?.data}
          dataTransportUnit={bill?.dataTransportUnit}
          warehouseInfo = {warehouseInfo}
        />
      </ModalAnt>
    </CreateBill.Provider>
  );
}

const useCreateBillStore = (): GlobalCreateBill => useContext(CreateBill);

export default useCreateBillStore;
