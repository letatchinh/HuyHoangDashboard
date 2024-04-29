import { Button, Form, Input, Row } from "antd";
import { useCreateTypePharmacy, useGetTypePharmacy, useInitTypePharmacy, useResetTypePharmacyAction } from "../typePharmacy.hook";
import { useCallback, useEffect } from "react";
import { convertInitTypePharmacy } from "../typePharmacy.service";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";

const FormItem = Form.Item;
interface Props {
  onClose: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
  setDestroy?: any;
}

export default function TypePharmacyForm({ onClose, id, handleUpdate,setDestroy }: Props) {
  const [form] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreateTypePharmacy(() => {
    onClose();
    setDestroy && setDestroy(true);
  });
  const [typePharmacy, isLoading] = useGetTypePharmacy(id);
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
      onClose();
    },
    [handleCreate, handleUpdate, id, onClose]
  );
  return (
    <div className="type-pharmacy page-wraper form-page-content">
      <h4 style={{ margin: "20px 0 40px 20px" }}>
        {id ? " Cập nhật" : "Thêm mới"} loại khách hàng
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
          <FormItem label="Mã loại khách hàng" name="code">
            <Input disabled />
          </FormItem>
          <FormItem
            label="Tên loại khách hàng"
            name="title"
            rules={[
              {
                required: true,
                message: "Xin vui lòng nhập tên loại khách hàng",
              },
            ]}
          >
            <Input />
          </FormItem>
          <Row className="form__submit-box" style={{justifyContent: 'center'}}>
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Link to={PATH_APP.typePharmacy.root}>
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