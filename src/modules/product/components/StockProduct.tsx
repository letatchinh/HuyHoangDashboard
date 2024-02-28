import { EditOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Popover } from 'antd';
import React, { useCallback, useState } from 'react';
import InputNumberAnt from '~/components/Antd/InputNumberAnt';
import { formatter } from '~/utils/helpers';
type propsType = {
    stock: number,
    handleUpdate : (newStock:any) => void
};

const UpdateStock = ({defaultValue,onUpdate}:{defaultValue:number,onUpdate : (p:any) => void}) => {
  const [form] = Form.useForm();
    const onFinish = useCallback(({stock} : {stock : number}) => {
        onUpdate(stock)
    },[onUpdate])
    return (
      <Form
        className="align-items-center"
        layout="inline"
        onFinish={onFinish}
        form={form}
        initialValues={{ stock: defaultValue }}
      >
        <Form.Item name={"stock"} >
          <InputNumberAnt enterKeyHint='enter' style={{ width: 120 }} />
        </Form.Item>
        <Button htmlType="submit" type="primary" size="small">
          Cập nhật
        </Button>
      </Form>
    );
}

export default function StockProduct({stock,handleUpdate}:propsType) : React.JSX.Element {
    const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const onUpdate = (newStock : number) => {
    hide();
    handleUpdate(newStock);
  }
    return (
      <Flex align={"center"} className="stock">
        <p>{formatter(stock)} </p>
        <Popover
          content={<UpdateStock onUpdate={onUpdate} defaultValue={stock} />}
          title="Nhập tồn kho"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <Button icon={<EditOutlined />} type="text" />
        </Popover>
      </Flex>
    );
}