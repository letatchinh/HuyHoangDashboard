import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import UploadImage from "~/components/common/Upload/UploadImage";
import AddressFormSection from "~/components/common/AddressFormSection";
import {useGetEmployee, useUpdateEmployee } from "../employee.hook";
import { employeeSliceAction } from "../redux/reducer";
import { useResetState } from "~/utils/hook";
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";
import AssignPharmacyModal from "~/modules/pharmacy/component/AssignPharmacyModal";
import { get } from "lodash";

const { Option } = Select;

const FormItem = Form.Item;

const verticalLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
interface IProps {
  id?: string | null;
  handleCloseModal: () => void;
  handleUpdate?: any;
  resetAction?: any;
  handleCreate?: any;
  isSubmitLoading?: boolean;
};

export default function EmployeeForm(props: IProps) {
  const [form] = Form.useForm();
  const { id, handleCloseModal,  handleUpdate,handleCreate, isSubmitLoading} = props;
  const [imageUrl, setImageUrl] = useState<string>();
  useResetState(employeeSliceAction.resetAction);
  //address
  const [cityCode, setCityCode] = useState(null);
  const [districtCode, setDistrictCode] = useState(null);
  // hook

  const [employee, isLoading] = useGetEmployee(id);
  
  useEffect(() => {
    if (employee) {
      setCityCode(employee?.address?.cityId);
      setDistrictCode(employee?.address?.districtId);
      form.setFieldsValue(employee);
      setImageUrl(employee?.avatar);
    };
    if (!id) {
      form.setFieldsValue({
        address: {
          cityId: null,
          districtId: null,
          wardId: null
        }
      });
      form.resetFields();
    };
  }, [id, employee]);

  const onFinish = (values: any) => {
    const employee = {
      ...values,
      avatar: imageUrl,
    };

    if (id) {
      const data : object = {
        ...employee,
        _id: id,
        avatar: imageUrl
      };
      handleUpdate({...data});
    } else {
      handleCreate(employee);
    };
  };

  const onValuesChange = ({ address }: any) => {
    if (address) {
      if (address.cityId) {
        form.setFieldsValue({
          address: {
            districtId: null,
            wardId: null,
          }
        });
      } else if (address.districtId) {
        form.setFieldsValue({
          address: {
            wardId: null
          }
        });
      };
    };
  };

  //Handle avatar
  const handleChange = useCallback(
    (imageUrl: string) => {
        setImageUrl(imageUrl);
    },
    [setImageUrl]
  );

  return (
    <div className="employee-form">
      <h4 style={{ marginRight: "auto", paddingLeft: 27 }}>
        {`${!id ? "Tạo mới " : "Cập nhật"}`} nhân viên
      </h4>
      <Form
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        scrollToFirstError
        requiredMark={false}
        // initialValues={initEmployee}
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
      >
        <Row
          gutter={48}
          align="middle"
          justify="space-between"
          className="employee-form__logo-row"
        >
          <Col span={12}>
            <Row gutter={36}>
              {/* <Col span={24}>
                  <FormItem
                    label="Tên nhân viên"
                    name="firstName"
                    rules={[
                      { required: true, message: 'Xin mời nhập tên nhân viên!' }
                    ]}
                  >
                    {isLoading ? <Skeleton.Input active /> : <Input />}
                  </FormItem>
                </Col> */}

              <Col span={24}>
                <FormItem
                  label="Họ và tên nhân viên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Xin mời nhập tên nhân viên!" },
                  ]}
                >
                  {isLoading ? <Skeleton.Input active /> : <Input />}
                </FormItem>
              </Col>
            </Row>

            <FormItem label="Giới tính" name="gender">
              {isLoading ? (
                <Skeleton.Input active />
              ) : (
                <Select>
                  <Option value="M" key="M">
                    Nam
                  </Option>
                  <Option value="F" key="F">
                    Nữ
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12} className="employee-form__upload-logo">
          <UploadImage
              imgUrl={imageUrl}
              onChange={handleChange}
            />
          </Col>
        </Row>
        <AddressFormSection
          isLoading={isLoading}
          form={form}
          setCityCode={setCityCode}
          setDistrictCode={setDistrictCode}
          cityCode={cityCode}
          districtCode={districtCode}
        />
        <Row
          gutter={48}
          align="middle"
          justify="space-between"
          className="employee-form__logo-row"
        >
          <Col span={12}>
            <Row gutter={36}>
              <Col span={24}>
                <FormItem
                  label="CMND/CCCD"
                  name="idNumber"
                  rules={[
                    {
                      required: false,
                      pattern: new RegExp(/^[0-9]{9,12}$/),
                      message: "Xin vui lòng nhập đúng số CMND/CCCD!",
                    },
                  ]}
                >
                  {isLoading ? <Skeleton.Input active /> : <Input />}
                </FormItem>
              </Col>
            </Row>
            <Row
              gutter={48}
              align="middle"
              justify="space-between"
              className="employee-form__logo-row"
              >
            <Col span={12}>
            <AssignPharmacyModal id={id} setForm={(newValue:any) => form.setFieldsValue({pharmacies : newValue})} initDataSource={get(employee,'pharmacies',[])}/>
            </Col>
          </Row>
          </Col>
          {/* <Col></Col> */}
        </Row>
        <Row gutter={10} align="middle" justify={"center"}>
          <Col span={2}>
            <Button
              onClick={handleCloseModal}
            >Huỷ</Button>
          </Col>
          <Col span={4}>
            <Button
              type="primary" htmlType="submit"
              loading={isSubmitLoading}
            >
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
