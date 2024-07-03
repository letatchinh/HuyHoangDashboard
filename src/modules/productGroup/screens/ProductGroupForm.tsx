import React, { useEffect } from 'react';
import { Button, Flex, Form, Input } from 'antd';
import { useGetlistProductConfigById, useUpdateProductConfig, useCreateProductConfig, useResetAction, useGetlistProductConfigById_onlyGet } from '../productGroup.hook';
interface Props {
  id?: any;
  callBack?: () => void;
  setId?: any;
  updateProductConfig?: (data?: any) => void;
  setDestroy? : (data?: any) => void,
  readOnly?:boolean;
};
interface FieldType {
  code: string
  id: string
  name: string
  note: string
  isAction: String
};
const { TextArea } = Input;
const hookGetData = {
  readOnly : useGetlistProductConfigById_onlyGet,
  notReadOnly : useGetlistProductConfigById
}

const ProductConfigForm: React.FC<Partial<Props>> = ({ id,setId, callBack, updateProductConfig,setDestroy,readOnly }) => {
  const [, createProductConfig] = useCreateProductConfig(() => {
    callBack && callBack();
    setDestroy && setDestroy(true)
  });
  const [productConfigById, isLoading] : any = readOnly ? hookGetData.readOnly() : hookGetData.notReadOnly(id)
  const [form] = Form.useForm();
  useResetAction();
  useEffect(() => {
    if (id && productConfigById) {
      const { code, name, note }: FieldType = productConfigById;
      form.setFieldsValue({
        code,
        name,
        note,
      });
    } else {
      form.resetFields();
    }
  }, [id, productConfigById, form]);
  const onFinish = (values: FieldType) => {
    const data: FieldType = {
      ...values,
    };
    if (id) {
      updateProductConfig && updateProductConfig({ ...data, id });
      form.resetFields()
      setId(null);
    } else {
      createProductConfig({ ...data });
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
        <Form.Item<FieldType> label="Mã nhóm danh mục" name="code">
          <Input disabled />
        </Form.Item>
        <Form.Item<FieldType> label="Tên danh mục" name="name">
          <Input readOnly={readOnly}/>
        </Form.Item>
        <Form.Item<FieldType> label="Ghi chú" name="note">
          <TextArea readOnly={readOnly} rows={4} />
        </Form.Item>
          {!readOnly && <Flex justify={'center'}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          </Flex>}
      </Form>
    </>
  );
};

export default ProductConfigForm;
