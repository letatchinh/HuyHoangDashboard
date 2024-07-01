import { Button, Form, Input, Popconfirm, Row } from 'antd';
import { omit, trim } from 'lodash';
import React from 'react';
import useNotificationStore from '~/store/NotificationContext';
type propsType = {
  onFinish: (value: string) => void;
  onClose: () => void;
  form: any;
};
export default function NoteAction({onFinish: onHandle, onClose,form}: propsType): React.JSX.Element {
  const { onNotify } = useNotificationStore();

  const onFinish = (values: any) => {
    if (trim(values) === "" || null || undefined) {
      return onNotify?.error('Vui lòng nhập ghi chú!');
    };
    onHandle(values?.note);
    onClose();
  };
  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign='left'
    >
      <Form.Item label="Ghi chú" name="note" rules={[{ required: true , message: 'Vui lòng nhập ghi chú!'}]}>
          <Input.TextArea />
      </Form.Item>
      <Row justify={"end"}>
            <Button type="primary" htmlType="submit">Cập nhật</Button>
      <Button onClick={onClose} style={{marginLeft: 10}}>Huỷ</Button>
      </Row>
    </Form>
  )
}