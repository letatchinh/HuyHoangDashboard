import { Button, notification } from "antd";
import { compact, differenceBy, get } from "lodash";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { FieldTypeFormProduct, variantType } from "./product.modal";
type paramsConvert = {
    values: FieldTypeFormProduct,
    supplierId : string | undefined
};

export const convertSubmitData = ({values,supplierId} :paramsConvert) => {
  
      const submitData = {
        ...values,
        cumulativeDiscount : CumulativeDiscountModule.service.convertSubmitDiscount(get(values,'cumulativeDiscount'),get(values,'variants',[])),
        supplierId,
      };

      return submitData;
}


export const convertInitProduct = (product : any) => {
  
  // Convert CumulativeDiscount
  const cumulativeDiscount = CumulativeDiscountModule.service.convertInitDiscount(get(product,'cumulativeDiscount',[]),get(product,'variants',[]));
  
  return {
    ...product,
    cumulativeDiscount
  }
  };


export const validateChangeVariants = ({cumulativeDiscount,variants,form,setDataNotificationUndo}:{cumulativeDiscount:any[],variants:any[],form:any,setDataNotificationUndo:(data? : any) => void}) => {

  // Filter Have unit and add productUnit to compare Diff cumulativeDiscount and variants
  const listHaveApplyVariantId = cumulativeDiscount?.filter((item:any) => !!get(item,'applyVariantId'))?.map((item:any) => ({...item,productUnit : get(item,'applyVariantId')}));

  const differenceUnit = differenceBy(listHaveApplyVariantId,variants,'productUnit');
  if(differenceUnit?.length){
    const description = `Hệ thống gỡ chiết khấu \n ${compact(differenceUnit?.map((item:any) => get(item,'name')))?.join(',')} \n ra khỏi chiết khấu để vì đã sử dụng đơn vị này!`;
    const listCumulativeRemain = differenceBy(listHaveApplyVariantId,differenceUnit,'productUnit');
    form.setFieldsValue({cumulativeDiscount:listCumulativeRemain});
    // setDataNotificationUndo({
    //   open : true,
    //   description
    // })
  };

}

export const getExchangeValue = (variantId : string | null,variants? : variantType[]) => {
  
  const variant = variants?.find((v:variantType) => get(v,'_id') === variantId);
  return get(variant,'exchangeValue',0)
}

export const getVariants = (variantId : string | null,variants? : variantType[]) => {
  
  const variant = variants?.find((v:variantType) => get(v,'_id') === variantId);
  return variant;
}