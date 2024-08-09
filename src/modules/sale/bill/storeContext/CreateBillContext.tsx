import { Form } from "antd";
import { debounce, forIn, get } from "lodash";
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
import { getValueOfMath, getValueOfMathShip, getValueOfPercent } from "~/utils/helpers";
import { DEFAULT_DEBT_TYPE } from "../../quotation/constants";
import { useCheckRefCollection, useGetDebtRule } from "../bill.hook";
import { DebtType, DetailCoupon, FeeType, quotation } from "../bill.modal";
import { reducerDiscountQuotationItems, setCouponToBillItem, validateCoupon } from "../bill.service";
import { defaultFee } from "../constants";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import SelectCoupon from "~/modules/coupon/components/SelectCoupon";
import { useCouponSelect } from "~/modules/coupon/coupon.hook";
import { CouponInSelect, QuerySearchCoupon } from "~/modules/coupon/coupon.modal";
import SelectCouponBillItem from "~/modules/coupon/components/SelectCouponBillItem";
import { MIN_TOTAL_DISCOUNT_PERCENT } from "~/constants/defaultValue";
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
  canReadLogistic: boolean;
  canReadWarehouse: boolean;
  onOpenCoupon: () => void;
  onCloseCoupon: () => void;
  coupons: any[];
  loadingGetCoupon: boolean;
  onOpenCouponBillItem: (id : string,variantId : string,productGroupId? : string) => void;
  onCloseCouponBillItem: () => void;
  couponsBillItem: any[];
  loadingCouponBillItem: boolean;
  couponSelected: DetailCoupon;
  onChangeCoupleSelect: (p?:any) => void;
  totalDiscountCouponBill: number;
  totalDiscountCouponShip: number;
  queryBillItem : QuerySearchCoupon;
  totalCouponForItem: number;
  onVerifyCoupon : () => void;
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
  updateWarehouseInBill: () => {},

  canReadLogistic: false,
  canReadWarehouse: false,
  onOpenCoupon: () => {},
  couponSelected:{
    bill : [],
    ship : [],
    item : [],
  } ,
  coupons: [],
  loadingGetCoupon: false,
  onChangeCoupleSelect: () => {},
  totalDiscountCouponBill : 0,
  totalDiscountCouponShip : 0,
  onCloseCoupon: () => {},
  onOpenCouponBillItem : () => {},
  onCloseCouponBillItem: () => {},
  couponsBillItem : [],
  loadingCouponBillItem : false,
  queryBillItem : {target : "BILL_ITEM"},
  totalCouponForItem : 0,
  onVerifyCoupon: () => {},
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
  const isInitFirst : any = useRef(false);
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


  const refCollection = useCheckRefCollection(get(pharmacyInfo,'data.type',''));

  const warehouseInfo = useMemo(() => (listWarehouse || [])?.find((item: any) => item._id === bill?.warehouseId), [bill?.warehouseId, listWarehouse]);

  const canReadLogistic = useMatchPolicy(POLICIES.READ_LOGISTIC);
  const canReadWarehouse = useMatchPolicy(POLICIES.READ_WAREHOUSELINK);
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
  const totalRootBill = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) =>
          sum + get(cur, "totalRoot",0),
        0
      ),
    [quotationItems]
  ); // Tổng giá trị gốc đơn hàng 

  const totalPrice = useMemo(
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) =>
          sum + get(cur, "price") * get(cur, "quantityActual"),
        0
      ),
    [quotationItems]
  ); // Tổng giá trị đơn hàng chưa chiết khấu

  const totalAmount = useMemo( // Tổng giá trị đơn hàng đã chiết khấu
    () =>
      quotationItems?.reduce(
        (sum: number, cur: any) => sum + get(cur, "billItem_totalAmount"),
        0
      ),
    [quotationItems]
  );
  
    // Coupon
    const {
      couponSelected,
      coupons,
      loading: loadingGetCoupon,
      onChangeCoupleSelect,
      isOpenCoupon,
      onCloseCoupon,
      onOpenCoupon,
      couponsBillItem,
      isOpenCouponBillItem,
      onCloseCouponBillItem,
      onOpenCouponBillItem,
      loadingCouponBillItem,
      queryBillItem,
      countProduct,
    } = useCouponSelect({bill,refCollection,totalAmount,quotationItems});
    //

  // ------Calculate discount Coupon-------
  const minTotalPrice = useMemo(() => totalAmount * MIN_TOTAL_DISCOUNT_PERCENT / 100,[totalAmount]);
  const maxDiscountCoupon = useMemo(() => totalAmount - minTotalPrice,[minTotalPrice,totalAmount])
  
  const totalCouponForItem = useMemo(() => quotationItems?.reduce((sum:number,cur : any) => sum + get(cur,'totalDiscountCoupon',0),0),[quotationItems]);
  
  const totalDiscountCouponBill = useMemo(() => {
    const totalDiscount = couponSelected?.bill.reduce((sum: number, cur: CouponInSelect) => {
      const {type,value,maxDiscount} = cur?.discount;
      return sum + getValueOfMath(totalAmount,value,type,maxDiscount)
    },0);
    return Math.min(totalDiscount,maxDiscountCoupon);    
      
  },[couponSelected,totalAmount,maxDiscountCoupon]);

  const totalDiscountCouponShip = useMemo(() => {
    const totalDiscount = couponSelected?.ship.reduce((sum: number, cur: CouponInSelect) => {
      const {type,value,maxDiscount} = cur?.discount || {};
      return sum + getValueOfMathShip(cur?.isFreeShip || false,findLogisticInFee,value,type,maxDiscount)
    },0);
    return Math.min(totalDiscount,findLogisticInFee);    
      
  },[couponSelected,findLogisticInFee]);
  // ------End Calculate discount Coupon-------


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
      (totalAmount + (totalFee - findLogisticInFee) - totalDiscountCouponBill) || 0, // Not count fee logistic
    [quotationItems, totalFee,totalDiscountCouponBill,findLogisticInFee]
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
  const totalWeight = useMemo(() => bill?.quotationItems?.length > 1 ? bill?.quotationItems?.reduce((sum: any, cur: any) => {
    return sum?.variant?.weight + get(cur, "variant.weight", 0)
  }) : get(bill?.quotationItems?.[0]?.variant, 'weight'), [bill]);
  // Initalize Data And Calculate Discount

  useEffect(() => {
    const initDebt = debt?.find(
      (debt: DebtType) => get(debt, "key") === DEFAULT_DEBT_TYPE
    );
    if(!isInitFirst.current){
      const couponInit = get(bill,'coupons');
      couponInit && onChangeCoupleSelect(couponInit);
      isInitFirst.current = true;
    }
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
      // Handle Convert Quotation Here
      const newQuotationItems: any[] = reducerDiscountQuotationItems(
        get(bill, "quotationItems", []),
        couponSelected
      );
      
      setQuotationItems(newQuotationItems);
    }
  }, [bill, debt, form, totalPrice,couponSelected]);

  // Verify coupon
  const onVerifyCoupon = async() => {
    return await validateCoupon({
      billPrice : totalAmount,
      coupons : couponSelected,
      productCount : countProduct,
      isValidateCount : get(bill, "typeTab") === "createQuotation",
      customerApplyId : {
        refCollection : refCollection as any,
        id : get(bill, "pharmacyId")
      }
    },
    onChangeCoupleSelect
    )
  }


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
      onChangeBill({
        fee: bill?.fee?.map((item: any) =>
          item?.typeFee === "LOGISTIC"
            ? { ...item, value: data?.totalFee }
            : item
        ),
        dataTransportUnit: data,
      });
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
      ...bill,
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
      const address = get(pharmacyInfo, 'data.addressDelivery', get(pharmacyInfo, 'data.address', get(partner, 'address', [])));
      if (warehouseDefault?.length > 0) {
        const findWarehouseDefault = findMatchingManagementArea(address, (warehouseDefault));
          if (findWarehouseDefault) {
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
              ...(bill && bill),
              warehouseId: listWarehouse[0]?._id,
              warehouseName: listWarehouse[0]?.name?.vi,
            });
          setWarehouseId(warehouseDefault[0]?._id);
          console.log("Địa chỉ không thuộc khu vực kho mặc định nào");
          };
        } else {
            setFormAndLocalStorage({
              ...(bill && bill),
              warehouseId: listWarehouse[0]?._id,
              warehouseName: listWarehouse[0]?.name?.vi,
            });
          setWarehouseId(warehouseDefault[0]?._id);
          console.log("Địa chỉ không thuộc khu vực kho mặc định nào");
          // onNotify?.warning(`Địa chỉ không thuộc khu vực kho mặc định nào, kho xuất hàng đang được chọn tự động`);
        };   
    };
  }, [warehouseDefault, pharmacyInfo, partner, listWarehouse]);
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
        canReadLogistic,
        canReadWarehouse,
        onOpenCoupon,
        couponSelected,
        coupons,
        loadingGetCoupon,
        onChangeCoupleSelect,
        totalDiscountCouponBill,
        totalDiscountCouponShip,
        onCloseCoupon,
        onOpenCouponBillItem,
        onCloseCouponBillItem,
        loadingCouponBillItem,
        couponsBillItem,
        queryBillItem,
        totalCouponForItem,
        onVerifyCoupon,
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
              ? get(bill, "deliveryAddressId") ??
                get(pharmacyInfo, "data.address")
              : get(bill, "deliveryAddressId")
          }
          pharmacy={pharmacyInfo?.data}
          dataTransportUnit={bill?.dataTransportUnit}
          warehouseInfo={warehouseInfo}
        />
      </ModalAnt>
      <ModalAnt
        title="Chọn giảm giá"
        open={isOpenCoupon}
        onCancel={onCloseCoupon}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <SelectCoupon />
      </ModalAnt>
      <ModalAnt
        title="Chọn giảm giá"
        open={isOpenCouponBillItem}
        onCancel={onCloseCouponBillItem}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <SelectCouponBillItem />
      </ModalAnt>
    </CreateBill.Provider>
  );
}

const useCreateBillStore = (): GlobalCreateBill => useContext(CreateBill);

export default useCreateBillStore;
