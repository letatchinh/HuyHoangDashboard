import { compact, get, keys, pick } from 'lodash';
import { v4, validate } from 'uuid';
import BillModule from '~/modules/sale/bill';
import { keyValidDataSource } from '~/pages/Dashboard/OrderSupplier/CreateOrderSupplier';
import { TARGET, TYPE_DISCOUNT, TYPE_REWARD } from '../../cumulativeDiscount/constants';
import { cumulativeDiscountType } from '../../cumulativeDiscount/cumulativeDiscount.modal';
import { DEFAULT_DEBT_TYPE } from './constants';
import { FormFieldCreateOrderSupplier, orderSupplier, PayloadCreateOrderSupplier } from './orderSupplier.modal';
export const reducerDiscountOrderSupplierItems = (orderSupplierItems: any[]) => {
    const CalculateDiscountMethod = new BillModule.service.CalculateDiscountFactory();
    const newOrderSupplierItems: any[] = orderSupplierItems?.map(
      (orderSupplier: any) => {
        const { variant } = orderSupplier || {};
  
        const quantityActual: number = Number(
          (
            get(orderSupplier, "quantity", 1) /
            get(orderSupplier, "variant.exchangeValue", 1)
          ).toFixed(1)
        );
        const cumulativeDiscount = get(orderSupplier, "cumulativeDiscount", [])?.map(
          (discount: any) => {
            const discountAmount = CalculateDiscountMethod.getDiscountBase(
              discount,
              get(orderSupplier, "variant.price", 1),
              quantityActual,
              variant
            );
            let itemReward = null;
            if (get(discount, "typeReward") === TYPE_REWARD.PRODUCT) {
              const quantityClampReward =
                CalculateDiscountMethod.getProductReward(
                  discount,
                  get(orderSupplier, "variant.price", 1),
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
  
        const totalPrice =
          get(orderSupplier, "variant.price", 1) * quantityActual - totalDiscount;
        return {
          ...orderSupplier,
          cumulativeDiscount,
          totalDiscount,
          totalPrice: totalPrice > 0 ? totalPrice : 0,
          totalDiscountDetailFromProduct,
          totalDiscountDetailFromSupplier,
          exchangeValue: get(orderSupplier, "variant.exchangeValue", 1),
          price: get(orderSupplier, "variant.price", 1),
          quantityActual,
        };
      }
    );
  
    return newOrderSupplierItems;
  };

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
      exchangeValue: get(variant, "exchangeValue", 1),
      unitPrice: get(variant, "price", 0),
      supplierId,
      codeBySupplier,
      variant,
      variants,
    };
    return submitData;
  };

  type paramsGetDiscount = {
    supplierId: string;
    orderSupplierItems: any[];
  };
  
  export const getCumulativeDiscount = async ({
    supplierId,
    orderSupplierItems,
  }: paramsGetDiscount) => {
    let payloadSubmit: any = {};
    let productIds: any = {};
    orderSupplierItems?.forEach((item) => {
      productIds[get(item, "productId")] = {
        supplierId: get(item, "supplierId"),
        variantId: get(item, "variantId"),
      };
    });
    payloadSubmit[supplierId] = { ...productIds };
    const cumulativeDiscount = await BillModule.api.getDiscount({
      ...payloadSubmit,
      saleType : 'supplier'
    });
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
    if (get(bill, "supplierId")) {
      const billSample: { productId: string; variantId: string }[] = get(
        bill,
        "orderSupplierItems",
        []
      )?.map((item: any) => ({
        productId: get(item, "productId"),
        variantId: get(item, "variantId"),
      }));
      const verify = async () => {
        try {
          // Get Variants
          const response = await BillModule.api.verify({ billSample });
          const concatQuantity = get(bill, "orderSupplierItems", [])?.map(
            (item: any) => {
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
            }
          );
          let items: any = compact(concatQuantity)?.map((orderSupplier: any) => {
            const dataSearch = selectProductSearch(orderSupplier);
  
            return {
              ...dataSearch,
              key: v4(),
            };
          });
  
          // Validate Discount
          const cumulativeDiscount = await getCumulativeDiscount({
            orderSupplierItems: items,
            supplierId: get(bill, "supplierId"),
          });
          const newItems = items?.map((item: any) => ({
            ...item,
            cumulativeDiscount:
              cumulativeDiscount?.[get(item, "productId")] ?? [],
          }));
          onChangeBill(keyActive, {
            supplierId: get(bill, "supplierId"),
            orderSupplierItems: newItems,
          });
          if (callback && typeof callback === "function") {
            callback({
              [keyActive]: {
                supplierId: get(bill, "supplierId"),
                orderSupplierItems: newItems,
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

  type paramsConvertDataOrderSupplier = {
    data : FormFieldCreateOrderSupplier,
    orderSupplierItems : orderSupplier[],
    totalPriceAfterDiscount : number,
    totalAmount : number,
    _id? : string
}
export const convertDataOrderSupplier = ({data,orderSupplierItems,totalPriceAfterDiscount,_id,totalAmount}:paramsConvertDataOrderSupplier) : PayloadCreateOrderSupplier => {
    const orderSupplierItemsSubmit : Omit<orderSupplier,'variant' | 'variants'>[] = orderSupplierItems?.map((orderSupplier : orderSupplier) => ({
        ...pick(orderSupplier,[
          'cumulativeDiscount',
          'productId',
          'variantId',
          'unitPrice',
          'totalPrice',
          'supplierId',
          'lotNumber',
          'expirationDate',
          'codeBySupplier',
          'quantity',
        ]),
      }));
      // Todo : Verify Data When Send to sever (Not implemented)
      
      const submitData : PayloadCreateOrderSupplier = {
          ...data,
          orderSupplierItems : orderSupplierItemsSubmit,
          pair : data?.pair || 0,
          debtType : data?.debtType || DEFAULT_DEBT_TYPE,
          totalPrice : totalPriceAfterDiscount,
          totalAmount,
          ..._id && {_id}
        };
        return submitData;
}

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
