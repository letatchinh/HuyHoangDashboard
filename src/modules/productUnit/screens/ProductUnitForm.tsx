import React, { useCallback, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { useGetlistProductUnitById,useCreateProductUnit, useResetAction } from '../productUnit.hook';
interface Props {
  id?: any;
  callBack?: () => void;
  setId?:any
  updateProductUnit: (data: any) => void;
};
interface FieldType {
  code: string
  id: string
  name: string
  note: string
  isAction:String
};
const { TextArea } = Input;
const ProductUnitForm: React.FC<Props> = ({ id,setId, callBack,updateProductUnit }) => {
  // const [, updateProductUnit] = useUpdateProductUnit(callBack);
  const [, createProductUnit] = useCreateProductUnit(callBack);
  const [productUnitById, isLoading] = useGetlistProductUnitById(id);
  const [form] = Form.useForm();
  useResetAction();
  useEffect(() => {
    if (id&&productUnitById ) { 
      const {code,name,note}: FieldType = productUnitById;
      form.setFieldsValue({
        code,
        name,
        note,
      })
    } else {
      form.resetFields();
    }
  }, [id,productUnitById,form]);
  const onFinish = useCallback((values: FieldType) => {
     const data: FieldType = {
      ...values,
      };
      if (id) {
        updateProductUnit({ ...data, id });
        setId(null)
      }else {
        createProductUnit({ ...data });
        form.resetFields()     
      };
  },[updateProductUnit,createProductUnit,id])

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
        <Form.Item<FieldType> label="Tên đơn vị tính" name="name">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Ghi chú" name="note">
          <TextArea rows={4}/>
        </Form.Item>
        <Form.Item style={{ width: '950px'}} wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductUnitForm;
