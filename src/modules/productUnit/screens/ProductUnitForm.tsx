import React, { useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useGetlistProductUnitById, useUpdateProductUnit,useCreateProductUnit } from '../productUnit.hook';

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
const ProductUnitForm: React.FC<Props> = ({ id, callBack }) => {
  const [, updateProductUnit] = useUpdateProductUnit(callBack);
  const [, createProductUnit] = useCreateProductUnit(callBack);
  const [productUnitById, isLoading] = useGetlistProductUnitById(id);
  console.log(productUnitById, 'productUnitById');
  const [form] = Form.useForm();

  useEffect(() => {
    if (id&&productUnitById ) { 
      const {code,name,note}: FieldType = productUnitById;
      form.setFieldsValue({
        code,
        name,
        note,
      })
    }
  }, [id,productUnitById,form]);

  const onFinish = (values: FieldType) => {
     const data: FieldType = {
      ...values,
      // code:'DMT0001'
      // status:'',
      };
      if (id) {
        updateProductUnit({ data, id });
      }else {
        createProductUnit({ ...data });
        
      }
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
        <Form.Item<FieldType> label="Tên đơn vị tính" name="name">
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

export default ProductUnitForm;
