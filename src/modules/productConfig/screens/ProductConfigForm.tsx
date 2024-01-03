import { Button, Form, Input } from 'antd'
import React, { useEffect } from 'react'
import { useUpdateProductConfig } from '../productConfig.hook';
export default function ProductConfigForm({id}: any, {callBack}: any) {
const [,updateProductConfig] = useUpdateProductConfig(callBack)
const [form] = Form.useForm();
type FieldType = {
  code?: string;
  name?: string;
};
  useEffect(() => {
    if(id){
      const data:Object = {
        // name,
        // code,
      }
      updateProductConfig({data, id});

    }
  }, [id]);
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
  return (
    <>
       <Form
        labelCol={{ span: 8 }}
        // wrapperCol={{ span: 10 }}
        layout="horizontal"
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item<FieldType> label="Mã nhóm danh mục" name="code">
          <Input disabled/>
        </Form.Item>
        <Form.Item<FieldType> label="Tên danh mục" name="name">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>

        </Form>
 
    </>
  )
}
