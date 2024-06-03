import { Button, Col, Form, Input, Row, Skeleton } from 'antd';
import React from 'react';
import { useGetBranch } from '../branch.hook';
import Address from '~/modules/salesGroup/components/Address';
import AddressForm from '~/components/common/AddressForm';
import AddressFormSection from '~/components/common/AddressFormSection';
import BaseBorderBox from '~/components/common/BaseBorderBox';
import useBranchContext from '../store/BranchContext';
type propsType = {
  id?: any
};
export default function BranchForm({ id }: propsType): React.JSX.Element {
  const { onCreateBranch } = useBranchContext();
  const [form] = Form.useForm();
  const [branch, loading] = useGetBranch(id);
  const onFinish = (values: any) => {
    try {
      console.log(values)
    } catch (error) {
      console.log(error)
    }
  };

  const renderLoading = (component: React.ReactNode) => {
    return loading ? <Skeleton.Image active /> : component
  };
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      autoComplete="off"
      labelAlign='left'
    >
      <BaseBorderBox title={'Thông tin'}>
        <Form.Item
          name={'name'}
          label={'Tên chi nhánh'}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên chi nhánh',
            }
          ]}
        >
          {renderLoading(
            <Input placeholder="Tên chi nhánh"/>
          )}
        </Form.Item>
      </BaseBorderBox>
      <BaseBorderBox title={'Địa chỉ'} >
        <AddressFormSection form={form}/>
      </BaseBorderBox>
      <Row justify="end" className='mt-4'>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>{ id ? 'Cập nhật' : 'Tạo mới'}</Button>
          <Button>Huỷ</Button>
      </Row>
    </Form>
  )
}