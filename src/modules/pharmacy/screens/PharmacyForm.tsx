import { PlusOutlined } from "@ant-design/icons";
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
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import AddressCommonForm from "~/components/common/AddressCommonForm";
import AddressFormDelivery from "~/components/common/AddressFormDelivery";
import AddressFormSection from "~/components/common/AddressFormSection";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import RenderLoading from "~/components/common/RenderLoading";
import SelectEmployee from "~/modules/employee/components/SelectEmployee";
import SelectGroupPharmacy from "~/modules/groupPharmacy/components/SelectGroupPharmacy";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";
import SaleChannelForm from "~/modules/saleChannel/screens/SaleChannelForm";
import SelectTypePharmacy from "~/modules/typePharmacy/components/SelectTypePharmacy";
import { PATH_APP } from "~/routes/allPath";
import {
  useCreatePharmacy,
  useGetPharmacyId,
  useInitPharmacy,
  useResetPharmacyAction,
} from "../pharmacy.hook";
import { convertInitPharmacy, convertSubmitData } from "../pharmacy.service";
import TypePharmacyForm from "~/modules/typePharmacy/screens/TypePharmacyForm";
import { GroupPharmacyForm } from "~/modules/groupPharmacy/screens/GroupPharmacyForm";
// import "./pharmacy.style.scss";
const FormItem = Form.Item;
const { Option } = Select;
interface Props {
  onClose: (p?: any) => void;
  id?: any;
  handleUpdate?: any;
  destroy?: any;
  setDestroy: any;
  query?: any;
}

export default function PharmacyForm({
  onClose,
  id,
  handleUpdate,
  destroy,
  setDestroy,
  query,
}: Props) {
  const [form] = Form.useForm();
  const [formSaleChannel] = Form.useForm();
  const [formCustomerGroup] = Form.useForm();
  const [formCustomer] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreatePharmacy(() => {
    onClose();
    setDestroy && setDestroy(true);
  });
  const [pharmacy, isLoading] = useGetPharmacyId(id);
  const initPharmacyProfile = useInitPharmacy(pharmacy, id);
  useResetPharmacyAction();
  const [cityCode, setCityCode]: any = useState();
  const [districtCode, setDistrictCode]: any = useState();
  const [isSaleChannelFormOpen, setSaleChannelFormOpen] = useState(false);
  const [isGroupCustomerFormOpen, setGroupCustomerFormOpen] = useState(false);
  const [isCustomerFormOpen, setCustomerFormOpen] = useState(false);
  const [selectedCustomerGroupId, setSelectedCustomerGroupId] = useState<
    string | undefined
  >();

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
      setSelectedCustomerGroupId(get(initPharmacy, "customerGroupId"));
    }
  }, [initPharmacyProfile, id, form]);

  const onValuesChange = (value: any, values: any) => {
    const key = Object.keys(value)[0];
    switch (key) {
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
        {id ? "Cập nhật" : "Thêm mới"} khách hàng B2B
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
                  <DatePicker format={"DD/MM/YYYY"} placeholder="Ngày sinh" />
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
            <h5 style={{ textAlign: "center" }}>Địa chỉ khách hàng</h5>
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
                <Row justify="space-around">
                  <FormItem
                    name={"salesChannelId"}
                    label="Kênh bán hàng"
                    rules={[
                      {
                        required: true,
                        message: "Xin vui lòng chọn kênh bán hàng",
                      },
                    ]}
                    initialValue={query?.salesChannelId || null}
                    style={{ width: "90%" }}
                    wrapperCol={{ sm: 24, md: 24, lg: 21 }}
                  >
                    <SelectSaleChannel
                      validateFirst={false}
                      form={formSaleChannel}
                      // style={{ marginLeft: 24, padding: 0 }}
                      showIcon={false}
                      size={"middle"}
                      defaultValue={query?.salesChannelId || null}
                      divisionText="B2B"
                    />
                  </FormItem>
                  <Button
                    onClick={() => setSaleChannelFormOpen(true)}
                    style={{ width: "10%" }}
                  >
                    <PlusOutlined />
                  </Button>
                </Row>
              </Col>
            </Row>
            <Row gutter={48} align="middle" justify="space-between">
              <Col span={12}>
                <Row justify="space-around">
                  <FormItem
                    name={"customerGroupId"}
                    label="Nhánh khách hàng"
                    rules={[
                      {
                        required: true,
                        message: "Xin vui lòng chọn nhánh khách hàng",
                      },
                    ]}
                    style={{ width: "90%", justifyContent: "space-between" }}
                    initialValue={query?.customerGroupId || null}
                  >
                    <SelectTypePharmacy
                      validateFirst={false}
                      form={formCustomerGroup}
                      // style={{ width: 300 }}
                      showIcon={false}
                      size={"middle"}
                      defaultValue={query?.customerGroupId || null}
                    />
                  </FormItem>
                  <Button
                    onClick={() => setGroupCustomerFormOpen(true)}
                    style={{ width: "10%" }}
                  >
                    <PlusOutlined />
                  </Button>
                </Row>
              </Col>
              <Col span={12}>
                <Row justify={"space-around"}>
                  <FormItem
                    name={"customerId"}
                    label="Nhóm khách hàng"
                    rules={[
                      {
                        required: true,
                        message: "Xin vui lòng chọn nhóm khách hàng",
                      },
                    ]}
                    style={{ width: "90%" }}
                    initialValue={query?.customerId || null}
                  >
                    <SelectGroupPharmacy
                      validateFirst={false}
                      form={formCustomer}
                      // style={{ width: 200 }}
                      showIcon={false}
                      size={"middle"}
                      defaultValue={query?.customerId || null}
                    />
                  </FormItem>
                  <Button
                    onClick={() => setGroupCustomerFormOpen(true)}
                    style={{ width: "10%" }}
                  >
                    <PlusOutlined />
                  </Button>
                </Row>
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
