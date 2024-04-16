import {
  Badge,
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useResetState } from "~/utils/hook";
import { collaboratorActions } from "../redux/reducer";
import { useParams } from "react-router-dom";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import { useFetchState } from "~/utils/helpers";
import { get, omit } from "lodash";
import useNotificationStore from "~/store/NotificationContext";
import { useGetCollaborator } from "../collaborator.hook";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import Account from "~/components/common/Account";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import AddressFormSection from "~/components/common/AddressFormSection";
import UploadImage from "~/components/common/Upload/UploadImage";
import { InfoCircleTwoTone } from "@ant-design/icons";
import apis from "~/modules/user/user.api";
import { validatePhoneNumberAntd } from "~/utils/validate";

const FormItem = Form.Item;
const { Option } = Select;
interface IProps {
  id?: string | null;
  handleCloseModal: () => void;
  handleUpdate?: any;
  resetAction?: any;
  handleCreate?: any;
  isSubmitLoading?: boolean;
}
export default function CollaboratorForm(props: IProps) {
  const [form] = Form.useForm();
  const { id, handleCloseModal, handleUpdate, handleCreate, isSubmitLoading } =
    props;
  const [imageUrl, setImageUrl] = useState<string>();

  const [loadingValidateUsername, setLoadingValidateUsername] =
    useState<boolean>(false);
  const [statusAccount, setStatusAccount] = useState("INACTIVE");
  useResetState(collaboratorActions.resetAction);
  //address
  const [cityCode, setCityCode] = useState(null);
  const [districtCode, setDistrictCode] = useState(null);
  // hook
  const { branchId }: any = useParams();
  const branchIdParam = useMemo(
    () => ({ branchId: branchId ? branchId : DEFAULT_BRANCH_ID }),
    [branchId]
  );

  const [groups, isLoadingGroups] = useFetchState({
    api: apis.getListEmployeeGroup,
    query: branchIdParam,
    useDocs: false,
  });
  // const
  const [collaborator, isLoading] = useGetCollaborator(id);
  const { onNotify } = useNotificationStore();

  useEffect(() => {
    if (collaborator) {
      setCityCode(collaborator?.address?.cityId);
      setDistrictCode(collaborator?.address?.districtId);
      form.setFieldsValue(collaborator);
      setImageUrl(collaborator?.avatar);
    }
    if (!id) {
      form.setFieldsValue({
        address: {
          cityId: null,
          districtId: null,
          wardId: null,
        },
      });
      form.resetFields();
    }
  }, [id, collaborator]);

  const onFinish = (values: any) => {
    const collaborator = {
      ...values,
      avatar: imageUrl,
    };

    if (id) {
      const data: object = {
        ...collaborator,
        _id: id,
        avatar: imageUrl,
      };

      if (statusAccount === "ACTIVE") {
        handleUpdate({ ...data });
      } else {
        handleUpdate({
          ...omit(data, ["username", "password", "confirmPassword"]),
        });
      }
    } else {
      handleCreate({ ...omit(collaborator, ["userId", "updateAccount"]) });
    }
  };

  const onValuesChange = ({ address }: any) => {
    if (address) {
      if (address.cityId) {
        form.setFieldsValue({
          address: {
            districtId: null,
            wardId: null,
          },
        });
      } else if (address.districtId) {
        form.setFieldsValue({
          address: {
            wardId: null,
          },
        });
      }
    }
  };

  const onFocusOutFullName = async () => {
    const fullName = form.getFieldValue("fullName");
    if (!id && fullName) {
      // Only Create
      try {
        setLoadingValidateUsername(true);
        const username = await apis.validateUsername({
          fullName: fullName?.trim(),
        });
        form.setFieldsValue(username);
        setLoadingValidateUsername(false);
      } catch (error) {
        setLoadingValidateUsername(false);
        onNotify?.error("Lỗi khi lấy dữ liệu từ máy chủ");
      }
    }
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
        {`${!id ? "Tạo mới " : "Cập nhật"}`} cộng tác viên
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
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Xin mời nhập tên trình dược viên!",
                      },
                    ]}
                  >
                    {isLoading ? (
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
                    label="SDT người mời"
                    name="referralCode"
                  >
                    {!id ? (isLoading ? <Skeleton.Input active /> : <Input />) : <Input disabled />}
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <FormItem
                label={
                  <Tooltip
                    placement="topLeft"
                    // zIndex={2001}
                    title={<p>Phải chọn nhóm Cộng tác viên</p>}
                  >
                    <Badge
                      size="small"
                      color="#9B9999"
                      offset={[14, 4]}
                      count={<InfoCircleTwoTone />}
                    >
                      <span>Nhóm </span>
                    </Badge>
                  </Tooltip>
                }
                name="groups"
                rules={[
                  {
                    required: false,
                    message: "Xin vui lòng chọn nhóm cộng tác viên!",
                  },
                ]}
              >
                {isLoading || isLoadingGroups ? (
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
              <FormItem
                hidden
                // label="Nhóm người dùng"
                name="userId"
              ></FormItem>
            </Col>
          </Row>
        </BaseBorderBox>

        <Account
          isLoading={isLoading}
          required={id ? false : true}
          statusAccount={statusAccount}
          setStatusAccount={setStatusAccount}
        />
        <Row gutter={10} align="middle" justify={"center"}>
          <Col span={2}>
            <Button onClick={handleCloseModal}>Huỷ</Button>
          </Col>
          <WithPermission
            permission={id ? POLICIES.UPDATE_PARTNER : POLICIES.WRITE_PARTNER}
          >
            <Col span={4}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitLoading}
              >
                {id ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Col>
          </WithPermission>
        </Row>
      </Form>
    </div>
  );
}
