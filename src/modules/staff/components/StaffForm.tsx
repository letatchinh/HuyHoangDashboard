import { Button, Col, Form, Input, Row, Select, Skeleton } from "antd";
import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import Account from "~/components/common/Account";
import AddressFormSection from "~/components/common/AddressFormSection";
import UploadImage from "~/components/common/Upload/UploadImage";
import { useGetStaff } from "../staff.hook";
type propsType = {
  id?: string | null;
  onClose: any;
  onCreate: any;
  onUpdate: any;
};

const { Option } = Select;
const FormItem = Form.Item;

export default function StaffForm({
  id,
  onClose,
  onCreate,
  onUpdate,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [staff, isLoading] = useGetStaff(id);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [statusAccount, setStatusAccount] = useState<"ACTIVE" | "INACTIVE">(
    id ? 'INACTIVE' : "ACTIVE"
  );
  const [cityCode, setCityCode] = useState<string>("");
  const [districtCode, setDistrictCode] = useState<string>("");
  const [wardCode, setWardCode] = useState<string>("");
  useEffect(() => {
    if (id) {
      form.setFieldsValue(staff);
      setImageUrl(staff?.avatar);
      setCityCode(staff?.address?.cityId);
      setDistrictCode(staff?.address?.districtId);
      setWardCode(staff?.address?.wardId);
    } else {
      form.resetFields();
    }
  }, [staff, id]);
  const onFinish = (values: any) => {
    try {
      const user = {
        ...values,
        avatar: imageUrl,
        idNumber: values?.idNumber || "",
      };
      if (id) {
        const data: object = {
          ...user,
          id: id,
        };
        if (statusAccount === "ACTIVE") {
          onUpdate({ ...data });
        } else {
          onUpdate({
            ...omit(data, ["userName", "password", "confirmPassword"]),
          });
        }
      } else {
        onCreate({ ...omit(user, ["userId", "updateAccount"]) });
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const onValuesChange = ({ address }: any) => {};

  return (
    <Form
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      scrollToFirstError
      requiredMark={false}
      labelAlign="left"
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
                {isLoading ? <Skeleton.Input active /> : <Input />}
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
          <UploadImage
            resource="user"
            imgUrl={""}
            // onChange={handleChange}
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
        required={false}
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
        {/* <Col span={12}>
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
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Select mode="multiple" allowClear>
                {groups?.map(({ _id, name }: any) => (
                  <Select.Option value={_id} key={_id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem hidden label="Nhóm người dùng" name="userId"></FormItem>
        </Col> */}
      </Row>
      {
        <Account
          isLoading={isLoading}
          required={statusAccount === "ACTIVE" ? true : false}
          setStatusAccount={setStatusAccount}
          statusAccount={statusAccount}
        />
      }
      {
        <Row
          style={{ width: "50%", margin: " 0 auto" }}
          gutter={10}
          align="middle"
          justify={"center"}
        >
          <Col>
            <Button onClick={onClose}>Huỷ</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Col>
        </Row>
      }
    </Form>
  );
}
