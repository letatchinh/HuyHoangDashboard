import { Button, Col, Form, Input, Row, Select, Skeleton } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import UploadImage from "~/components/common/Upload/UploadImage";
import AddressFormSection from "~/components/common/AddressFormSection";
import { useCreateUser, useGetUser, useUpdateUser } from "../user.hook";
import Account from "~/components/common/Account";
import apis from "../user.api";
import toastr from "toastr";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import { useResetState } from "~/utils/hook";
import { userSliceAction } from "../redux/reducer";
import {omit} from "lodash";
import { useParams } from "react-router-dom";
import { useGetUserGroups } from "~/modules/userGroup/userGroup.hook";

const { Option } = Select;

const FormItem = Form.Item;
interface IProps {
  id?: string | null;
  handleCloseModal: () => void;
  updateUser?: any;
  resetAction?: any;
};

export default function UserForm(props: IProps) {
  const [form] = Form.useForm();
  const { id, handleCloseModal, updateUser: handleUpdate , resetAction} = props;
  const [imageUrl, setImageUrl] = useState<string>();
  const [loadingValidateUsername, setLoadingValidateUsername] =
    useState<boolean>(false);
    const [statusAccount, setStatusAccount] = useState('ACTIVE');
  //address
  const [cityCode, setCityCode] = useState<string>('');
  const [districtCode, setDistrictCode] = useState<string>('');
  const [wardCode, setWardCode] = useState<string>('');

  //hook user
  const [, handleCreate] = useCreateUser(() => {
    handleCloseModal();
    resetAction();
  });
  const [user, isLoading] = useGetUser(id);

  //fetch user groups
  const { branchId }: any = useParams();
  const branchIdParam = useMemo(
    () => ({ branchId: branchId ? branchId : DEFAULT_BRANCH_ID }),
    [branchId]
  );
  const [groups, isLoadingGroups] = useGetUserGroups(branchIdParam);
  useResetState(userSliceAction.resetAction);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        username: user?.adapater?.user?.username,
        groups: user?.adapater?.groups,
        userId: user?.adapater?.userId
      });
      setImageUrl(user?.avatar);
      setCityCode(user?.address?.cityId);
      setDistrictCode(user?.address?.districtId);
      setWardCode(user?.address?.wardId);
    };
  }, [id, user]);
  
  const onFinish = (values: any) => {
    const user = {
      ...values,
      avatar: imageUrl,
      branchId: values?.branchId || DEFAULT_BRANCH_ID
    };
    if (id) {
      const data: object = {
        ...user,
        id: id
      };
      if (statusAccount === 'ACTIVE') {
        handleUpdate({...data});
      } else {
        handleUpdate({
          ...omit(data,['username', 'password', 'confirmPassword']),
        });
      };
    } else {
      handleCreate({...omit(user, ['userId'])});
    };
  };

  const onValuesChange = ({ address }: any) => {};

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
        toastr.error("Lỗi khi lấy dữ liệu từ máy chủ");
      };
    };
  };

  return (
    <div className="employee-form">
      <h4 style={{ marginRight: "auto", paddingLeft: 27 }}>
        {`${!id ? "Tạo mới " : "Cập nhật"} người dùng`}
      </h4>
      <Form
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        scrollToFirstError
        requiredMark={false}
        // initialValues={initUser}
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
      >
        <Row
          gutter={48}
          align="middle"
          justify="space-between"
          className="user-form__logo-row"
        >
          <Col span={12}>
            <Row gutter={36}>
              <Col span={24}>
                <FormItem
                  label="Họ và tên nhân viên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Xin mời nhập tên nhân viên!" },
                  ]}
                >
                  {isLoading || loadingValidateUsername ? (
                    <Skeleton.Input active />
                  ) : (
                    <Input onBlur={onFocusOutFullName} />
                  )}
                </FormItem>
              </Col>
            </Row>

            <FormItem label="Giới tính" name="gender">
              {isLoading ? (
                <Skeleton.Input active />
              ) : (
                <Select>
                  <Option value="M" key="male">
                    Nam
                  </Option>
                  <Option value="F" key="female">
                    Nữ
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12} className="employee-form__upload-logo">
            <UploadImage setImageUrl={setImageUrl} imageUrl={imageUrl} />
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
          className="user-form__logo-row"
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
                  label="Nhóm người dùng"
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
                  //save state userId when id is exits and not show on form
                  label="Nhóm người dùng"
                  name="userId"
                >
                </FormItem> 
          </Col>
        </Row>
        <Account
          isLoading={isLoading} required={id ? false : true}
          setStatusAccount={setStatusAccount}
          statusAccount={statusAccount}
        />
        <Row gutter={10} align="middle" justify={"center"}>
          <Col span={2}>
            <Button>Huỷ</Button>
          </Col>
          <Col span={4}>
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
