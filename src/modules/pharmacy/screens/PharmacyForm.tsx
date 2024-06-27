import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import AddressCommonForm from "~/components/common/AddressCommonForm";
import AddressFormDelivery from "~/components/common/AddressFormDelivery";
import AddressFormSection from "~/components/common/AddressFormSection";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import RenderLoading from "~/components/common/RenderLoading";
import SelectEmployee from "~/modules/employee/components/SelectEmployee";
import { GroupPharmacyForm } from "~/modules/groupPharmacy/screens/GroupPharmacyForm";
import SaleChannelForm from "~/modules/saleChannel/screens/SaleChannelForm";
import TypePharmacyForm from "~/modules/typePharmacy/screens/TypePharmacyForm";
import FormSalesChannel from "../component/FormSalesChannel";
import {
  useGetPharmacyId,
  useInitPharmacy,
  useResetPharmacyAction,
} from "../pharmacy.hook";
import { convertInitPharmacy, convertSubmitData } from "../pharmacy.service";

const FormItem = Form.Item;
const { Option } = Select;
interface Props {
  onClose: (p?: any) => void;
  id?: any;
  handleCreate?: any;
  isSubmitLoading?: any;
  handleUpdate?: any;
  destroy?: any;
  setDestroy: any;
  query?: any;
}

export default function PharmacyForm({
  onClose,
  id,
  handleCreate,
  isSubmitLoading,
  handleUpdate,
  destroy,
  setDestroy,
  query,
}: Props) {
  const [form] = Form.useForm();
  const [pharmacy, isLoading] = useGetPharmacyId(id);
  const initPharmacyProfile = useInitPharmacy(pharmacy, id);
  useResetPharmacyAction();
  const [cityCode, setCityCode]: any = useState();
  const [districtCode, setDistrictCode]: any = useState();
  const [isSaleChannelFormOpen, setSaleChannelFormOpen] = useState(false);
  const [isGroupCustomerFormOpen, setGroupCustomerFormOpen] = useState(false);
  const [isCustomerFormOpen, setCustomerFormOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      const initPharmacy = convertInitPharmacy(initPharmacyProfile);
      form.setFieldsValue({
        ...initPharmacy,
        infoPolicy: {
          ...initPharmacy?.infoPolicy,
          dateOfBirth: dayjs(
            initPharmacy?.infoPolicy?.dateOfBirth,
            "YYYY-MM-DD"
          ),
        },
      });
    }
  }, [initPharmacyProfile, id, form]);

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
        {id ? "Cập nhật" : "Thêm mới"} khách hàng B2B
      </h4>
      <div className="container-fluid">
        <Form
          form={form}
          autoComplete="off"
          onFinish={onFinish}
          scrollToFirstError
          requiredMark={false}
          // onValuesChange={onValuesChange}
          labelCol={{ sm: 24, md: 24, lg: 6 }}
          wrapperCol={{ sm: 24, md: 24, lg: 18 }}
          labelAlign="left"
        >
          <BaseBorderBox title={"Thông tin chung"}>
            <FormItem
              label="Tên khách hàng"
              name="name"
              labelCol={{ sm: 24, md: 24, lg: 3 }}
              wrapperCol={{ sm: 24, md: 24, lg: 21 }}
              rules={[
                { required: true, message: "Xin vui lòng nhập tên khách hàng" },
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
                <SelectEmployee
                  isLoading={isLoading}
                  employeeSeller={pharmacy}
                />
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
                  <DatePicker format={"DD/MM/YYYY"} placeholder="Ngày sinh" defaultValue={dayjs("01/01/1990")} />
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
            {/* Nhập kênh, nhánh, nhóm khách hàng */}
            {/* <Divider/> */}
            <FormSalesChannel />
            <h5 style={{ textAlign: "center" }}>Địa chỉ khách hàng</h5>
            {/* <BaseBorderBox title={"Địa chỉ khách hàng"}> */}
            <AddressFormSection
              form={form}
              cityCode={cityCode}
              setCityCode={setCityCode}
              districtCode={districtCode}
              setDistrictCode={setDistrictCode}
              allowPhoneNumber={false}
              allowEmail={false}
            />
            {/* </BaseBorderBox> */}
            <Row gutter={48} align="middle" justify="space-between">
              <Col span={12}>
                <FormItem
                  label="Vùng"
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
                <FormItem
                  label="Khu vực"
                  name="areaPharma"
                  wrapperCol={{ sm: 24, md: 24, lg: 21 }}
                >
                  <Input />
                </FormItem>
              </Col>
            </Row>

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
          </BaseBorderBox>
          <BaseBorderBox title={"Địa chỉ giao hàng"}>
            <AddressFormDelivery
              form={form}
              cityCode={cityCode}
              setCityCode={setCityCode}
              districtCode={districtCode}
              setDistrictCode={setDistrictCode}
              allowPhoneNumber={false}
              allowEmail={false}
            />
          </BaseBorderBox>
          <BaseBorderBox title={"Địa chỉ xuất hoá đơn"}>
            <AddressCommonForm
              form={form}
              addressType="addressInvoicing"
              cityCode={cityCode}
              setCityCode={setCityCode}
              districtCode={districtCode}
              setDistrictCode={setDistrictCode}
            />
          </BaseBorderBox>
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
            >
              {id ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Row>
        </Form>
      </div>
      <ModalAnt
        width={640}
        open={isSaleChannelFormOpen}
        onCancel={() => setSaleChannelFormOpen(false)}
        footer={[]}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <SaleChannelForm
          onClose={() => setSaleChannelFormOpen(false)}
          id={query.salesChannelId}
          setDestroy={setDestroy}
        />
      </ModalAnt>
      <ModalAnt
        width={640}
        open={isGroupCustomerFormOpen}
        onCancel={() => setGroupCustomerFormOpen(false)}
        footer={[]}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <TypePharmacyForm
          onClose={() => setGroupCustomerFormOpen(false)}
          setDestroy={setDestroy}
          query={query}
        />
      </ModalAnt>
      <ModalAnt
        width={640}
        open={isCustomerFormOpen}
        onCancel={() => setCustomerFormOpen(false)}
        footer={[]}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <GroupPharmacyForm
          onClose={() => setCustomerFormOpen(false)}
          setDestroy={setDestroy}
          query={query}
        />
      </ModalAnt>
    </div>
  );
}
