import { CheckOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SaveOutlined } from "@ant-design/icons";
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
    Typography
} from "antd";
import dayjs from "dayjs";
import { get, omit, sumBy } from "lodash";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Link } from "react-router-dom";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import DebounceSelect from "~/components/common/DebounceSelect";
import WithPermission from "~/components/common/WithPermission";
import {
    COMPONENT_MODES, LANGUAGE,
    REF_COLLECTION,
    TYPE_VOUCHER,
    WH_PAYMENT_METHOD,
    WH_PAYMENT_METHOD_VI,
    WH_VOUCHER_ACTION_NAME,
    WH_VOUCHER_STATUS
} from "~/constants/defaultValue";
import apiPaymentVoucher from "~/modules/paymentVoucher/paymentVoucher.api";
import { useGetPharmacyId } from "~/modules/pharmacy/pharmacy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import { useGetSupplier } from "~/modules/supplier/supplier.hook";
import apiStaff from "~/modules/user/user.api";
import { concatAddress } from "~/utils/helpers";
import AccountingDetails from "../../vouchers/components/AccountingDetailTable/AccountingDetailTable";
import HistoryLogs from "../../vouchers/components/HistoryLog";
import {
    useConfirmPaymentVoucher,
    useCreatePaymentVoucher,
    useGetPaymentVoucher,
    useInitWhPaymentVoucher,
    useResetAction,
    useUpdatePaymentVoucher
} from "../paymentVoucher.hook";
import "./form.scss";
import useUpdateOrderSupplierStore from "~/modules/sale/orderSupplier/storeContext/UpdateOrderSupplierContext";
import WithOrPermission from "~/components/common/WithOrPermission";
import { useDispatch } from "react-redux";
import { paymentVoucherSliceAction } from "../redux/reducer";
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
    supplierId?: any;
    pharmacyId?: any;
    refCollection?: string;
    debt?: number | null;
    dataAccountingDefault? : DataAccounting[],
    method?: any,
    billId?: any,
    mutateOrderSupplier?: any
  };
  
  export default function PaymentVoucherForm(
    props: propsType
  ): React.JSX.Element {
    useResetAction();
    const { id, supplierId, onClose, refCollection, debt, pharmacyId, dataAccountingDefault, method, billId,mutateOrderSupplier } = props;
    const [form] = Form.useForm();
    const ref = useRef();
    const [accountingDetails, setAccountingDetails] = useState([]);
    const [initEmployee, setInitEmployee] = useState<any[]>([]);
    //Hook
    const dispatch = useDispatch();
    const resetAction = () => {
      return dispatch(paymentVoucherSliceAction.resetAction());
    };
    const [isSubmitLoading, handleCreate] = useCreatePaymentVoucher(() => {
      onClose();
      mutateOrderSupplier && mutateOrderSupplier();
      resetAction();
    });
    const [, handleUpdate] = useUpdatePaymentVoucher(() => {
      onClose();
      resetAction();
    });
    const [, handleConfirm] = useConfirmPaymentVoucher(onClose);
    const [voucher, isLoading] = useGetPaymentVoucher(id);
    const initPaymentVoucher = useInitWhPaymentVoucher(voucher);
    const [supplier] = useGetSupplier(supplierId);
    const [pharmacy] = useGetPharmacyId(pharmacyId);
    const provider = useMemo(() => pharmacy ?? supplier,[pharmacy,supplier]);
    const [issueNumber, setIssueNumber] = useState(null);
    const [dataAccounting, setDataAccounting] = useState(dataAccountingDefault ?? []);
    const { orderSupplier } = useUpdateOrderSupplierStore();
    const isSupplier = useMemo(() => refCollection === 'supplier',[refCollection]);
    // use initWhPaymentVoucher to merge with other data that should be fetched from the API
    const mergedInitWhPaymentVoucher = useMemo(() => {
      if (!id) {
        return {
          ...initPaymentVoucher,
          originalDocument: 0,
        };
      } else {
        // do nothing
      }
      return {
        ...initPaymentVoucher,
      };
    }, [id, initPaymentVoucher]);
  
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
      const typeVoucher = TYPE_VOUCHER.PC;
      const res = await apiPaymentVoucher.postIssueNumber({ typeVoucher });
      setIssueNumber(res?.result);
      return res?.result;
    };
  
  
    useEffect(() => {
      if (!id) {
        if (provider) {
          form.setFieldsValue({
            name: provider?.name,
            receiver: provider?.name,
            provider: provider?._id,
            code: provider?.code,
          });
          const address = concatAddress(provider?.address);
          form.setFieldsValue({address: address});
        };
      } else {
        form.setFieldsValue(initPaymentVoucher);
        setDataAccounting(initPaymentVoucher?.accountingDetails);
      };
    }, [provider, supplierId, id, initPaymentVoucher]);
  
    useEffect(() => {
      if (id && mergedInitWhPaymentVoucher ) {
        const initEmployee = {
          label: mergedInitWhPaymentVoucher?.employee?.fullName,
          value: mergedInitWhPaymentVoucher?.employee?._id
        };
        setInitEmployee([initEmployee]);
      } else {
          fetchIssueNumber().then((issueNumber) => {
          form.setFieldsValue({
            issueNumber
          });
        });
      };
    }, [id, mergedInitWhPaymentVoucher]);
  
    // useEffect(() => {
    //   if (branch) {
    //     const findBranchWorldHealth = branch?.find(
    //       (item: any) => item._id === DEFAULT_BRANCH_ID
    //     );
    //     const address = concatAddress(findBranchWorldHealth?.address);
    //     form.setFieldsValue({address: address});
    //   };
    // }, [branch]);
  
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
          totalAmount:sumBy([...accountingDetails],(item) => get(item,'amountOfMoney',0)),
          method
        };
        if (id) {
          if (billId || voucher?.method?.data?._id) {
            handleUpdate({ id, ...newValue,billId: billId || voucher?.method?.data?._id });
          } else {
            handleUpdate({ id, ...newValue });
          }
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
        icon: <ExclamationCircleOutlined />,
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
                        label={`Mã ${isSupplier ? "Nhà cung cấp" : "Khách hàng"}`}
                        labelCol={{ lg: 8 }}
                        name="code"
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập mã ${isSupplier ? "Nhà cung cấp" : "Khách hàng"}!`,
                          },
                        ]}
                      >
                        {render(<Input disabled />)}
                      </FormItem>
                      <FormItem hidden name="provider"></FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem
                        label={`Tên ${isSupplier ? "Nhà cung cấp" : "Khách hàng"}`}
                        labelCol={{ lg: 8 }}
                        name="name"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Vui lòng chọn tên nhà cung cấp!",
                        //   },
                        // ]}
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
  
                { orderSupplier && <Row gutter={36}>
                    <Col span={24}>
                      <FormItem label="Mã đơn hàng">
                        {isLoading ? <Skeleton.Input active /> : <Input defaultValue={orderSupplier?.codeSequence} readOnly />}
                      </FormItem>
                    </Col>
                  </Row>}
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
                 <Button icon={<SaveOutlined />} type="primary" htmlType="submit">
                   Lưu
                   </Button>
                </WithOrPermission>
                : (get(mergedInitWhPaymentVoucher, "status") !== WH_VOUCHER_STATUS.CONFIRMED
                || get(mergedInitWhPaymentVoucher, "status") !== WH_VOUCHER_STATUS.REJECT
                )
                &&  <WithOrPermission permission={[POLICIES.UPDATE_VOUCHERPHARMACY, POLICIES.UPDATE_VOUCHERSUPPLIER]}>
                <Button icon={<SaveOutlined />} type="primary" htmlType="submit">
                Lưu
                </Button>
                </WithOrPermission>}
  
              {id &&
                (!get(mergedInitWhPaymentVoucher, "status") ||
                  get(mergedInitWhPaymentVoucher, "status") ===
                    WH_VOUCHER_STATUS.CREATED) && (
                <WithPermission permission={POLICIES.UPDATE_STATUSVOUCHER}>
                  <Button
                    icon={<CheckOutlined />}
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
                get(mergedInitWhPaymentVoucher, "status") ==
                  WH_VOUCHER_STATUS.CONFIRMED && (
                  <Space>
                    <WithPermission permission={POLICIES.UPDATE_STATUSVOUCHER}>
                    <Button
                      icon={<CheckOutlined />}
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
                  ? <Button icon={<CloseCircleOutlined />} onClick={onClose}>Đóng</Button>
                    :
                    (
                    <Link to={'/supplier'}>
                      <Button icon={<CloseCircleOutlined />}>Đóng</Button>
                    </Link>
                  )
              )}

            </Row>
          </Form>
        </div>
      </div>
    );
  }
  