import { Button, Col, Form, Input, Row, Select, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import UploadImage from "~/components/common/Upload/UploadImage";
import AddressFormSection from "~/modules/geo/components/AddressFormSection";
import { autoCreateUsername, useCreateUser, useUpdateUser } from "../user.hook";
import Account from "~/components/common/Account";
import apis from "../user.api";
import { removeAccents } from "~/utils/helpers";
import toastr from "toastr";
const { Option } = Select;

const FormItem = Form.Item;

const verticalLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
interface IProps {
  id?: string | null;
  handleCloseModal: () => void;
}

export default function UserForm(props: IProps) {
  const [form] = Form.useForm();
  const { id, handleCloseModal } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [loadingValidateUsername, setLoadingValidateUsername] =
    useState<boolean>(false);
  //address
  const [cityCode, setCityCode] = useState();
  const [districtCode, setDistrictCode] = useState();

  //hook user
  const [isUpdateLoading, handleUpdate] = useUpdateUser();
  const [isCreateLoading, handleCreate] = useCreateUser(handleCloseModal);

  const onFinish = (values: any) => {
    console.log(values, "values");
    const user = {
      ...values,
      avatar: imageUrl,
    };

    // if (id) {
    //   handleUpdate({
    //     ...user,
    //     _id: id,
    //     // userNumber: initUser.userNumber
    //   });
    // } else {
    //   handleCreate(user);
    // }
  };

  const onValuesChange = ({ address }: any) => {};

  const onFocusOutFullName = async () => {
    const fullName = form.getFieldValue("fullName");
    if (!id && fullName) {
      // Only Create
      try {
        setLoadingValidateUsername(true);
        const username = await autoCreateUsername({
          fullName,
          callApi: (query: any) => apis.validateUsername(query),
        });
        form.setFieldsValue({
          username: removeAccents(username?.toLowerCase()),
        });
        setLoadingValidateUsername(false);
      } catch (error) {
        setLoadingValidateUsername(false);
        toastr.error("Lỗi khi lấy dữ liệu từ máy chủ");
      };
    };
  };

  // useEffect(() => {
  //   form.setFieldsValue({
  //   })
  // },[])

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
                  <Option value="male" key="male">
                    Nam
                  </Option>
                  <Option value="female" key="female">
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
          {/* <Col></Col> */}
        </Row>
        <Account isLoading={isLoading} required={id ? false : true} />
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
