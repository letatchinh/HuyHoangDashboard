import { Button, Form, Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect } from 'react'
import { useCreateManufacturer, useGetManufacturerById, useResetAction } from '../manufacturer.hook'

interface Props {
  id?: any
  callBack: () => void
  setId?:any
  setDestroy?:any
  updateManufacturer: (data: any) => void,
};
interface FieldType {
  code: string
  key: string
  name: string
  description: string
  isAction: String
};
const ManufacturerForm: React.FC<Props> = ({ id,setId, callBack, updateManufacturer,setDestroy }) => {
  const [manufacturer, loading] = useGetManufacturerById(id);
  const [, createManufacturer] = useCreateManufacturer(() => {
    callBack();
    setDestroy && setDestroy(true)
  });
  const [form] = Form.useForm<FieldType>();
  useResetAction();
  useEffect(() => {
    if (id && manufacturer) {
      const { name, description } = manufacturer
      form.setFieldsValue({
        name,
        description,
      })
    }else{ form.resetFields()};
  }, [id, manufacturer,form])
  const onFinish = (values: FieldType) => {
    const data: FieldType = {
      ...values,
    };
    if (id) {
      updateManufacturer({ ...data, id });
      setId(null)
    } else {
      createManufacturer({ ...data });
      form.resetFields()
    }
  };
  return (
    <>
      <Form
        name="basic"
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        labelAlign="left"
        style={{ maxWidth: 800 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item<FieldType> label="Tên hãng sản xuất" name="name">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Mô tả" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item style={{ width: '550px' }} wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
export default ManufacturerForm