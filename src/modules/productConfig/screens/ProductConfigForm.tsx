import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useGetlistProductConfigById, useUpdateProductConfig,useCreateProductConfig } from '../productConfig.hook';

interface Props {
  id?: any;
  callBack?: () => void;
}

interface FieldType {
  code: string
  id: string
  name: string
  note: string
  isAction:String
}
const { TextArea } = Input;
const ProductConfigForm: React.FC<Props> = ({ id, callBack }) => {
  const [, updateProductConfig] = useUpdateProductConfig(callBack);
  const [, createProductConfig] = useCreateProductConfig(callBack);
  const [productConfigById, isLoading] = useGetlistProductConfigById(id);
  console.log(productConfigById, 'productConfigById');
  const [form] = Form.useForm();

  useEffect(() => {
    if (id&&productConfigById ) { 
      const {code,name,note}: FieldType = productConfigById;
      form.setFieldsValue({
        code,
        name,
        note,
      })
    }
  }, [id,productConfigById,form]);

  const onFinish = (values: FieldType) => {
     const data: FieldType = {
      ...values,
      // code:'DMT0001'
      // status:'',
      };
      if (id) {
        updateProductConfig({ data, id });
      }else {
        createProductConfig({ ...data });
        
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
        <Form.Item<FieldType> label="Mã nhóm danh mục" name="code">
          <Input disabled />
        </Form.Item>
        <Form.Item<FieldType> label="Tên danh mục" name="name">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Ghi chú" name="note">
          <TextArea rows={4}/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductConfigForm;
