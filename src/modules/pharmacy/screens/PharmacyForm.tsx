import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
} from "antd";
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
import { convertInitPharmacy, convertSubmitData } from "../pharmacy.service";
import SelectTypePharmacy from "~/modules/typePharmacy/components/SelectTypePharmacy";
import SelectGroupPharmacy from "~/modules/groupPharmacy/components/SelectGroupPharmacy";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";
import RenderLoading from "~/components/common/RenderLoading";
import TextArea from "antd/es/input/TextArea";
import AddressFormDelivery from "~/components/common/AddressFormDelivery";
import { get } from "lodash";
import AddressForm from "~/components/common/AddressForm";
const FormItem = Form.Item;
const { Option } = Select;
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
  const [selectedCustomerGroupId, setSelectedCustomerGroupId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initPharmacy = convertInitPharmacy(initPharmacyProfile);
      form.setFieldsValue(initPharmacy);
    }
  }, [initPharmacyProfile, id, form]);

  const onValuesChange = (value: any, values: any) => {
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

  const onTypePharmacyChange = (value: string) => {
    setSelectedCustomerGroupId(value);
  };
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

          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Chủ sở hữu"
                name={["infoPolicy", "fullName"]}
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Trình dược viên"
                name="employeeId"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
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
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Ngày sinh"
                name={["infoPolicy", "dateOfBirth"]}
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                {/* <DatePicker format={"DD/MM/YYYY"} placeholder="Ngày sinh" /> */}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Số di động"
                name="cellPhone"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
                rules={[
                  {
                    // required: true,
                    pattern: new RegExp(/^[0-9]{10,13}$/),
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
          </Row>
          <h5 style={{ textAlign: "center" }}>Địa chỉ nhà thuốc</h5>
          <AddressFormSection
            form={form}
            cityCode={cityCode}
            setCityCode={setCityCode}
            districtCode={districtCode}
            setDistrictCode={setDistrictCode}
            allowPhoneNumber={false}
            allowEmail={false}
          />

          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <SelectTypePharmacy
                isLoading={isLoading}
                typePharmacy={pharmacy}
                onChange={onTypePharmacyChange}
              />
            </Col>
            <Col span={12}>
              <SelectGroupPharmacy
                isLoading={isLoading}
                groupPharmacy={pharmacy}
                customerGroupId={selectedCustomerGroupId}
              />
            </Col>
          </Row>
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Khu vực"
                name="urbanType"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                {RenderLoading(
                  isLoading,
                  <Select>
                    <Option value="CITY" key="CITY">
                      Thành thị
                    </Option>
                    <Option value="COUNTRY" key="COUNTRY">
                      Nông thôn
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <SelectSaleChannel isLoading={isLoading} saleChannel={pharmacy} />
            </Col>
          </Row>
          <FormItem
            label="Khu vực"
            name="areaPharma"
            labelCol={{ sm: 24, md: 24, lg: 3 }}
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
          >
            <Input />
          </FormItem>
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Tuyến thứ"
                name="secondaryLine"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Tần suất quay lại"
                name="frequencyOfVisits"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Hạng khách hàng"
                name="customerRanking"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Số hợp đồng"
                name="contractNumber"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Mã số thuế"
                name="tax"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Số hiệu GPHĐ"
                name="operationLicenseNumber"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Số tài khoản"
                name="accountNumber"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                {isLoading ? <Skeleton.Input active /> : <Input />}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Chủ tài khoản"
                name="accountOwner"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={48} align="middle" justify="space-between">
            <Col span={12}>
              <FormItem
                label="Tên ngân hàng"
                name="bankName"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label="Chiết khấu %"
                name="discountPercentage"
                wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>
          <FormItem
            label="Ghi chú"
            name="note"
            labelCol={{ sm: 24, md: 24, lg: 3 }}
            wrapperCol={{ sm: 24, md: 24, lg: 21 }}
          >
            <TextArea />
          </FormItem>
          <h5 style={{ textAlign: "center" }}>Địa chỉ giao hàng</h5>
          <AddressFormDelivery
            form={form}
            cityCode={cityCode}
            setCityCode={setCityCode}
            districtCode={districtCode}
            setDistrictCode={setDistrictCode}
            allowPhoneNumber={false}
            allowEmail={false}
          />
          <h5 style={{ textAlign: "center" }}>Địa chỉ xuất hoá đơn</h5>
          <AddressForm
            form={form}
            address="addressInvoicing"
            cityCode={cityCode}
            setCityCode={setCityCode}
            districtCode={districtCode}
            setDistrictCode={setDistrictCode}
            allowPhoneNumber={false}
            allowEmail={false}
          />
          <Row
            className="form__submit-box"
            style={{ justifyContent: "center" }}
          >
            {isSubmitLoading ? (
              <Button disabled>Huỷ</Button>
            ) : (
              <Link to={PATH_APP.pharmacy.root}>
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
