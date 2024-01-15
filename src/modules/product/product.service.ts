import dayjs from "dayjs";
import { get, pick } from "lodash";
import { TYPE_DISCOUNT, TYPE_REWARD } from "./constants";
import { cumulativeDiscountType, FieldTypeFormProduct } from "./product.modal";
type paramsConvert = {
    values: FieldTypeFormProduct,
    supplierId : string | undefined
};

export const convertSubmitDiscount = (cumulativeDiscount : cumulativeDiscountType[]) => {
  const newCumulativeDiscount = cumulativeDiscount?.map(
    (item: cumulativeDiscountType) => {
      const { typeDiscount } = item;
      switch (typeDiscount) {
        case TYPE_DISCOUNT.LK:
          const applyTimeSheet = get(item, "applyTimeSheet");
          const newItem = {
            ...item,
            applyTimeSheet: {
              ...applyTimeSheet,
              gte: dayjs.isDayjs(get(applyTimeSheet, "gte"))
                ? dayjs(get(applyTimeSheet, "gte")).format("YYYY-MM-DD")
                : null,
              lte: dayjs.isDayjs(get(applyTimeSheet, "lte"))
                ? dayjs(get(applyTimeSheet, "lte")).format("YYYY-MM-DD")
                : null,
                isRepeat : get(applyTimeSheet, "isRepeat") ?? false
            },
          };
          return pickLK(newItem);
        case TYPE_DISCOUNT["DISCOUNT.CORE"]:
          return pickCore(item);
        case TYPE_DISCOUNT["DISCOUNT.SOFT"]:
          return pickSoft(item);
        default:
          return item;
      }
    }
  );
  return newCumulativeDiscount;
}
export const convertSubmitData = ({values,supplierId} :paramsConvert) => {
      const submitData = {
        ...values,
        cumulativeDiscount : convertSubmitDiscount(get(values,'cumulativeDiscount')),
        supplierId,
      };

      return submitData;
}
export const pickCore = (submitData: any) =>
  pick(submitData, [
    "name",
    "target",
    "targetId",
    "typeDiscount",
    "typeReward",
    "value",
    "valueType",
  ]);

export const pickSoft = (submitData: any) =>
  pick(submitData, [
    "name",
    "target",
    "targetId",
    "typeDiscount",
    "typeReward",
    "value",
    "valueType",
  ]);
export const pickLK = (submitData: any) =>
  pick(submitData, [
    "name",
    "target",
    "targetId",
    "typeDiscount",
    "typeReward",
    "value",
    "valueType",
    "condition",
    "applyTimeSheet",
  ]);

export const convertInitProduct = (product : any) => {
  // Convert CumulativeDiscount
  const cumulativeDiscount = get(product,'cumulativeDiscount',[])?.map((value:any) => {
    // Convert To Dayjs gte and lte
    const applyTimeSheet = get(value,'applyTimeSheet');
    if(applyTimeSheet){
      return {
        ...value,
        applyTimeSheet : {
          ...applyTimeSheet,
          gte : dayjs(get(applyTimeSheet,'gte')),
          lte : dayjs(get(applyTimeSheet,'lte')),
        }
      }
    };
    return value;
  });

  return {
    ...product,
    cumulativeDiscount
  }
  };

  export const onDiscountChange = (newCumulativeDiscount : cumulativeDiscountType[]) => {
    const cumulativeDiscount = newCumulativeDiscount?.map((item: cumulativeDiscountType) => {
      console.log(item,'item');
      const typeDiscount = get(item, "typeDiscount");
      const condition = get(item, "condition");
      const typeReward = get(item, "typeReward");
      const value = get(item, "value");
      if (typeDiscount === TYPE_DISCOUNT.LK) {
        return {
          ...item,
          condition: { ...condition, isRanger: !!get(condition, "lte") },
          value : typeReward === TYPE_REWARD.VALUE ? value : 0,
        };
      } else {
        return {
          ...item,
          typeReward : TYPE_REWARD.VALUE

        };
      }
    });

    return cumulativeDiscount;
  }
