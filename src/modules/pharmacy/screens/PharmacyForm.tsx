import { Button, Col, Form, Input, Modal, Row, Select, Skeleton } from "antd";
import {
  useCreatePharmacy,
  useGetPharmacyId,
  useInitPharmacy,
  useResetPharmacyAction,
} from "../pharmacy.hook";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import AddressFormSection from "~/components/common/AddressFormSection";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { convertInitPharmacy, convertSubmitData } from "../pharmacy.service";
const FormItem = Form.Item;
interface Props {
  onClose: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
}

export default function PharmacyForm({ onClose, id, handleUpdate }: Props) {
  const [form] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreatePharmacy(onClose);
  const [pharmacy, isLoading] = useGetPharmacyId(id);
  const initPharmacyProfile = useInitPharmacy(pharmacy, id);
  useResetPharmacyAction();
  const [cityCode, setCityCode]: any = useState();
  const [districtCode, setDistrictCode]: any = useState();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initPharmacy = convertInitPharmacy(initPharmacyProfile);
      form.setFieldsValue(initPharmacy);

    }
  }, [initPharmacyProfile, id, form]);

  const onValuesChange = (value: any,values : any) => {
    const key = Object.keys(value)[0];
    switch (key) {
      // case "cumulativeDiscount":
      //   const cumulativeDiscount = CumulativeDiscountModule.service.onDiscountChange(values[key]);
      //   form.setFieldsValue({
      //     cumulativeDiscount,
      //   });
      //   break;

      default:
        break;
    }
  };

  const onFinish = useCallback(
    (values: any) => {
      const submitData = convertSubmitData(values);
      if (id) {
        handleUpdate({ ...submitData, _id: id });
      } else {
        handleCreate({ ...submitData });
      }
      onClose();
    },
    [handleCreate, handleUpdate, id, onClose]
  );
  return (
    <div className="pharmacy-profile page-wraper form-page-content">
      <h4 style={{ margin: "20px 0 40px 20px" }}>
        {id ? " Cập nhật" : "Thêm mới"} nhà thuốc
      </h4>
      <div className="container-fluid">
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          scrollToFirstError
          requiredMark={false}
          onValuesChange={onValuesChange}
          labelCol={{ sm: 24, md: 24, lg: 6 }}
          wrapperCol={{ sm: 24, md: 24, lg: 18 }}
          labelAlign="left"
        >
          <FormItem
            label="Tên nhà thuốc"
            name="name"
            labelCol={{ sm: 24, md: 24, lg: 3 }}
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
            rules={[
              { required: true, message: "Xin vui lòng nhập tên nhà thuốc" },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="Tên người đại diện"
            name={["infoPolicy", "fullName"]}
            labelCol={{ sm: 24, md: 24, lg: 3 }}
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
          >
            <Input />
          </FormItem>
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Số điện thoại"
                name="phoneNumber"
                // labelCol={{ sm: 24, md: 24, lg: 3 }}
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
                rules={[
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9]/),
                    message: "Xin vui lòng nhập đúng số điện thoại!",
                  },
                ]}
              >
                {isLoading ? (
                  <Skeleton.Input active />
                ) : (
                  <Input maxLength={15} minLength={10} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Email"
                name={["infoPolicy", "email"]}
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
                rules={[{ type: "email" }]}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <AddressFormSection
            form={form}
            cityCode={cityCode}
            setCityCode={setCityCode}
            districtCode={districtCode}
            setDistrictCode={setDistrictCode}
            allowPhoneNumber={false}
            allowEmail={false}
          />
          <Row className="form__submit-box" style={{justifyContent: 'center'}}>
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Link to={PATH_APP.pharmacy.root}>
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
