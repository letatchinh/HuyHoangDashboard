import {
  Badge,
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Skeleton,
  Tooltip,
} from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResetState } from "~/utils/hook";
import { collaboratorActions } from "../redux/reducer";
import { useParams } from "react-router-dom";
import { DEFAULT_BRANCH_ID, requireRules } from "~/constants/defaultValue";
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
import { CalendarOutlined, InfoCircleTwoTone } from "@ant-design/icons";
import apis from "~/modules/user/user.api";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";

const FormItem = Form.Item;
const { Option } = Select;
interface IProps {
  id?: string | null;
  handleCloseModal: () => void;
  handleUpdate?: any;
  handleCreate?: any;
  isSubmitLoading?: boolean;
  query?: any;
}
export default function CollaboratorForm(props: IProps) {
  const refMonth : any = useRef();
  const refYear : any = useRef();
  const [form] = Form.useForm();
  const [formSaleChannel] = Form.useForm();
  const { id, handleCloseModal, handleUpdate, handleCreate, isSubmitLoading, query } =
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
    api: apis.getListPartnerGroup,
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

  const onValuesChange = ({ address,birthDate }: any,values:any) => {
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
    };

    if(birthDate){
      const onlyNumber = (any:any) => {
        if(!any) return 0
        return Number(String(any)?.replaceAll(/[^0-9]/g, ''));
      }
      const date = birthDate?.date;
      const month = birthDate?.month;
      if(date){
        if(String(date).length >= 2){
          refMonth.current?.focus()
        }
      }
      if(month){
        if(String(month).length >= 2){
          refYear.current?.focus()
        }
      };
      
      let newDate = onlyNumber(values?.birthDate?.date);
      if(newDate < 0 || newDate > 31){
        newDate = 1
      }
      let newMonth = onlyNumber(values?.birthDate?.month);
      if(newMonth < 0 || newMonth > 12){
        newMonth = 1
      }
      let newYear = onlyNumber(values?.birthDate?.year);
      if(String(newYear).length > 4){
        newYear = 1998
      }
      form.setFieldsValue({
        birthDate : {
          date : newDate,
          month : newMonth,
          year : newYear,
          fullText : [newDate,newMonth,newYear].join('/')
        }
      })
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
      <Form
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        scrollToFirstError
        requiredMark={false}
        initialValues={{
          fee: [
            {
              typeFee: "SUB_FEE",
              value: 0,
              typeValue: "PERCENT",
            },
          ],
        }}
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
                  <FormItem label="SDT người mời" name="referralCode">
                    {(!id || !get(collaborator,'referralCode')) ? (
                      isLoading ? (
                        <Skeleton.Input active />
                      ) : (
                        <Input />
                      )
                    ) : (
                      <Input disabled />
                    )}
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
                    title={<p>Phải chọn nhóm khách hàng</p>}
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
                    message: "Xin vui lòng chọn nhóm khách hàng!",
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

          <Form.List
            name="fee"
          >
            {(fields, {}) => (
              <>
                {fields.map((field, index) => (
                  <Row
                    gutter={48}
                    align="middle"
                    justify="space-between"
                    className="employee-form__logo-row"
                  >
                    <Col span={12}>
                      <Flex justify={'space-between'} align='center'>
                        <FormItem
                          label="Phụ phí bán hàng"
                          name={[index, "value"]}
                          rules={[
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (getFieldValue(['fee',index,'typeValue']) === 'PERCENT' && value > 100) {
                                  return Promise.reject(new Error('Phần trăm phải bé hơn 100%!'));
                                }
                                return Promise.resolve();
                              
                              }
                            })
                          ]}
                        >
                          {isLoading ? (
                            <Skeleton.Input active />
                          ) : (
                            <InputNumberAnt addonAfter={<FormItem style={{marginBottom : 'unset'}} name={[index, "typeValue"]}>
                            <Radio.Group size="small" buttonStyle="solid">
                                <Radio.Button value="PERCENT">%</Radio.Button>
                                <Radio.Button value="VALUE">Giá trị</Radio.Button>
                              </Radio.Group>
                            </FormItem>}/>
                          )}
                        </FormItem>
                        
                      </Flex>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>
          <Row
            gutter={48}
            align="middle"
            justify="space-between"
            className="employee-form__logo-row"
          >
            <Col span={12}>
              <FormItem label="Nghề nghiệp" name="career">
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Nơi công tác" name="workplace">
                <Input />
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
            <FormItem name={['birthDate','fullText']} hidden />
              <FormItem label="Ngày sinh">
                <Flex justify={'end'} align={'center'} gap={2}>
                <FormItem rules={[
                  () => ({
                    validator(_, value) {
                      if (Number(value) < 1 || !String(value).length) {
                        return Promise.reject(new Error(''));
                        
                      }
                      return Promise.resolve();
                    }
                  })

                ]} style={{marginBottom : 'unset'}} name={['birthDate','date']}><Input placeholder="Ngày"  inputMode="numeric"/></FormItem> /
                <FormItem
                rules={[
                  () => ({
                    validator(_, value) {
                      if (Number(value) < 1 || !String(value).length) {
                        return Promise.reject(new Error(''));
                        
                      }
                      return Promise.resolve();
                    }
                  })

                ]}
                style={{marginBottom : 'unset'}} name={['birthDate','month']}><Input placeholder="Tháng" inputMode="numeric" ref={refMonth} /></FormItem> /
                <FormItem
                rules={[
                  () => ({
                    validator(_, value) {
                      if (String(value).length !== 4 ) {
                        return Promise.reject(new Error(''));
                        
                      }
                      return Promise.resolve();
                    }
                  })
                ]}
                style={{marginBottom : 'unset'}} name={['birthDate','year']}><Input placeholder="Năm" inputMode="numeric" ref={refYear}/></FormItem>
                </Flex>
              </FormItem>
            </Col>
            <Col span={12}>
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
                >
                  <SelectSaleChannel
                    validateFirst={false}
                    form={formSaleChannel}
                    // style={{ width: 200 }}
                    showIcon={false}
                    size={"middle"}
                    defaultValue={query?.salesChannelId || null}
                    divisionText="B2C"
                    // onChange={(value) => onParamChange({ salesChannelId: value })}
                  />
                </FormItem>
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
