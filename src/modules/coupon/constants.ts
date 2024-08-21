import { keys } from "lodash";

export const defaultConditions = {
    BILL_FIRST : {
        key : "BILL_FIRST",
        vi : 'Khách hàng mới',
        isActive : false,
    },
    BILL_PRICE : {
        key : "BILL_PRICE",
        value : 0,
        vi : 'Đơn tối thiểu',
        isActive : false,
    },
    PRODUCT_COUNT : {
        key : "PRODUCT_COUNT",
        value : 0,
        vi : 'Số lượng mua',
        isActive : false,
    },
};
const CLONE_defaultConditions : any =  defaultConditions;
export const conditionKey = keys(defaultConditions).map((k : any) => ({
    label : CLONE_defaultConditions[k].vi,
    value : k
}));
export const STATE = {
    PUBLIC : "PUBLIC",
    PRIVATE : "PRIVATE",
};
export const STATE_VI = {
    PUBLIC : "Công khai",
    PRIVATE : "Nội bộ",
};

export const DEFAULT_COUPON = {
    conditions: [
      {
        key: defaultConditions.BILL_FIRST.key,
        isActive: defaultConditions.BILL_FIRST.isActive,
      },
      {
        key: defaultConditions.BILL_PRICE.key,
        value: {
          [defaultConditions.BILL_PRICE.key]: {
            value: defaultConditions.BILL_PRICE.value,
          },
        },
        isActive: defaultConditions.BILL_PRICE.isActive,
      },
      {
        key: defaultConditions.PRODUCT_COUNT.key,
        value: {
          [defaultConditions.PRODUCT_COUNT.key]: {
            value: defaultConditions.PRODUCT_COUNT.value,
          },
        },
        isActive: defaultConditions.PRODUCT_COUNT.isActive,
      },
    ],
    state: "PUBLIC",
    discount: {
      value: 0,
      type: "PERCENT",
    },
    applyFor: "BILL",
    target: "BILL",
    disabledCondition : true,
    allowAllApply : {
      all : true,
      b2b : true,
      b2c : true,
    }
  }