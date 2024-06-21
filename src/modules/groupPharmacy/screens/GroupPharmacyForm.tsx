import { Button, Form, Input, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
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
  setDestroy?: any;
  query?: any;
}

export const GroupPharmacyForm = ({ onClose, id, handleUpdate,setDestroy, query }: Props) => {
  const [form] = Form.useForm();
  const [formCustomerGroup] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreateGroupPharmacy(() => {
    onClose();
    setDestroy  && setDestroy(true);
  });
  const [groupPharmacy, isLoading] = useGetGroupPharmacy(id);
  const initSalesChannel = useInitGroupPharmacy(groupPharmacy, id);
  const [selectedCustomerGroupId, setSelectedCustomerGroupId] = useState<string | undefined>();
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
  const onTypePharmacyChange = (value: string) => {
    setSelectedCustomerGroupId(value);
  };
  return (
    <div className="sale-channel page-wraper form-page-content">
      <h4 style={{ margin: "20px 0 40px 20px" }}>
        {id ? " Cập nhật" : "Thêm mới"} nhóm khách hàng
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
          <FormItem label="Mã nhóm khách hàng" name="code">
            <Input disabled />
          </FormItem>

          <FormItem
            name={"customerGroupId"}
            label="Nhánh khách hàng"
            rules={[
              { required: true, message: "Xin vui long chọn nhánh khách hàng" },
            ]}
            initialValue={query?.customerGroupId || null}
          >
            <SelectTypePharmacy
              validateFirst={false}
              form={formCustomerGroup}
              // style={{ width: 200 }}
              showIcon={false}
              size={"middle"}
              defaultValue={query?.customerGroupId || null}
            />
          </FormItem>
          {/* <FormItem
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
          </FormItem> */}
          <FormItem
            label="Nhóm khách hàng"
            name="title"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập nhóm khách hàng",
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem label="Mô tả" name="desc">
            <TextArea />
          </FormItem>
          <Row className="form__submit-box" style={{justifyContent: 'center'}}>
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Link to={PATH_APP.groupPharmacy.root}>
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
};
