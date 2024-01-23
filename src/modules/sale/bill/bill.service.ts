import { compact, forIn, get, unset } from "lodash";
import { v4 } from "uuid";
import { DataSourceType, ItemDataSource, KEY_DATA_PHARMACY, KEY_PRIORITY } from "~/pages/Dashboard/Bill/CreateBill";
import { cumulativeDiscountType } from "../../cumulativeDiscount/cumulativeDiscount.modal";
import apis from "./bill.api";
import { quotation } from "./bill.modal";
import { DataItem } from "./storeContext/CreateBillContext";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
const TYPE_DISCOUNT : any = CumulativeDiscountModule.constants.TYPE_DISCOUNT;
const TARGET : any = CumulativeDiscountModule.constants.TARGET;
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
    exchangeValue : get(variant, "exchangeValue",1),
    price: get(variant, "price", 0),
    supplierId,
    codeBySupplier,
    variant,
    variants,
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
  if (get(bill, "pharmacyId") ) {
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
        const response = await apis.verify({ billSample });
        const concatQuantity = get(bill, "quotationItems", [])?.map((item: any) => {
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
        let items: any = compact(concatQuantity)?.map((quotation: any) => {
          const dataSearch = selectProductSearch(quotation);

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
  return Math.floor(discountAmount);
};

export const reducerDiscountQuotationItems = (quotationItems: any[]) => {
  const newQuotationItems: any[] = quotationItems?.map((quotation: DataItem) => {
    const quantityActual:number = Number((get(quotation, "quantity", 1) / get(quotation, "variant.exchangeValue", 1)).toFixed(1));
    const cumulativeDiscount = get(quotation, "cumulativeDiscount", [])?.map(
      (discount: any) => {
        const discountAmount = getDiscountAmount(
          discount,
          get(quotation, "variant.price", 1) * quantityActual
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
      get(quotation, "variant.price", 1) * quantityActual - totalDiscount;
    return {
      ...quotation,
      cumulativeDiscount,
      totalDiscount,
      totalPrice: totalPrice > 0 ? totalPrice : 0,
      totalDiscountDetailFromProduct,
      totalDiscountDetailFromSupplier,
      exchangeValue : get(quotation,'variant.exchangeValue',1),
      price : get(quotation,'variant.price',1),
      quantityActual,
    };
  });

  return newQuotationItems;
};

export const validateDataStorage = (dataFromLocalStorage : any) : boolean => 
        dataFromLocalStorage === null ||
        !dataFromLocalStorage ||
        Object.keys(dataFromLocalStorage).length === 0 ||
        dataFromLocalStorage === "{}" ||
        dataFromLocalStorage === "undefined" ||
        dataFromLocalStorage === "null" ||
        dataFromLocalStorage === ""


// Controller LocalStorage

const onAddLocalStorage = (newDataSource : DataSourceType) => {
  const dataSourceStorage : any = localStorage.getItem(KEY_DATA_PHARMACY);
  const isInValidDataSource = validateDataStorage(dataSourceStorage);
  if(isInValidDataSource){
    localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(newDataSource));
  }else{
    const dataSource = JSON.parse(dataSourceStorage);
    localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify({
      ...dataSource,
      ...newDataSource
    }));
  };
};

const onUseKeyPriority = (key : string) => {
  localStorage.setItem(KEY_PRIORITY,JSON.stringify(key));
}
const onRemoveLocalStorage = (key: any) => {
  const dataFromLocalStorage = localStorage.getItem(KEY_DATA_PHARMACY) || "";
  const dataParse = JSON.parse(dataFromLocalStorage) || {};
  if (dataParse.hasOwnProperty(key)) {
    unset(dataParse,key)
  }
  localStorage.setItem(KEY_DATA_PHARMACY, JSON.stringify(dataParse));
};

export const addDataToSaleScreen = (data : ItemDataSource) => {
  const newKey : string = v4();
  const newDataSource :DataSourceType = {
    [newKey]: data
  };
  onAddLocalStorage(newDataSource); // Add new DataSource
  onUseKeyPriority(newKey); // use priority key to active Tab
}

export const onConvertInitQuantity = (newDataSource : DataSourceType) => {
  // Clone
  const cloneNewDataSource :DataSourceType = {...newDataSource};

  // Processing Here
  forIn(newDataSource, (value, key : any) => {
    const quotationItems = get(value,'quotationItems',[])?.map((item:any) => ({
      ...item,
      // quantity : Number((get(value,'quantity',1) / get(value,'exchangeValue',1)).toFixed(1)),
      quantity : get(value,'quantity',1),
    }))
    cloneNewDataSource[key] = {
      ...newDataSource[key],
      quotationItems
    }
  });

  // Return
  return cloneNewDataSource;
}