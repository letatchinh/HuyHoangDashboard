import { Button, Col, Form, Input, Row, Skeleton } from "antd";
import {
  useCreateSaleChannel,
  useGetSaleChannel,
  useInitSaleChannel,
  useResetSaleChannelAction,
} from "../saleChannel.hook";
import { useCallback, useEffect, useState } from "react";
import { convertInitSaleChannel } from "../saleChannel.service";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";

const FormItem = Form.Item;
interface Props {
  onClose: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
}

export default function SaleChannelForm({ onClose, id, handleUpdate }: Props) {
  const [form] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreateSaleChannel(onClose);
  const [saleChannel, isLoading] = useGetSaleChannel(id);
  const initSalesChannel = useInitSaleChannel(saleChannel, id);
  useResetSaleChannelAction();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initSaleChannel = convertInitSaleChannel(initSalesChannel);
      form.setFieldsValue(initSaleChannel);
    }
  }, [initSalesChannel, id, form]);

  const onValuesChange = (value: any, values: any) => {
    const key = Object.keys(value)[0];
    switch (key) {
      default:
        break;
    }
  };

  const onFinish = useCallback(
    (values: any) => {
      if (id) {
        handleUpdate({ ...values, _id: id });
      } else {
        handleCreate({ ...values });
      }
      onClose();
    },
    [handleCreate, handleUpdate, id, onClose]
  );
  return (
    <div className="sale-channel page-wraper form-page-content">
      <h4 style={{ margin: "20px 0 40px 20px" }}>
        {id ? " Cập nhật" : "Thêm mới"} kênh bán hàng
      </h4>
      <div className="container-fluid">
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          scrollToFirstError
          requiredMark={false}
          onValuesChange={onValuesChange}
          labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
          wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
          labelAlign="left"
        >
          <FormItem label="Mã kênh bán hàng" name="code">
            <Input disabled />
          </FormItem>
          <FormItem
            label="Tên kênh bán hàng"
            name="title"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập tên kênh bán hàng",
              },
            ]}
          >
            <Input />
          </FormItem>
          <Row className="form__submit-box" style={{justifyContent: 'center'}}>
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Link to={PATH_APP.saleChannel.root}>
                <Button onClick={onClose}>Huỷ</Button>
              </Link>
            )}

            <Button type="primary" htmlType="submit" loading={isSubmitLoading} style={{marginLeft: 5}}>
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
