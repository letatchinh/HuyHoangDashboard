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
        vi : 'Giá trị đơn hàng tối thiểu',
        isActive : false,
    },
    PRODUCT_COUNT : {
        key : "PRODUCT_COUNT",
        value : 0,
        vi : 'Số lượng sản phẩm mua',
        isActive : false,
    },
};
const CLONE_defaultConditions : any =  defaultConditions;
export const conditionKey = keys(defaultConditions).map((k : any) => ({
    label : CLONE_defaultConditions[k].vi,
    value : k
}));
console.log(conditionKey,'conditionKey');