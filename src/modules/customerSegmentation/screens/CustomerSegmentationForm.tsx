import React, { useCallback, useEffect } from "react";
import { PropsForm } from "../customerSegmentation.modal";
import { Button, Form, Input, Row } from "antd";
import {
  useGetCustomerSegmentation,
  useResetCustomerSegmentationAction,
} from "../customerSegmentation.hook";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";

const FormItem = Form.Item;

interface FieldType {
  title: string;
}
export default function CustomerSegmentationForm(
  props: PropsForm
): React.JSX.Element {
  const { id, onClose, handleUpdate, setDestroy, isSubmitLoading } = props;
  const [form] = Form.useForm();

  const [customerSegmentation, isLoading] = useGetCustomerSegmentation(id);

  useResetCustomerSegmentationAction();

  useEffect(() => {
    if (id && customerSegmentation) {
      const { title }: FieldType = customerSegmentation;
      form.setFieldsValue({
        title,
      });
    } else {
      form.resetFields();
    }
  }, [id, customerSegmentation, form]);

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
      }
      onClose();
    },
    [handleUpdate, id, onClose]
  );
  return (
    <div className="sale-channel page-wraper form-page-content">
      <h4 style={{ margin: "20px 0 40px 20px" }}>
        {id ? " Cập nhật" : "Thêm mới"} phân hệ khách hàng
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
          <FormItem
            label="Tên phân hệ khách hàng"
            name="title"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập tên phân hệ khách hàng",
              },
            ]}
          >
            <Input />
          </FormItem>
          <Row
            className="form__submit-box"
            style={{ justifyContent: "center" }}
          >
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Link to={PATH_APP.customerSegmentation.root}>
                <Button onClick={onClose}>Huỷ</Button>
              </Link>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitLoading}
              style={{ marginLeft: 5 }}
            >
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
