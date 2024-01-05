import { Button, Form, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect } from 'react'
import { useUpdateManufacturer,useCreateManufacturer } from '../manufacturer.hook'

interface Props {
    id?: any
    callBack:()=>void
}
interface FieldType {
  code: string
  key: string
  name: string
  description: string
  isAction:String
}
const ManufacturerForm:React.FC<Props>=({id,callBack})=>{
    const [,updateManufacturer] = useUpdateManufacturer(callBack)
    const [,createManufacturer] = useCreateManufacturer()
  const [form]=Form.useForm<FieldType>()
  useEffect(() => {
    if(id){

    }
  }, []);
  const onFinish = (values: FieldType) => {
    const data: FieldType = {
     ...values,
     };
     if (id) {
       updateManufacturer({ data, id });
     } else {
       createManufacturer({ ...data });
     }
     // updateProductConfig({ data, id });
     console.log(data);
 };

  return (
    <>
      <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 800 }}
        form={form}
        onFinish={onFinish}

      >
        {/* <Form.Item<FieldType> label="Mã " name="code">
          <Input disabled />
        </Form.Item> */}
        <Form.Item<FieldType> label="Tên nhà cung cấp" name="name">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Mô tả" name="description">
          <TextArea rows={4}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default ManufacturerForm