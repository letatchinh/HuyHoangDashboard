import { compact, get } from "lodash";
import { v4 } from "uuid";
import { cumulativeDiscountType } from "../product/product.modal";
import apis from "./bill.api";
import { billItem } from "./bill.modal";

export const selectProductSearch = (
    data: any,
) => {
  const {
    name,
    cumulativeDiscount,
    _id: productId,
    variants,
    supplierId,
    selectVariant,
    quantity
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
  };
  return submitData;
};

type paramsGetDiscount = {
  pharmacyId : string,
  billItems : billItem[]
};

export const getCumulativeDiscount = async({pharmacyId,billItems}:paramsGetDiscount) => {
  let payloadSubmit : any = {};
  let productIds : any = {};
  billItems?.forEach((item) => {
    productIds[get(item,'productId')] = {
      supplierId : get(item,'supplierId'),
      variantId : get(item,'variantId'),
    }
  });
  payloadSubmit[pharmacyId] = {...productIds};
  const cumulativeDiscount = await apis.getDiscount(payloadSubmit);
  return cumulativeDiscount
}

type paramsOnVerify = {
  bill : any,
  onChangeBill : (key:string,data : any) => void,
  keyActive : string,
  callback? : () => void
}
export const onVerifyData = ({
  bill,
  onChangeBill,
  keyActive,
  callback,
}:paramsOnVerify) => {
  if(get(bill,'pharmacyId') && get(bill,'billItems',[])?.length){
    const billSample : {productId : string,variantId : string}[] = get(bill,'billItems',[])?.map((item : any) => ({
      productId : get(item,'productId'),
      variantId : get(item,'variantId'),
    }));
    const verify = async() => {
      try {
        const response = await apis.verify({billSample});
        
        const concatQuantity =  get(bill,'billItems',[])?.map((item : any) => {
          const findInResponse = response?.find((res:any) => get(item,'variantId') === get(res,'selectVariant'));
          // Inherit Quantity From Old Data
          if(findInResponse){
            return {
              ...findInResponse,
              quantity : get(item,'quantity',1),
              // Inherit More here
            }
          }else{
            return null;
          }
        
        });
        
        let items : any = compact(concatQuantity)?.map((billItem : any) => {
          const dataSearch = selectProductSearch(billItem);

          return {
            ...dataSearch,
            key : v4(),
            time : new Date()
          };
        });
        const cumulativeDiscount = await getCumulativeDiscount({billItems : items,pharmacyId : get(bill,'pharmacyId')});
        const newItems = items?.map((item : any) => ({
          ...item,
          cumulativeDiscount : cumulativeDiscount?.[get(item,'productId')] ?? [],
          
        }));
        onChangeBill(keyActive,{
          pharmacyId : get(bill,'pharmacyId'),
          billItems : newItems
        });
        if(callback && typeof callback === 'function'){
          callback()
        }
      } catch (error) {
        console.log(error);
      }
    }
    verify();
  }
}

export const getDiscountAmount = (discount : cumulativeDiscountType,price : number) : number => {
  const TYPE_VALUE = {
    VALUE : "VALUE",
    PERCENT : "PERCENT",
  };
  const {value,valueType} = discount;

  const discountAmount = valueType === TYPE_VALUE.PERCENT ? value * price / 100 : value;
  return discountAmount
}