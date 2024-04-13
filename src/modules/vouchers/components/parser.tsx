import { get } from "lodash";

import { WH_VOUCHER_CODE_PREFIX } from "~/constants/defaultValue";

/**
 * Convert an object received from API to the internal object that can work with Antd Form.
 *
 * @param {*} instance
 * @return {*} 
 */
const fromJSON = (instance: any) => {
  return {
    ...instance,
    id: get(instance, "_id") || get(instance, "id"),
    // accountingDate: moment(get(instance, "accountingDate"), "YYYY-MM-DD"),
    // dateOfIssue: moment(get(instance, "dateOfIssue"), "YYYY-MM-DD"),
    // originalDocument: Number(get(instance, "originalDocument")),
    issueNumber: get(instance, "issueNumber") || `${WH_VOUCHER_CODE_PREFIX}${get(instance, "typeVoucher")}`,
  }
}
/**
 * Convert an internal object to the format of API.
 *
 * @param {*} instance
 * @return {*} 
 */
const toJSON = (instance: any)  => {
  return {
    ...instance,
    customerNumber: get(instance, "customerNumber.value") || get(instance, "customerNumber"),
    // customerId: get(instance, "customerNumber.value") || get(instance, "customerId"),
    employeeId: get(instance, "employeeId.value") || get(instance, "employeeId"),
    accountingDate: get(instance, "accountingDate")?.format("YYYY-MM-DD"),
    dateOfIssue: get(instance, "dateOfIssue")?.format("YYYY-MM-DD"),
    originalDocument: get(instance, "originalDocument") || 0,
  }
}

export {
  fromJSON,
  toJSON,
}
