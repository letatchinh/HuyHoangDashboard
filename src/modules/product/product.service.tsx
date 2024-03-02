import { Button, notification } from "antd";
import { UploadFile } from "antd/lib/index";
import { compact, differenceBy, get } from "lodash";
import { v4 } from "uuid";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { FieldTypeFormProduct, variantType } from "./product.modal";
type paramsConvert = {
    values: FieldTypeFormProduct,
    supplierId : string | undefined
};

type InitImages = {
  uid : string,
  url : string
}
export class AdapterUploadImagesAnt {
  convertSubmit(images : UploadFile[]) : string[]{
    return compact(images?.map((image : UploadFile) => get(image,'url','')));
  }
  convertInit(images: string[]) : InitImages[]{
    return images?.map((image:string) => ({
      uid : v4(),
      url : image
    }))
  }
}
export const convertSubmitData = ({values,supplierId} :paramsConvert) => {
  const ImagesUploadMethod = new AdapterUploadImagesAnt();
      // Convert Submit Images
      const images = ImagesUploadMethod.convertSubmit(get(values,'images',[]))
      const submitData = {
        ...values,
        cumulativeDiscount : CumulativeDiscountModule.service.convertSubmitDiscount(get(values,'cumulativeDiscount'),get(values,'variants',[])),
        supplierId,
        images,
      };

      return submitData;
}


export const convertInitProduct = (product : any) => {
  const ImagesUploadMethod = new AdapterUploadImagesAnt();
  // Convert CumulativeDiscount
  const cumulativeDiscount = CumulativeDiscountModule.service.convertInitDiscount(get(product,'cumulativeDiscount',[]),get(product,'variants',[]));
  
  // Convert Images
  const images = ImagesUploadMethod.convertInit(get(product,'images',[]))
  return {
    ...product,
    cumulativeDiscount,
    images,
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

