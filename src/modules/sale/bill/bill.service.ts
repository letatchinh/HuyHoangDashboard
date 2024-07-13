import { compact, forIn, get, keys, max, min, unset } from "lodash";
import { v4, validate } from "uuid";
import {
  DataSourceType,
  ItemDataSource,
  keyValidDataSource,
  KEY_DATA_PHARMACY,
  KEY_PRIORITY,
} from "~/pages/Dashboard/Bill/CreateBill";
import { cumulativeDiscountType } from "../../cumulativeDiscount/cumulativeDiscount.modal";
import apis from "./bill.api";
import { DetailCoupon, DiscountOtherType, quotation } from "./bill.modal";
import { DataItem } from "./storeContext/CreateBillContext";
import CumulativeDiscountModule from "~/modules/cumulativeDiscount";
import { variantType } from "~/modules/product/product.modal";
import { TYPE_REWARD } from "~/modules/cumulativeDiscount/constants";
import { INFINITY } from "~/constants/defaultValue";
import { getValueOfMath } from "~/utils/helpers";
import { CouponInSelect, VerifyCoupon } from "~/modules/coupon/coupon.modal";
import apisCoupon from "~/modules/coupon/coupon.api";
const TYPE_DISCOUNT: any = CumulativeDiscountModule.constants.TYPE_DISCOUNT;
const TARGET: any = CumulativeDiscountModule.constants.TARGET;
export const selectProductSearchBill = (data: any) => {
  const {
    name,
    cumulativeDiscount,
    _id: productId,
    variants,
    supplierId,
    selectVariant,
    quantity,
    codeBySupplier,
    images,
    discountOther,
  } = data;
  const variant = variants?.find(
    (item: any) => get(item, "_id") === selectVariant
  );
  const submitData = {
    name,
    cumulativeDiscount, // Fixme
    productId,
    variantId: get(variant, "_id"),
    quantity: quantity ?? 1,
    exchangeValue: get(variant, "exchangeValue", 1),
    price: get(variant, "price", 0),
    supplierId,
    codeBySupplier,
    variant,
    variants,
    images,
    discountOther,
  };
  return submitData;
};

type paramsGetDiscount = {
  pharmacyId: string;
  quotationItems: quotation[];
};

export const getCumulativeDiscount = async ({
  pharmacyId,
  quotationItems,
}: paramsGetDiscount) => {
  let payloadSubmit: any = {};
  let productIds: any = {};
  quotationItems?.forEach((item) => {
    productIds[get(item, "productId")] = {
      supplierId: get(item, "supplierId"),
      variantId: get(item, "variantId"),
    };
  });
  payloadSubmit[pharmacyId] = { ...productIds };
  const cumulativeDiscount = await apis.getDiscount(payloadSubmit);
  return cumulativeDiscount;
};

type paramsOnVerify = {
  bill: any;
  onChangeBill: (key: string, data: any) => void;
  keyActive: string;
  callback?: (newData?: any) => void;
};
export const onVerifyData = ({
  bill,
  onChangeBill,
  keyActive,
  callback,
}: paramsOnVerify) => {
  if (get(bill, "pharmacyId")) {
    const billSample: { productId: string; variantId: string }[] = get(
      bill,
      "quotationItems",
      []
    )?.map((item: any) => ({
      productId: get(item, "productId"),
      variantId: get(item, "variantId"),
    }));
    const verify = async () => {
      try {
        // Get Variants
        const response = await apis.verifyBill({ billSample,pharmacyId : get(bill, "pharmacyId") });
        const InheritItem = get(bill, "quotationItems", [])?.map(
          (item: any) => {
            const findInResponse = response?.find(
              (res: any) => get(item, "variantId") === get(res, "selectVariant")
            );
            // Inherit Quantity From Old Data
            if (findInResponse) {
              return {
                ...findInResponse,
                quantity: get(item, "quantity", 1),
                discountOther: get(item, "discountOther", []),
                // Inherit More here
              };
            } else {
              return null;
            }
          }
        );
        let items: any = compact(InheritItem)?.map((quotation: any) => {
          const dataSearch = selectProductSearchBill(quotation);

          return {
            ...dataSearch,
            key: v4(),
          };
        });
        // Validate Discount
        const cumulativeDiscount = await getCumulativeDiscount({
          quotationItems: items,
          pharmacyId: get(bill, "pharmacyId"),
        });
        const newItems = items?.map((item: any) => ({
          ...item,
          cumulativeDiscount:
            cumulativeDiscount?.[get(item, "productId")] ?? [],
        }));
        onChangeBill(keyActive, {
          pharmacyId: get(bill, "pharmacyId"),
          quotationItems: newItems,
        });
        if (callback && typeof callback === "function") {
          callback({
            [keyActive]: {
              pharmacyId: get(bill, "pharmacyId"),
              quotationItems: newItems,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    verify();
  }
};

export class CalculateDiscountFactory {
  getDiscountAmount(discount: cumulativeDiscountType, price: number) {
    const TYPE_VALUE = {
      VALUE: "VALUE",
      PERCENT: "PERCENT",
    };
    const { value, valueType } = discount;
    const discountAmount =
      valueType === TYPE_VALUE.PERCENT ? (value * price) / 100 : value;
    return Math.floor(discountAmount);
  }
  getMinTimesRewardWithCondition(
    discount: cumulativeDiscountType,
    price: number,
    quantity: number,
    variant?: variantType | any
  ) {
    const { timesReward, condition, applyVariantId } = discount;
    let so_lan_dat_duoc = 0;
    if (applyVariantId) {
      const actualQuantity = get(variant, "exchangeValue", 1) * quantity;
      so_lan_dat_duoc =
        !get(condition, "lte") || actualQuantity <= get(condition, "lte", 0)
          ? Math.floor(actualQuantity / get(condition, "gte", 1))
          : 0;
    } else {
      const totalPrice = Math.floor(price * quantity);
      so_lan_dat_duoc =
        !get(condition, "lte") || totalPrice <= get(condition, "lte", 0)
          ? Math.floor(totalPrice / get(condition, "gte", 1))
          : 0;
    }
    const minRewardSoftCondition: any = min([so_lan_dat_duoc, timesReward]);
    return minRewardSoftCondition;
  }
  getDiscountBase(
    discount: cumulativeDiscountType,
    price: number,
    quantity: number,
    variant?: variantType | any
  ) {
    let totalDiscount = 0;
    const {
      typeDiscount,
      timesReward,
      valueType
    } = discount;
    switch (typeDiscount) {
      case "DISCOUNT.CORE":
      case "DISCOUNT.SOFT":
        // Percent Alway Get Many Times
        const minReward: any = min([quantity, valueType === 'PERCENT'? INFINITY : timesReward]);
        totalDiscount =
          this.getDiscountAmount(discount, price) * (minReward || 1);
        break;
      case "LK":
        // LK Not Calculate
        totalDiscount = 0;
        break;
      case "DISCOUNT.SOFT.CONDITION":
        // Must Check Condition
        const minRewardSoftCondition: any = this.getMinTimesRewardWithCondition(
          discount,
          price,
          quantity,
          variant
        );
        totalDiscount =
          this.getDiscountAmount(discount, price) *
          (minRewardSoftCondition || 0);

        break;
      default:
        break;
    }
    return totalDiscount;
  }
  getProductReward(
    discount: cumulativeDiscountType,
    price: number,
    quantity: number,
    variant?: variantType | any
  ) {
    const {itemReward} = discount;
    const minRewardSoftCondition: any = this.getMinTimesRewardWithCondition(
      discount,
      price,
      quantity,
      variant
    );
    const quantityClamp =
      minRewardSoftCondition * get(itemReward, "quantity", 0);
    return quantityClamp;
  }
  totalDiscountOther(price : any,value : any,typeDiscount : any,quantity : any){
    return getValueOfMath(price,value,typeDiscount) * quantity
  }
}

export const reducerDiscountQuotationItems = (quotationItems: any[],couponSelected : DetailCoupon) => {
  const CalculateDiscountMethod = new CalculateDiscountFactory();
  const newQuotationItems: any[] = quotationItems?.map(
    (quotation: DataItem) => {
      const { variant } = quotation || {};
      const quantityActual: number = Number(
        (
          get(quotation, "quantity", 1) /
          get(quotation, "variant.exchangeValue", 1)
        ).toFixed(1)
      );
      const cumulativeDiscount = get(quotation, "cumulativeDiscount", [])?.map(
        (discount: any) => {
          const discountAmount = CalculateDiscountMethod.getDiscountBase(
            discount,
            get(quotation, "variant.price", 1),
            quantityActual,
            variant
          );
          let itemReward = null;
          if (get(discount, "typeReward") === TYPE_REWARD.PRODUCT) {
            const quantityClampReward =
              CalculateDiscountMethod.getProductReward(
                discount,
                get(quotation, "variant.price", 1),
                quantityActual,
                variant
              );
            itemReward = {
              ...get(discount, "itemReward"),
              quantityClampReward,
            };
          }

          return {
            ...discount,
            discountAmount,
            ...(itemReward && { itemReward }),
          };
        }
      );
      const totalDiscountDetailFromProduct = cumulativeDiscount?.reduce(
        (sum: any, cur: cumulativeDiscountType) => {
          return get(cur, "target") === TARGET.product
            ? {
                ...sum,
                [get(cur, "typeDiscount")]:
                  sum[get(cur, "typeDiscount")] + get(cur, "discountAmount", 0),
              }
            : sum;
        },
        {
          [TYPE_DISCOUNT["DISCOUNT.CORE"]]: 0,
          [TYPE_DISCOUNT["DISCOUNT.SOFT"]]: 0,
          [TYPE_DISCOUNT.LK]: 0,
        }
      );
      const totalDiscountDetailFromSupplier = cumulativeDiscount?.reduce(
        (sum: any, cur: cumulativeDiscountType) => {
          return get(cur, "target") === TARGET.supplier
            ? {
                ...sum,
                [get(cur, "typeDiscount")]:
                  sum[get(cur, "typeDiscount")] + get(cur, "discountAmount", 0),
              }
            : sum;
        },
        {
          [TYPE_DISCOUNT["DISCOUNT.CORE"]]: 0,
          [TYPE_DISCOUNT["DISCOUNT.SOFT"]]: 0,
          [TYPE_DISCOUNT.LK]: 0,
        }
      );

      const totalDiscount = cumulativeDiscount?.reduce(
        (sum: number, cur: cumulativeDiscountType) =>
          sum + get(cur, "discountAmount", 0),
        0
      );

      const totalDiscountOther = (quotation?.discountOther || [])?.reduce(
        (sum: number, cur: DiscountOtherType) =>
          sum + CalculateDiscountMethod.totalDiscountOther(get(quotation, "variant.price", 1),cur?.value,cur?.typeDiscount,quantityActual),
        0
      );
      const totalRoot = get(quotation, "variant.price", 1) * quantityActual;
      const cp = couponSelected?.item.filter((coupon) => coupon?.couponAtVariantId === quotation?.variantId);

      const couponsInItem = cp?.map((item : CouponInSelect) => {
        const {type,value,maxDiscount} = item?.discount;
        
        return ({
          ...item,
          totalCoupon : getValueOfMath(totalRoot,value,type,maxDiscount)
        })
      });
      const totalDiscountCoupon = couponsInItem?.reduce((sum:number,cur : CouponInSelect) => sum + get(cur,'totalCoupon',0),0);
      const totalDiscountSummary = totalDiscount + totalDiscountOther;
      const totalPrice = totalRoot - totalDiscountSummary - totalDiscountCoupon;
      return {
        ...quotation,
        cumulativeDiscount,
        totalDiscount,
        totalDiscountOther,
        totalPrice: totalPrice > 0 ? totalPrice : 0,
        totalDiscountDetailFromProduct,
        totalDiscountDetailFromSupplier,
        exchangeValue: get(quotation, "variant.exchangeValue", 1),
        price: get(quotation, "variant.price", 1),
        quantityActual,
        totalRoot,
        totalDiscountCoupon,
        couponsInItem,
        totalDiscountSummary,
      };
    }
  );

  return newQuotationItems;
};

export const validateDataStorageREINS = (
  dataFromLocalStorage: any
): boolean => {
  if (
    dataFromLocalStorage === null ||
    !dataFromLocalStorage ||
    Object.keys(dataFromLocalStorage).length === 0 ||
    dataFromLocalStorage === "{}" ||
    dataFromLocalStorage === "undefined" ||
    dataFromLocalStorage === "null" ||
    dataFromLocalStorage === ""
  )
    return true;

  // Validate the Key of item BillDatSource
  const toJson = JSON.parse(dataFromLocalStorage);
  const isInvalid = keys(toJson).some((key: string) => {
    if (validate(key)) {
      const value = toJson[key];
      // Check key important must be Have
      const isValidKeyImportant = value.hasOwnProperty("typeTab");
      if (!isValidKeyImportant) return true;

      // Check key is must include keyValidDataSource
      return keys(value)?.some(
        (keyItem: string) => !keyValidDataSource.includes(keyItem)
      );
    } else {
      return true;
    }
  });
  return isInvalid;
};

// Controller LocalStorage

const onAddLocalStorage = (newDataSource: DataSourceType) => {
  const dataSourceStorage: any = localStorage.getItem(KEY_DATA_PHARMACY);
  const isInValidDataSource = validateDataStorageREINS(dataSourceStorage);
  if (isInValidDataSource) {
    localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(newDataSource));
  } else {
    const dataSource = JSON.parse(dataSourceStorage);
    localStorage.setItem(
      KEY_DATA_PHARMACY,
      JSON.stringify({
        ...dataSource,
        ...newDataSource,
      })
    );
  }
};

const onUseKeyPriority = (key: string) => {
  localStorage.setItem(KEY_PRIORITY, JSON.stringify(key));
};
const onRemoveLocalStorage = (key: any) => {
  const dataFromLocalStorage = localStorage.getItem(KEY_DATA_PHARMACY) || "";
  const dataParse = JSON.parse(dataFromLocalStorage) || {};
  if (dataParse.hasOwnProperty(key)) {
    unset(dataParse, key);
  }
  localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(dataParse));
};

export const addDataToSaleScreen = (data: ItemDataSource) => {
  console.log(data,'data');
  const newKey: string = v4();
  const newDataSource: DataSourceType = {
    [newKey]: data,
  };
  onAddLocalStorage(newDataSource); // Add new DataSource
  onUseKeyPriority(newKey); // use priority key to active Tab
};

export const onConvertInitQuantity = (newDataSource: DataSourceType) => {
  // Clone
  const cloneNewDataSource: DataSourceType = { ...newDataSource };

  // Processing Here
  forIn(newDataSource, (value, key: any) => {
    const quotationItems = get(value, "quotationItems", [])?.map(
      (item: any) => ({
        ...item,
        // quantity : Number((get(value,'quantity',1) / get(value,'exchangeValue',1)).toFixed(1)),
        quantity: get(value, "quantity", 1),
      })
    );
    cloneNewDataSource[key] = {
      ...newDataSource[key],
      quotationItems,
    };
  });

  // Return
  return cloneNewDataSource;
};

export class CalculateBill {
  remainAmount (payload : any){
    return get(payload,'totalPrice',0) - get(payload,'totalReceiptVoucherCompleted',0);
  }
}

export const setCouponToBillItem = ({quotationItems,couponSelected} : {quotationItems : DataItem[],couponSelected : CouponInSelect[]}) => {
  const mergeCouponWithItem = quotationItems?.map((quotation : DataItem) => ({
    ...quotation,
    couponsInItem: couponSelected?.filter((coupon) => coupon?.couponAtVariantId === quotation?.variantId),
    
  }));
  return mergeCouponWithItem;
  
};

export const validateCoupon = async (payload : VerifyCoupon,setCoupon : (p?:any) => void) => {
  try {
    const validCoupon = await apisCoupon.verify(payload);
    setCoupon(validCoupon);
    const isDiff = ((validCoupon?.bill?.length !== payload?.coupons?.bill?.length) || (validCoupon?.ship?.length !== payload?.coupons?.ship?.length) || (validCoupon?.item?.length !== payload?.coupons?.item?.length));
    return isDiff;
  } catch (error) {
    console.log(error,'error');
  }
}