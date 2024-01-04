import React from 'react'

interface Props {
    id?: any
    callBack:()=>void
}
interface FieldType {
  code: string
  key: string
  name: string
  isAction:String
}
const ManufacturerForm:React.FC<Props>=({id,callBack})=>{
  return (
    <div>ManufacturerForm</div>
  )
}
export default ManufacturerForm