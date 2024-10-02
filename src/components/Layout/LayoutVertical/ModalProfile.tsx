import { UploadOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Form,
  FormItemProps,
  Input,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { unset } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import Account from "~/components/common/Account";
import AddressFormSection from "~/components/common/AddressFormSection";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import UploadImage from "~/components/common/Upload/UploadImage";
import { useGetProfile } from "~/modules/auth/auth.hook";

const { Option } = Select;

interface ModalProfileProps {
  onCloseForm?: () => void;
  handleUpdateProfile?: any;
  isLoadingSubmit?: boolean;
}
const FormItemProp: FormItemProps = {
  labelAlign: "left",
};
const ModalProfile: React.FC<ModalProfileProps> = ({
  onCloseForm,
  handleUpdateProfile,
  isLoadingSubmit,
}) => {
  const [form] = Form.useForm();
  const profile = useGetProfile();
  const [logo, setLogo] = useState<string | undefined>();
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [statusAccount, setStatusAccount] = useState<"ACTIVE" | "INACTIVE">(
    "INACTIVE"
  );
  const id = useMemo(() => profile?.user?._id, [profile?.user?._id]);

  const [cityCode, setCityCode] = useState<string | undefined>();
  const [districtCode, setDistrictCode] = useState<string | undefined>();
  const onValuesChange = async ({ address, fullName, ...rest }: any) => {
    const shouldResetDistrictAndWards = address && address.cityId;
    if (shouldResetDistrictAndWards) {
      form.setFieldsValue({
        address: {
          districtId: null,
          wardId: null,
        },
      });
    }
    const shouldResetWards = address && address.districtId;
    if (shouldResetWards) {
      form.setFieldsValue({
        address: {
          wardId: null,
        },
      });
    }
  };
  const onFinish = (values: any) => {
    const { groups, ...rest } = values;
    const user = {
      ...rest,
      avatar: logo,
      id: profile?._id,
    };
    if (statusAccount === "INACTIVE") {
      unset(user, "password");
      unset(user, "confirmPassword");
      // unset(user, 'updateAccount');
    }
    handleUpdateProfile(user);
    // onCloseForm()
  };

  //Handle avatar
  const handleChange = useCallback(
    (imageUrl: string) => {
      setLogo(imageUrl);
    },
    [logo]
  );

  useEffect(() => {
    form.resetFields();
    if (profile) {
      const newData = {
        address: { ...profile?.address },
        email: profile?.email,
        fullName: profile?.fullName,
        phoneNumber: profile?.phoneNumber,
        gender: profile?.gender,
        username: profile?.user?.username,
        baseSalary: profile?.baseSalary,
        employeeLevel: profile?.employeeLevel,
      };
      form.setFieldsValue(newData);
      setDistrictCode(profile?.address?.districtId);
      setCityCode(profile?.address?.cityId);
      setLogo(profile?.avatar);
    }

    if (profile?.avatar) {
      setLogo(profile?.avatar);
    }

    if (profile?.address) {
      setCityCode(profile?.address.cityId);
      setDistrictCode(profile?.address.districtId);
    }
  }, [profile, form]);

  const render = (component: any) => {
    return isLoadingSubmit ? <Spin /> : component;
  };

  return (
    <div className="modal-profile">
      <Row align="top" justify="center" wrap={false}>
        <Col
          sm={{ span: 24 }}
          md={{ span: 9 }}
          style={{ alignSelf: "center", textAlign: "center" }}
        >
          <Avatar
            src={logo}
            shape="circle"
            style={{
              objectFit: "contain",
              fontSize: 80,
              textTransform: "uppercase",
            }}
            size={280}
            alt="avatar"
          ></Avatar>
          <UploadImage
            className="upLoadAvatar"
            imgUrl={logo}
            onChange={handleChange}
            isShowImg={false}
            setIsLoading={setIsLoadingAvatar}
          >
            {render(
              <Button
                loading={isLoadingAvatar}
                type="text"
                style={{ backgroundColor: "#c8c8c8", borderRadius: 10 }}
                icon={<UploadOutlined />}
              ></Button>
            )}
          </UploadImage>
        </Col>
        <Col flex={1}>
          <Form
            form={form}
            labelCol={{ md: { span: 6 } }}
            requiredMark={false}
            scrollToFirstError
            onValuesChange={onValuesChange}
            autoComplete="off"
            onFinish={onFinish}
          >
            {
              <BaseBorderBox
                style={{ paddingBottom: 8 }}
                title={<h5>Thông tin người dùng</h5>}
              >
                <Form.Item
                  {...FormItemProp}
                  name={"fullName"}
                  label="Tên nhân viên"
                >
                  {render(<Input></Input>)}
                </Form.Item>
                <Form.Item {...FormItemProp} name={"gender"} label="Giới tính">
                  {render(
                    <Select>
                      <Option value="M" key="male">
                        Nam
                      </Option>
                      <Option value="F" key="female">
                        Nữ
                      </Option>
                    </Select>
                  )}
                </Form.Item>

                <AddressFormSection
                  span={24}
                  isLoading={isLoadingSubmit}
                  form={form}
                  cityCode={cityCode}
                  setCityCode={setCityCode}
                  districtCode={districtCode}
                  setDistrictCode={setDistrictCode}
                />
              </BaseBorderBox>
            }
            <BaseBorderBox title={<h5>Thông tin tài khoản </h5>}>
              {render(
                <Account
                  required={statusAccount === "ACTIVE"}
                  setStatusAccount={setStatusAccount}
                  statusAccount={statusAccount}
                />
              )}
            </BaseBorderBox>
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
                marginTop: 14,
              }}
            >
              <Button
                htmlType="submit"
                type="primary"
                loading={isLoadingSubmit || isLoadingAvatar}
              >
                Cập nhật
              </Button>
              <Button
                htmlType="button"
                loading={isLoadingSubmit}
                onClick={onCloseForm}
              >
                Huỷ
              </Button>
            </Space>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
export default ModalProfile;
