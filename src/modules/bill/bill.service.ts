import { compact, get } from "lodash";
import { v4 } from "uuid";
import { cumulativeDiscountType } from "../cumulativeDiscount/cumulativeDiscount.modal";
import apis from "./bill.api";
import { billItem } from "./bill.modal";
import { DataItem } from "./storeContext/CreateBillContext";

export const selectProductSearch = (data: any) => {
  const {
    name,
    cumulativeDiscount,
    _id: productId,
    variants,
    supplierId,
    selectVariant,
    quantity,
    codeBySupplier,
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
    price: get(variant, "price", 0),
    supplierId,
    codeBySupplier,
  };
  return submitData;
};

type paramsGetDiscount = {
  pharmacyId: string;
  billItems: billItem[];
};

export const getCumulativeDiscount = async ({
  pharmacyId,
  billItems,
}: paramsGetDiscount) => {
  let payloadSubmit: any = {};
  let productIds: any = {};
  billItems?.forEach((item) => {
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
  if (get(bill, "pharmacyId") ) {
    const billSample: { productId: string; variantId: string }[] = get(
      bill,
      "billItems",
      []
    )?.map((item: any) => ({
      productId: get(item, "productId"),
      variantId: get(item, "variantId"),
    }));
    const verify = async () => {
      try {
        const response = await apis.verify({ billSample });
        const concatQuantity = get(bill, "billItems", [])?.map((item: any) => {
          const findInResponse = response?.find(
            (res: any) => get(item, "variantId") === get(res, "selectVariant")
          );
          // Inherit Quantity From Old Data
          if (findInResponse) {
            return {
              ...findInResponse,
              quantity: get(item, "quantity", 1),
              // Inherit More here
            };
          } else {
            return null;
          }
        });

        let items: any = compact(concatQuantity)?.map((billItem: any) => {
          const dataSearch = selectProductSearch(billItem);

          return {
            ...dataSearch,
            key: v4(),
          };
        });
        const cumulativeDiscount = await getCumulativeDiscount({
          billItems: items,
          pharmacyId: get(bill, "pharmacyId"),
        });
        const newItems = items?.map((item: any) => ({
          ...item,
          cumulativeDiscount:
            cumulativeDiscount?.[get(item, "productId")] ?? [],
        }));
        onChangeBill(keyActive, {
          pharmacyId: get(bill, "pharmacyId"),
          billItems: newItems,
        });
        if (callback && typeof callback === "function") {
          callback({
            [keyActive]: {
              pharmacyId: get(bill, "pharmacyId"),
              billItems: newItems,
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

export const getDiscountAmount = (
  discount: cumulativeDiscountType,
  price: number
): number => {
  const TYPE_VALUE = {
    VALUE: "VALUE",
    PERCENT: "PERCENT",
  };
  const { value, valueType } = discount;

  const discountAmount =
    valueType === TYPE_VALUE.PERCENT ? (value * price) / 100 : value;
  return discountAmount;
};

export const reducerDiscountBillItems = (billItems: any[]) => {
  const TYPE_DISCOUNT = {
    "DISCOUNT.CORE": "DISCOUNT.CORE",
    "DISCOUNT.SOFT": "DISCOUNT.SOFT",
    LK: "LK",
  };
  const TARGET = {
    product: "product",
    supplier: "supplier",
  };
  const newBillItems: any[] = billItems?.map((billItem: DataItem) => {
    const cumulativeDiscount = get(billItem, "cumulativeDiscount", [])?.map(
      (discount: any) => {
        const discountAmount = getDiscountAmount(
          discount,
          get(billItem, "price", 1)
        );
        return {
          ...discount,
          discountAmount,
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

    const totalPrice =
      get(billItem, "price", 1) * get(billItem, "quantity", 1) - totalDiscount;
    return {
      ...billItem,
      cumulativeDiscount,
      totalDiscount,
      totalPrice: totalPrice > 0 ? totalPrice : 0,
      totalDiscountDetailFromProduct,
      totalDiscountDetailFromSupplier,
    };
  });

  return newBillItems;
};
