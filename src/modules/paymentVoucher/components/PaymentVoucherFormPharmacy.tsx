import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Alert,
    Button,
    Col, DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    Select,
    Skeleton,
    Space,
    Tabs
} from "antd";
import dayjs from "dayjs";
import { get, omit, sumBy } from "lodash";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import DebounceSelect from "~/components/common/DebounceSelect";
import WithPermission from "~/components/common/WithPermission";
import {
    COMPONENT_MODES,
    DEFAULT_BRANCH_ID, REF_COLLECTION,
    TYPE_VOUCHER,
    WH_PAYMENT_METHOD,
    WH_PAYMENT_METHOD_VI
} from "~/constants/defaultValue";
import { useGetBranches } from "~/modules/branch/branch.hook";
import apiPaymentVoucher from "~/modules/paymentVoucher/paymentVoucher.api";
import { useGetPharmacyId } from "~/modules/pharmacy/pharmacy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import apiStaff from "~/modules/user/user.api";
import { useGetProfileUser } from "~/modules/user/user.hook";
import AccountingDetails from "~/modules/vouchers/components/AccountingDetailTable/AccountingDetailTable";
import { concatAddress } from "~/utils/helpers";
import { useCreatePaymentVoucher, useResetAction } from "../paymentVoucher.hook";
import "./form.scss";
  const isLoading = false;
  const mainRowGutter = 24;
  const FormItem = Form.Item;
  const { TabPane } = Tabs;
  const { Option } = Select;
  const DEFAULT_ACCOUNT = 1111;
  type initDataType = {
    pharmacyId?: any
    refCollection?: any;
    debt?: any;
    method? : any;
    totalAmount? : number;
  }
  type propsType = {
    onClose?: any;
    initData : initDataType,
    callback?:any
  };
  
  export default function PaymentVoucherFormPharmacy(props: propsType): React.JSX.Element {
    useResetAction();

    const { onClose, initData,callback} = props;
    const [profile] = useGetProfileUser();
    const {debt,pharmacyId,refCollection,method,totalAmount} = initData;
    const [form] = Form.useForm();
    const ref = useRef();
    const [accountingDetails, setAccountingDetails] = useState([]);
    const [initEmployee, setInitEmployee] = useState<any[]>([]);
    //Hook
    const callBackAfterSuccess = () => {
      onClose();
      if(callback && typeof callback === 'function'){
        callback();
      }
    }
    const [isSubmitLoading, handleCreate] = useCreatePaymentVoucher(callBackAfterSuccess);
    const memo = useMemo(() => pharmacyId, [pharmacyId]);
    const queryBranch = useMemo(() => ({page: 1, limit: 10}), []);
    const [branch] = useGetBranches(queryBranch);
    const [pharmacy] = useGetPharmacyId(memo); 
  
    const [dataAccounting, setDataAccounting] = useState([
      {
        content: `Phát thưởng luỹ kế cho nhà thuốc`,
        debitAccount: 635,
        creditAccount: DEFAULT_ACCOUNT,
        amountOfMoney: totalAmount || 0,
      },
    ]);
  
    // use initWhPaymentVoucher to merge with other data that should be fetched from the API
    const mergedInitWhPaymentVoucher = useMemo(() => {
        return {
          originalDocument: 0,
        };
    }, []);
  
    const fetchOptionEmployee = useCallback(
      async (keyword?: any) => {
        const res = await apiStaff.getAllAuthorIsVoucher({ keyword });
        const mapRes = res?.docs?.map((item: any) => ({
          label: item?.fullName,
          value: item?._id,
        }));
        setInitEmployee(mapRes);
        return mapRes;
      },
      []
    );
    const fetchIssueNumber = async () => {
      const typeVoucher = TYPE_VOUCHER.PT;
      const res = await apiPaymentVoucher.postIssueNumber({ typeVoucher });
      form.setFieldsValue({
        issueNumber: res?.result,
      });
    };
  
  
    useEffect(() => {
        // form.resetFields();
        if (pharmacy) {
          form.setFieldsValue({
            pharmacy: pharmacy?.name,
            receiver: pharmacy?.name,
            provider: pharmacy?._id,
            code: pharmacy?.code,
            paymentMethod : "COD",
            accountingDate : dayjs(),
            dateOfIssue : dayjs(),
            reason: "Chi cho nhà thuốc đạt luỹ kế",
          });
        };
        if(profile){
          fetchOptionEmployee(get(profile,'profile.fullName'));
          form.setFieldsValue({
            employeeId : get(profile,'profile._id')
          })
        }
    }, [pharmacy,profile]);
    useEffect(() => {
        fetchIssueNumber();
    }, [mergedInitWhPaymentVoucher]);
    
    //Set address default from branch 99999
    useEffect(() => {
      if (branch) {
        const findBranchWorldHealth = branch?.find(
          (item: any) => item._id === DEFAULT_BRANCH_ID
        );
        const address = concatAddress(findBranchWorldHealth?.address);
        form.setFieldsValue({pharmacyAddress: address});
      };
    }, [branch]);
    const onValuesChange = () => {
      console.log("first");
    };
    const onFinish = async (values: any) => {
      try {
        await form.validateFields();
        const fullValues = form.getFieldsValue(true);
        const { accountingDate, dateOfIssue } = fullValues;
        const newValue = {
          ...omit(values, ["code", "pharmacyAddress", "pharmacy"]),
          accountingDate: dayjs(accountingDate).format("YYYY-MM-DD"),
          dateOfIssue: dayjs(dateOfIssue).format("YYYY-MM-DD"),
          refCollection: refCollection ? REF_COLLECTION[refCollection] : null,
          accountingDetails: accountingDetails,
          totalAmount:sumBy([...accountingDetails],(item) => get(item,'amountOfMoney',0)),
          method,
        };
        
          handleCreate(newValue);
      } catch (error) {
        console.error(error);
      }
    };
  
  
    const render = (component: any) =>
      isLoading ? <Skeleton.Input active /> : component;
  
    return (
      <div className="page-wraper">
        <Alert message="Lưu ý: Phiếu này không được chỉnh sửa thông tin hạch toán" type="info" showIcon />
        <div className="container-fluid">
          <Form
            autoComplete="off"
            form={form}
            initialValues={mergedInitWhPaymentVoucher}
            labelAlign="left"
            labelCol={{ sm: 24, md: 24, lg: 4 }}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            requiredMark={false}
            scrollToFirstError
          >
            <Row
              align="top"
              className="staff-form__logo-row"
              gutter={mainRowGutter}
              justify="space-between"
            >
              <Col span={16}>
                <BaseBorderBox title={"Thông tin chung"}>
                  <Row gutter={36}>
                    <Col span={12}>
                      <FormItem
                        label={`Mã nhà thuốc`}
                        labelCol={{ lg: 8 }}
                        name="code"
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập mã nhà thuốc !`,
                          },
                        ]}
                      >
                        {render(<Input disabled />)}
                      </FormItem>
                      <FormItem hidden name="provider"></FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label={'nhà thuốc'}
                        labelCol={{ lg: 8 }}
                        name="pharmacy"
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập!`,
                          },
                        ]}
                      >
                        {isLoading ? <Skeleton.Input active /> : <Input />}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={36}>
                    <Col span={24}>
                      <FormItem label="Người nhận" name="receiver">
                        {isLoading ? <Skeleton.Input active /> : <Input />}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={36}>
                    <Col span={24}>
                      <FormItem label="Địa chỉ" name={"pharmacyAddress"}>
                        {isLoading ? (
                          <Skeleton.Input active />
                        ) : (
                          <Input disabled />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
  
                  <Row gutter={36}>
                    <Col span={24}>
                      <FormItem name="reason" label="Lý do chi">
                        {isLoading ? <Skeleton.Input active /> : <Input />}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={36}>
                    <Col span={12}>
                      <FormItem
                        name="employeeId"
                        label="Nhân viên"
                        labelCol={{ lg: 8 }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn nhân viên",
                          },
                        ]}
                      >
                        {render(
                          <DebounceSelect
                            initOptions={initEmployee}
                            fetchOptions={fetchOptionEmployee}
                            // valueKey="_id"
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <Space>
                        <FormItem
                          labelCol={{ lg: 10 }}
                          label="Kèm theo"
                          name="originalDocument"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập số chứng từ kèm theo!",
                            },
                          ]}
                        >
                          {isLoading ? (
                            <Skeleton.Input active />
                          ) : (
                            <InputNumber min={0} />
                          )}
                        </FormItem>
                        <p>chứng từ gốc</p>
                      </Space>
                    </Col>
                  </Row>
                </BaseBorderBox>
              </Col>
              <Col span={8}>
                <BaseBorderBox title={"Chứng từ"}>
                  <Row gutter={36}>
                    <Col span={24}>
                      <FormItem
                        label="Ngày hạch toán"
                        name="accountingDate"
                        labelCol={{ lg: 8 }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày hạch toán!",
                          },
                        ]}
                      >
                        {isLoading ? (
                          <Skeleton.Input active />
                        ) : (
                          <DatePicker
                            format={"DD/MM/YYYY"}
                            placeholder="Ngày hạch toán"
                            disabledDate={(current) => {
                              return current > dayjs().endOf("day");
                            }}
                          />
                        )}
                      </FormItem>
                      <FormItem
                        label="Ngày chứng từ"
                        name="dateOfIssue"
                        labelCol={{ lg: 8 }}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày chứng từ!",
                          },
                        ]}
                      >
                        {isLoading ? (
                          <Skeleton.Input active />
                        ) : (
                          <DatePicker
                            format={"DD/MM/YYYY"}
                            placeholder="Ngày chứng từ"
                            disabledDate={(current) => {
                              return current > dayjs().endOf("day");
                            }}
                          />
                        )}
                      </FormItem>
  
                      <FormItem
                        label="Số chứng từ"
                        name="issueNumber"
                        labelCol={{ lg: 8 }}
                      >
                        {isLoading ? <Skeleton.Input active /> : <Input  disabled/>}
                      </FormItem>
                      <FormItem
                        label="Phương thức thanh toán"
                        name="paymentMethod"
                        labelCol={{ lg: 12 }}
                      >
                        <Select style={{ width: "100%" }}>
                          <Option
                            value={WH_PAYMENT_METHOD.COD}
                            key={WH_PAYMENT_METHOD.COD}
                          >
                            {WH_PAYMENT_METHOD_VI.COD}
                          </Option>
                          <Option
                            value={WH_PAYMENT_METHOD.TRANSFER}
                            key={WH_PAYMENT_METHOD.TRANSFER}
                          >
                            {WH_PAYMENT_METHOD_VI.TRANSFER}
                          </Option>
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                </BaseBorderBox>
              </Col>
            </Row>
            <BaseBorderBox title={"Ghi chú"}>
              <Row>
                <Col span={24}>
                  <FormItem label="Ghi chú" name={"note"} labelCol={{ lg: 8 }}>
                    {render(<Input.TextArea />)}
                  </FormItem>
                </Col>
              </Row>
            </BaseBorderBox>
            <Tabs
              destroyInactiveTabPane
              onChange={() => {}}
            >
              <TabPane tab="Hạch toán" key={1}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <AccountingDetails
                    ref={ref}
                    mode={COMPONENT_MODES.VIEW}
                    dataSource={dataAccounting}
                    isShowSuggest={debt}
                    setAccountingDetails={setAccountingDetails}
                  />
                </Space>
              </TabPane>
            </Tabs>
            {/* <WithPermission permission={POLICIES.READ_HISTORYVOUCHER}>
            </WithPermission> */}
            <Row className="staff-form__submit-box">
              <WithPermission permission={POLICIES.UPDATE_VOUCHER}>
              <Button icon={<SaveOutlined/>} type="primary" htmlType="submit">
                Lưu
              </Button>
              </WithPermission>
  
              {isSubmitLoading ? (
                <Button disabled>Đóng</Button>
              ) : (
                onClose
                  ? <Button icon={<CloseCircleOutlined/>} onClick={onClose}>Đóng</Button>
                    :
                    (
                    <Link to={'/pharmacy'}>
                      <Button icon={<CloseCircleOutlined/>}>Đóng</Button>
                    </Link>
                  )
              )}
  
            </Row>
          </Form>
        </div>
      </div>
    );
  }
  
  