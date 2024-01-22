import { get } from "lodash"

/**
 * Convert an object received from API to the internal object that can work with Antd Form.
 *
 * @param {*} instance
 * @return {*} 
 */
const fromJSON = (instance: any) => {
  return {
    ...instance,
    groups: instance?.groups?.map((id: string) => id),
    managementArea: get(instance, "managementArea")?.map((item: any) => {
      return {
        value: get(item, "path"),
        label: get(item, "fullAddress"),
      }
    })
  }
}

/**
 * Convert an internal object to the format of API.
 *
 * @param {*} instance
 * @return {*} 
 */
const toJSON = (instance: any) => {
  return {
    ...instance,
    managementArea: get(instance, "managementArea")?.map((item: any) => {
      return {
        path: get(item, "value"),
        fullAddress: get(item, "label"),
      }
    })
  }
}

export {
  fromJSON,
  toJSON,
}
