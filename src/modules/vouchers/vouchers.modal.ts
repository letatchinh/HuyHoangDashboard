import { METHOD_TYPE } from "./constants"

export type TypeProps = {
    
}
export type methodType = {
    data : any,
    type : keyof typeof METHOD_TYPE
  }