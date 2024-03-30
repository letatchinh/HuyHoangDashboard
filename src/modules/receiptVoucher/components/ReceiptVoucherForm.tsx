import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import "./form.scss";
import DebounceSelect from "~/components/common/DebounceSelect";
import {
  COMPONENT_MODES,
  DEFAULT_BRANCH_ID,
  LANGUAGE,
  REF_COLLECTION,
  TYPE_VOUCHER,
  WH_PAYMENT_METHOD,
  WH_PAYMENT_METHOD_VI,
  WH_VOUCHER_ACTION_NAME,
  WH_VOUCHER_STATUS,
} from "~/constants/defaultValue";
import HistoryLogs from "~/modules/vouchers/components/HistoryLog";
import AccountingDetails from "~/modules/vouchers/components/AccountingDetailTable/AccountingDetailTable";
import { useDispatch } from "react-redux";
import { useConfirmReceiptVoucher, useCreateReceiptVoucher, useGetReceiptVoucher, useInitWhReceiptVoucher, useResetAction, useUpdateReceiptVoucher } from "../receiptVoucher.hook";
import { compactAddress, concatAddress } from "~/utils/helpers";
import dayjs from "dayjs";
import { omit, unset, get, sumBy } from "lodash";
import { CheckOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import apiEmployee from "~/modules/employee/employee.api";
import apiStaff from "~/modules/user/user.api";
import apiReceiptVoucher from "~/modules/receiptVoucher/receiptVoucher.api";
import { useGetPharmacyId } from "~/modules/pharmacy/pharmacy.hook";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useGetBranch, useGetBranches } from "~/modules/branch/branch.hook";
import { useGetSupplier } from "~/modules/supplier/supplier.hook";
import useUpdateBillStore from "~/modules/sale/bill/storeContext/UpdateBillContext";
import WithOrPermission from "~/components/common/WithOrPermission";
import { receiptVoucherSliceAction } from "../redux/reducer";

const mainRowGutter = 24;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Option } = Select;
const DEFAULT_ACCOUNT = 1111;

type DataAccounting = {
  content? : string,
  debitAccount?:number,
  creditAccount?:number,
  amountOfMoney?:number,
}

type propsType = {
  id?: any;
  onClose?: any;
  pharmacyId?: any
  refCollection?: any;
  debt?: any;
  from?: string;
  supplierId?:any,
  dataAccountingDefault?: DataAccounting[],
  billId?:any
};

export default function ReceiptVoucher(props: propsType): React.JSX.Element {
  const { id , onClose, pharmacyId,supplierId,refCollection, debt, from,dataAccountingDefault,billId} = props;
  useResetAction();
  const [form] = Form.useForm();
  const ref = useRef();
  const [accountingDetails, setAccountingDetails] = useState([]);
  const [initEmployee, setInitEmployee] = useState<any[]>([]);
  //Hook
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(receiptVoucherSliceAction.resetAction());
  };
  const [isSubmitLoading, handleCreate] = useCreateReceiptVoucher(() => {
    onClose();
    resetAction();
  });
  const [, handleUpdate] = useUpdateReceiptVoucher(() => {
    onClose();
    resetAction();
  });
  const [, handleConfirm] = useConfirmReceiptVoucher(onClose);
  const [voucher, isLoading] = useGetReceiptVoucher(id);
  const initReceiptVoucher = useInitWhReceiptVoucher(voucher);
  const memo = useMemo(() => pharmacyId, [pharmacyId]);
  const queryBranch = useMemo(() => ({page: 1, limit: 10}), []);
  const [branch] = useGetBranches(queryBranch);
  const [pharmacy] = useGetPharmacyId(memo); 
  const [supplier] = useGetSupplier(supplierId);
  const provider = useMemo(() => pharmacy ?? supplier,[pharmacy,supplier]);

  const [dataAccounting, setDataAccounting] = useState(dataAccountingDefault ?? []);
  const { bill } = useUpdateBillStore();
  // use initWhPaymentVoucher to merge with other data that should be fetched from the API
  const mergedInitWhPaymentVoucher = useMemo(() => {
    if (!id) {
      return {
        ...initReceiptVoucher,
        originalDocument: 0,
      };
    } else {
      // do nothing
    }
    return {
      ...initReceiptVoucher,
    };
  }, [id, initReceiptVoucher]);

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
    [id]
  );

  const fetchIssueNumber = async () => {
    const typeVoucher = TYPE_VOUCHER.PT;
    const res = await apiReceiptVoucher.postIssueNumber({ typeVoucher });
    form.setFieldsValue({
      issueNumber: res?.result,
    });
  };



  useEffect(() => {
    if (!id) {
      // form.resetFields();
      if (provider) {
        form.setFieldsValue({
          name: provider?.name,
          receiver: provider?.name,
          provider: provider?._id,
          code: provider?.code,
        });
      }
    } else {
      form.setFieldsValue(
        omit(initReceiptVoucher, ['address']) //set address default is branch address
      );
      setDataAccounting(initReceiptVoucher?.accountingDetails);
    }
  }, [id, initReceiptVoucher,provider]);
  
  useEffect(() => {
    if (id && mergedInitWhPaymentVoucher ) {
      const initEmployee = {
        label: mergedInitWhPaymentVoucher?.employee?.fullName,
        value: mergedInitWhPaymentVoucher?.employee?._id
      };
      setInitEmployee([initEmployee]);
    } else {
      fetchIssueNumber()
    }
  }, [id, mergedInitWhPaymentVoucher]);
  
  //Set address default from branch 99999
  useEffect(() => {
    if (branch) {
      const findBranchWorldHealth = branch?.find(
        (item: any) => item._id === DEFAULT_BRANCH_ID
      );
      const address = concatAddress(findBranchWorldHealth?.address);
      form.setFieldsValue({address: address});
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
        ...omit(values, ["code", "address", "name"]),
        accountingDate: dayjs(accountingDate).format("YYYY-MM-DD"),
        dateOfIssue: dayjs(dateOfIssue).format("YYYY-MM-DD"),
        refCollection: refCollection ? REF_COLLECTION[refCollection] : null,
        accountingDetails: accountingDetails,
        totalAmount:sumBy([...accountingDetails],(item) => get(item,'amountOfMoney',0))
      };
      if (id) {
        if (billId || voucher?.method?.data?._id) {
          handleUpdate({ id, ...newValue,billId: billId || voucher?.method?.data?._id });
        } else {
          handleUpdate({ id, ...newValue });
        };
        handleUpdate({ id: id, ...newValue });
      } else {
        if (billId) {
          handleCreate({
            ...newValue,
            billId,
          });
        } else {
          handleCreate(newValue);
        };
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onWhVoucherStatusChange = async (status: string) => {
    confirm({
      title: `Bạn có muốn ${WH_VOUCHER_ACTION_NAME[status][LANGUAGE.VI]} phiếu này?`,
      icon: <ExclamationCircleOutlined/>,
      content: '',
      onOk() {
        const fullValues = form.getFieldsValue(true);
        switch (status) {
          case WH_VOUCHER_STATUS.CONFIRMED:
            handleConfirm({ id: id, status: WH_VOUCHER_STATUS.CONFIRMED });
            break;
          case WH_VOUCHER_STATUS.APPROVED:
            handleConfirm({ id: id, status: WH_VOUCHER_STATUS.APPROVED });
            break;
          case WH_VOUCHER_STATUS.REJECT:
            handleConfirm({ id: id, status: WH_VOUCHER_STATUS.REJECT });
            break;
          default:
            break;
        }
      },
      onCancel() { },
    });
  };

  const render = (component: any) =>
    isLoading ? <Skeleton.Input active /> : component;

  return (
    <div className="page-wraper">
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
                      label={`Mã ${from === 'Pharmacy' ? 'nhà thuốc' : ''}`}
                      labelCol={{ lg: 8 }}
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: `Vui lòng nhập mã ${from === 'Pharmacy' ? 'nhà thuốc' : ''} !`,
                        },
                      ]}
                    >
                      {render(<Input disabled />)}
                    </FormItem>
                    <FormItem hidden name="provider"></FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label={`Tên ${from === 'Pharmacy' ? 'nhà thuốc' : ''}`}
                      labelCol={{ lg: 8 }}
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: `Vui lòng chọn tên ${from === 'Pharmacy' ? 'nhà thuốc' : ''}!`,
                        },
                      ]}
                    >
                      {isLoading ? <Skeleton.Input active /> : <Input disabled/>}
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
                    <FormItem label="Địa chỉ" name={"address"}>
                      {isLoading ? (
                        <Skeleton.Input active />
                      ) : (
                        <Input disabled />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                { bill && <Row gutter={36}>
                    <Col span={24}>
                      <FormItem label="Mã đơn hàng">
                        {isLoading ? <Skeleton.Input active /> : <Input defaultValue={bill?.codeSequence} readOnly />}
                      </FormItem>
                    </Col>
                  </Row>}
                <Row gutter={36}>
                  <Col span={24}>
                    <FormItem name="reason" label="Lý do thu">
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
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Vui lòng nhập số chứng từ!',
                      //   }
                      // ]}
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
            // defaultActiveKey={'1'}
            destroyInactiveTabPane
            onChange={() => {}}
            // onTabClick={onTabClick}
          >
            <TabPane tab="Hạch toán" key={1}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <AccountingDetails
                  ref={ref}
                  mode={COMPONENT_MODES.EDIT}
                  dataSource={dataAccounting}
                  // whAppointment={whAppointment}
                  isShowSuggest={debt}
                  setAccountingDetails={setAccountingDetails}
                />
              </Space>
            </TabPane>
          </Tabs>
          <WithPermission permission={POLICIES.READ_HISTORYVOUCHER}>
          { id &&  <Collapse style={{ backgroundColor: "transparent" }} bordered={false}>
            <Collapse.Panel
              showArrow={false}
              style={{
                backgroundColor: "transparent",
                borderBottomColor: "transparent",
                marginTop: 0,
              }}
              header={
                <Typography.Link>{"(Xem chi tiết Logs)"}</Typography.Link>
              }
              key="1"
            >
              <HistoryLogs
              historyLogs={get(mergedInitWhPaymentVoucher, 'historyLogs', [])}
              />
            </Collapse.Panel>
          </Collapse>}
          </WithPermission>
          <Row className="staff-form__submit-box">
            {!id ? 
              <WithOrPermission permission={[POLICIES.UPDATE_VOUCHERPHARMACY, POLICIES.UPDATE_VOUCHERSUPPLIER]}>
              <Button icon={<SaveOutlined/>} type="primary" htmlType="submit">
                Lưu
              </Button>
              </WithOrPermission>
              :
            (get(mergedInitWhPaymentVoucher, "status") !== WH_VOUCHER_STATUS.CONFIRMED
              || get(mergedInitWhPaymentVoucher, "status") !== WH_VOUCHER_STATUS.REJECT
            )
              &&
              <WithOrPermission permission={[POLICIES.UPDATE_VOUCHERPHARMACY, POLICIES.UPDATE_VOUCHERSUPPLIER]}>
            <Button icon={<SaveOutlined/>} type="primary" htmlType="submit">
              Lưu
            </Button>
            </WithOrPermission>}

            {id &&
              (!get(mergedInitWhPaymentVoucher, "status") ||
                get(mergedInitWhPaymentVoucher, "status") ===
                  WH_VOUCHER_STATUS.CREATED) && (
                <WithPermission permission={POLICIES.UPDATE_STATUSVOUCHER}>
                <Button
                  icon={<CheckOutlined/>}
                  loading={isSubmitLoading}
                  onClick={() => onWhVoucherStatusChange(WH_VOUCHER_STATUS.CONFIRMED)}
                >
                  {
                    WH_VOUCHER_ACTION_NAME[WH_VOUCHER_STATUS.CONFIRMED][
                      LANGUAGE.VI
                    ]
                  }
                </Button>
                 </WithPermission>
              )}

            {id &&
              get(mergedInitWhPaymentVoucher, "status") ===
                WH_VOUCHER_STATUS.CONFIRMED && (
                <Space>
                  <WithPermission permission={POLICIES.UPDATE_STATUSVOUCHER}>
                  <Button
                    icon={<CheckOutlined/>}
                    loading={isSubmitLoading}
                    onClick={() =>
                      onWhVoucherStatusChange(WH_VOUCHER_STATUS.APPROVED)
                    }
                  >
                    {
                      WH_VOUCHER_ACTION_NAME[WH_VOUCHER_STATUS.APPROVED][
                        LANGUAGE.VI
                      ]
                    }
                  </Button>
                  </WithPermission>
                  <WithPermission permission={POLICIES.UPDATE_STATUSVOUCHER}>
                  <Button
                    icon={<CheckOutlined />}
                    loading={isSubmitLoading}
                    onClick={() =>
                      onWhVoucherStatusChange(WH_VOUCHER_STATUS.REJECT)
                    }
                  >
                    {
                      WH_VOUCHER_ACTION_NAME[WH_VOUCHER_STATUS.REJECT][
                        LANGUAGE.VI
                      ]
                    }
                  </Button>
                  </WithPermission>
                </Space>
              )}
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

