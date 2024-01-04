import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useGetlistProductConfigById, useUpdateProductConfig,useCreateProductConfig } from '../productConfig.hook';

interface Props {
  id?: any;
  callBack?: () => void;
}

interface FieldType {
  code: string
  key: string
  name: string
  description: string
  isAction:String
}
const { TextArea } = Input;
const ProductConfigForm: React.FC<Props> = ({ id, callBack }) => {
  const [, updateProductConfig] = useUpdateProductConfig(callBack);
  const [, createProductConfig] = useCreateProductConfig(callBack);
  const [productConfigById, isLoading] = useGetlistProductConfigById(id);
  const [form] = Form.useForm();

  useEffect(() => {
    // const {code,name}: FieldType = productConfigById;
    if (id&&productConfigById ) {
      form.setFieldsValue({
        // name,
        // code,
      })

    }
  }, [id,productConfigById,form]);

  const onFinish = (values: FieldType) => {
     const data: FieldType = {
      ...values,
      };
      if (id) {
        updateProductConfig({ data, id });
      }else {
        createProductConfig({ data });
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
        <Form.Item<FieldType> label="Mã nhóm danh mục" name="code">
          <Input disabled />
        </Form.Item>
        <Form.Item<FieldType> label="Tên danh mục" name="name">
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
  );
};

export default ProductConfigForm;
