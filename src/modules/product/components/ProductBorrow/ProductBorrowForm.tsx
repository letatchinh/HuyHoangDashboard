import { Button, Col, Form, Modal, Row, Space } from 'antd';
import React, { useState } from 'react';
import BaseBorderBox from '~/components/common/BaseBorderBox';
import SelectCollaborator from '~/modules/collaborator/components/SelectSearch';
import UploadListFile from '~/modules/freelanceContractPharmacy/component/UploadListFile';
import SelectUser from '~/modules/user/components/SelectUser';
import FormSelectProduct from './FormSelectProduct';
type propsType = {

};

const styles = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span:  8},
    xl: { span: 8 },
    xxl: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 12 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 12 },
  }
};
export default function ProductBorrowForm(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const openForm = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Form
        form={form}
        {...styles}
        labelAlign='left'
      >
        <BaseBorderBox title={'Thông tin chung'}>
          <Row gutter={36}>
            <Col span={12}>
              <Form.Item label='Người tạo' name='createdById'>
                <SelectUser/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Người mượn' name='receidverId'>
                <SelectCollaborator/>
            </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
      
        <BaseBorderBox styleContent = {{minHeight: '300px'}} title={'Danh sách sản phẩm mượn'}>
          <Space>
              <Button onClick={openForm}>Chọn sản phẩm</Button>
          </Space>
        </BaseBorderBox>

        <BaseBorderBox title={'Đính kèm'}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label='Biên bản' name='file'>
                <UploadListFile/>
            </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
      </Form>
      <Modal
        title='Chọn sản phẩm'
        open={isOpen}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={1300}
      >
        <FormSelectProduct/>
      </Modal>
    </div>
  )
};