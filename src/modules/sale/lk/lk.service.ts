import { get } from "lodash";

export const getValueOfLk = (record: any) => {
  let value = 0;
  const isValue = get(record, "discount.valueType") === "VALUE";
  const gte = get(record, "discount.gte", 1);
  const applyVariantId = get(record, "discount.applyVariantId");
  if (isValue) {
    value = get(record, "discount.value");
  } else {
    // TODO: IF have applyVariantId will get Price of variant * gte to get TotalPrice
    if (!applyVariantId) {
      value = (get(record, "discount.value", 1) * gte) / 100;
    } else {
      const totalGteOfVariant = get(record, "variant.price", 1) * gte;
      value = (get(record, "discount.value", 1) * totalGteOfVariant) / 100;
    }
  }
  return value;
};
