import { Button, Form, Input, Row } from "antd";
import {
  useCreateTypePharmacy,
  useGetTypePharmacy,
  useGetTypePharmacy_onlyGet,
  useInitTypePharmacy,
  useResetTypePharmacyAction,
} from "../typePharmacy.hook";
import { useCallback, useEffect } from "react";
import { convertInitTypePharmacy } from "../typePharmacy.service";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";

const FormItem = Form.Item;
interface Props {
  onClose?: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
  setDestroy?: any;
  query?: any;
  readOnly?: boolean
}

const hookGetData = {
  readOnly : useGetTypePharmacy_onlyGet,
  notReadOnly : useGetTypePharmacy
}

export default function TypePharmacyForm({
  onClose,
  id,
  handleUpdate,
  setDestroy,
  query,
  readOnly
}: Props) {
  const [form] = Form.useForm();
  const [formSaleChannel] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreateTypePharmacy(() => {
    onClose && onClose();
    setDestroy && setDestroy(true);
  });
  const [typePharmacy, isLoading] : any = readOnly ? hookGetData.readOnly() : hookGetData.notReadOnly(id);
  const initTypesPharmacy = useInitTypePharmacy(typePharmacy, id);
  useResetTypePharmacyAction();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initTypePharmacy = convertInitTypePharmacy(initTypesPharmacy);
      form.setFieldsValue(initTypePharmacy);
    }
  }, [initTypesPharmacy, id, form]);

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
      form.resetFields();
    },
    [handleCreate, handleUpdate, id]
  );
  return (
    <div className="type-pharmacy page-wraper form-page-content">
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
          <FormItem label="Mã nhánh khách hàng" name="code">
            <Input disabled readOnly={readOnly} />
          </FormItem>
          <FormItem
            name={"salesChannelId"}
            label="Kênh bán hàng"
            rules={[
              { required: true, message: "Xin vui long chọn kênh bán hàng" },
            ]}
            initialValue={query?.salesChannelId || null}
          >
            <SelectSaleChannel
              validateFirst={false}
              form={formSaleChannel}
              // style={{ width: 200 }}
              showIcon={false}
              size={"middle"}
              defaultValue={query?.salesChannelId || null}
              divisionText="B2B"
              // onChange={(value) => onParamChange({ salesChannelId: value })}
            />
          </FormItem>
          <FormItem
            label="Tên nhánh khách hàng"
            name="title"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập tên nhánh khách hàng",
              },
            ]}
          >
            <Input readOnly={readOnly} />
          </FormItem>
          <Row
            className="form__submit-box"
            style={{ justifyContent: "center" }}
          >
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
                <Button onClick={onClose}>Huỷ</Button>
            )}

            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitLoading}
              style={{ marginLeft: 5 }}
              disabled={readOnly}
            >
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
