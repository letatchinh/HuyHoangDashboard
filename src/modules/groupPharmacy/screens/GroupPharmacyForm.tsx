import { Button, Form, Input, Row } from "antd";
import React, { useCallback, useEffect } from "react";
import {
  useCreateGroupPharmacy,
  useGetGroupPharmacy,
  useInitGroupPharmacy,
  useResetGroupPharmacyAction,
} from "../groupPharmacy.hook";
import { convertInitGroupPharmacy } from "../groupPharmacy.service";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import TextArea from "antd/es/input/TextArea";
import SelectTypePharmacy from "~/modules/typePharmacy/components/SelectTypePharmacy";

const FormItem = Form.Item;
interface Props {
  onClose: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
}

export const GroupPharmacyForm = ({ onClose, id, handleUpdate }: Props) => {
  const [form] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreateGroupPharmacy(onClose);
  const [groupPharmacy, isLoading] = useGetGroupPharmacy(id);
  const initSalesChannel = useInitGroupPharmacy(groupPharmacy, id);
  useResetGroupPharmacyAction();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initSaleChannel = convertInitGroupPharmacy(initSalesChannel);
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
        {id ? " Cập nhật" : "Thêm mới"} nhóm nhà thuốc
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
          <FormItem label="Mã nhóm nhà thuốc" name="code">
            <Input disabled />
          </FormItem>

          <SelectTypePharmacy
           isLoading={isLoading} typePharmacy={groupPharmacy}
          />
          <FormItem
            label="Hệ số"
            name="rateType"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập hệ số",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Nhóm nhà thuốc"
            name="title"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập nhóm nhà thuốc",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem label="Mô tả" name="desc">
            <TextArea />
          </FormItem>
          <Row className="form__submit-box">
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Link to={PATH_APP.groupPharmacy.root}>
                <Button onClick={onClose}>Huỷ</Button>
              </Link>
            )}

            <Button type="primary" htmlType="submit" loading={isSubmitLoading}>
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
};
