import { Button, Col, Form, Input, Modal, Popconfirm, Row, Select, Skeleton } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import UploadImage from "~/components/common/Upload/UploadImage";
import AddressFormSection from "~/components/common/AddressFormSection";
import {useGetEmployee, useUpdateEmployee } from "../employee.hook";
import { employeeSliceAction } from "../redux/reducer";
import { useFetchByParam, useResetState } from "~/utils/hook";
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import { EMPLOYEE_LEVEL_OPTIONS } from "../constants";
import AreaSelect from "~/components/common/AreaSelect/index";
import { DEFAULT_BRANCH_ID, OPTION_AREA } from "~/constants/defaultValue";
import Account from "~/components/common/Account";
import useNotificationStore from "~/store/NotificationContext";
import apis from "~/modules/user/user.api";
import { useParams } from "react-router-dom";
import { omit } from "lodash";
import { useFetchState } from "~/utils/helpers";
import WithPermission from "~/components/common/WithPermission";
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

  const [loadingValidateUsername, setLoadingValidateUsername] = useState<boolean>(false);
  const [statusAccount, setStatusAccount] = useState('INACTIVE');
  useResetState(employeeSliceAction.resetAction);
  //address
  const [cityCode, setCityCode] = useState(null);
  const [districtCode, setDistrictCode] = useState(null);
  // hook
  const { branchId }: any = useParams();
  const branchIdParam = useMemo(
    () => ({ branchId: branchId ? branchId : DEFAULT_BRANCH_ID }),
    [branchId]
  );
  // const [groups, isLoadingGroups] = useGetEmployeeGroups(branchIdParam);
  const [groups, isLoadingGroups] = useFetchState({api: apis.getListEmployeeGroup, query: branchIdParam,useDocs: false});
  // const 
  const [employee, isLoading] = useGetEmployee(id);
  const {onNotify}  = useNotificationStore();
  
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
      if (statusAccount === 'ACTIVE') {
        handleUpdate({...data});
      } else {
        handleUpdate({
          ...omit(data,['username', 'password', 'confirmPassword']),
        });
      };
    } else {
      handleCreate({...omit(employee, ['userId','updateAccount'])});
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

  const onFocusOutFullName = async () => {
    const fullName = form.getFieldValue("fullName");
    if (!id && fullName) {
      // Only Create
      try {
        setLoadingValidateUsername(true);
        const username = await apis.validateUsername({ fullName: fullName?.trim()});
        form.setFieldsValue(username);
        setLoadingValidateUsername(false);
      } catch (error) {
        setLoadingValidateUsername(false);
        onNotify?.error("Lỗi khi lấy dữ liệu từ máy chủ");
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
        {`${!id ? "Tạo mới " : "Cập nhật"}`} trình dược viên
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
        <BaseBorderBox title={"Thông tin chung"}>
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
                    label="Họ và tên TDV"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Xin mời nhập tên trình dược viên!",
                      },
                    ]}
                  >
                    {isLoading ? <Skeleton.Input active /> : <Input onBlur={onFocusOutFullName} />}
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
              <UploadImage imgUrl={imageUrl} onChange={handleChange} />
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
            </Col>
            <Col span={12}>
              <FormItem
                  label="Nhóm TDV"
                  name="groups"
                  // rules={[
                  //   {
                  //     required: false,
                  //     message: "Xin vui lòng chọn nhóm người dùng!",
                  //   },
                  // ]}
                >
              {isLoading || isLoadingGroups ? <Skeleton.Input active /> : (
                <Select
                  mode="multiple"
                  allowClear
                >
                  {
                      groups?.map(({ _id, name }: any) => (
                        <Select.Option value={_id} key={_id}>
                          {name}
                        </Select.Option>
                      ))
                  }
                </Select>
                  )}
            </FormItem> 
                <FormItem
                  hidden 
                  // label="Nhóm người dùng"
                  name="userId"
                >
                </FormItem> 
          </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin vị trí"}>
          <Row
            gutter={48}
            align="middle"
            justify="space-between"
            className="employee-form__logo-row"
          >
            <Col span={12}>
              <FormItem label="Vị trí" name="employeeLevel">
                <Select options={EMPLOYEE_LEVEL_OPTIONS} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Vùng nhận lương" name="baseSalary">
              <Select options={OPTION_AREA}/>
              </FormItem>
            </Col>
          </Row>
        </BaseBorderBox>
        <Account
          isLoading={isLoading} required={id ? false : true}
          statusAccount={statusAccount}
          setStatusAccount={setStatusAccount}
        />
        <Row gutter={10} align="middle" justify={"center"}>
          <Col span={2}>
            <Button onClick={handleCloseModal}>Huỷ</Button>
          </Col>
          <WithPermission permission={id ? POLICIES.UPDATE_EMPLOYEE : POLICIES.WRITE_EMPLOYEE}>
          <Col span={4}>
            <Button type="primary" htmlType="submit" loading={isSubmitLoading}>
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Col>
          </WithPermission>
        </Row>
      </Form>
    </div>
  );
}
