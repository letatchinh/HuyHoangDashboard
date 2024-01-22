import dayjs from "dayjs";
import { get, pick } from "lodash";
import { TYPE_DISCOUNT, TYPE_REWARD } from "./constants";
import { cumulativeDiscountType } from "./cumulativeDiscount.modal";

export const convertSubmitDiscount = (
  cumulativeDiscount: cumulativeDiscountType[]
) => {
  const newCumulativeDiscount = cumulativeDiscount?.map(
    (item: cumulativeDiscountType) => {
      const { typeDiscount } = item;
      switch (typeDiscount) {
        case TYPE_DISCOUNT.LK:
          const applyTimeSheet = get(item, "applyTimeSheet");
          const cumulativeTimeSheet = get(item, "cumulativeTimeSheet");
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
              isRepeat: get(applyTimeSheet, "isRepeat") ?? false,
            },
            cumulativeTimeSheet: {
              ...cumulativeTimeSheet,
              gte: dayjs.isDayjs(get(cumulativeTimeSheet, "gte"))
                ? dayjs(get(cumulativeTimeSheet, "gte")).format("YYYY-MM-DD")
                : null,
              lte: dayjs.isDayjs(get(cumulativeTimeSheet, "lte"))
                ? dayjs(get(cumulativeTimeSheet, "lte")).format("YYYY-MM-DD")
                : null,
              isRepeat: get(cumulativeTimeSheet, "isRepeat") ?? false,
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
};
const rootField = [
  "name",
  "target",
  "targetId",
  "typeDiscount",
  "typeReward",
  "value",
  "valueType",
  "status"
]
export const pickCore = (submitData: any) =>
  pick(submitData, rootField);

export const pickSoft = (submitData: any) =>
  pick(submitData, rootField);
export const pickLK = (submitData: any) =>
  pick(submitData, [
    ...rootField,
    "condition",
    "applyTimeSheet",
    "cumulativeTimeSheet",
  ]);

export const convertInitDiscount = (
  cumulativeDiscount: cumulativeDiscountType[]
) => {
  const newCumulativeDiscount = cumulativeDiscount?.map(
    (value: cumulativeDiscountType) => {
      // Convert To Dayjs gte and lte
      const applyTimeSheet = get(value, "applyTimeSheet");
      const cumulativeTimeSheet = get(value, "cumulativeTimeSheet");
      if (applyTimeSheet) {
        return {
          ...value,
          applyTimeSheet: {
            ...applyTimeSheet,
            gte: dayjs(get(applyTimeSheet, "gte")),
            lte: dayjs(get(applyTimeSheet, "lte")),
          },
          cumulativeTimeSheet: {
            ...cumulativeTimeSheet,
            gte: dayjs(get(cumulativeTimeSheet, "gte")),
            lte: dayjs(get(cumulativeTimeSheet, "lte")),
          },
        };
      }
      return value;
    }
  );
  return newCumulativeDiscount;
};

export const onDiscountChange = (
  newCumulativeDiscount: cumulativeDiscountType[]
) => {
  const cumulativeDiscount = newCumulativeDiscount?.map(
    (item: cumulativeDiscountType) => {
      const typeDiscount = get(item, "typeDiscount");
      const condition = get(item, "condition");
      const typeReward = get(item, "typeReward");
      const value = get(item, "value");
      if (typeDiscount === TYPE_DISCOUNT.LK) {
        return {
          ...item,
          condition: { ...condition, isRanger: !!get(condition, "lte") },
          value: typeReward === TYPE_REWARD.VALUE ? value : 0,
        };
      } else {
        return {
          ...item,
          typeReward: TYPE_REWARD.VALUE,
        };
      }
    }
  );

  return cumulativeDiscount;
};
