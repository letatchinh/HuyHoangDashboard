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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import DebounceSelect from "~/components/common/DebounceSelect";
import {
  COMPONENT_MODES,
  LANGUAGE,
  REF_COLLECTION,
  WH_PAYMENT_METHOD,
  WH_PAYMENT_METHOD_VI,
  WH_VOUCHER_ACTION_NAME,
  WH_VOUCHER_STATUS,
} from "~/constants/defaultValue";
import AccountingDetails from "../../vouchers/components/AccountingDetailTable/AccountingDetailTable";
import HistoryLogs from "../../vouchers/components/HistoryLog";
import { toJSON } from "../../vouchers/components/parser";
import "./form.scss";
import apiEmployee from "~/modules/employee/employee.api";
import { useGetSupplier } from "~/modules/supplier/supplier.hook";
import { compactAddress } from "~/utils/helpers";
import dayjs from "dayjs";
import {
  useConfirmPaymentVoucher,
  useCreatePaymentVoucher,
  useGetPaymentVoucher,
  useInitWhPaymentVoucher,
  useResetAction,
  useUpdatePaymentVoucher,
} from "../paymentVoucher.hook";
import { get, omit } from "lodash";
import { CheckOutlined, CloseCircleOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { head } from "axios";
import { PATH_APP } from "~/routes/allPath";
import { Link } from "react-router-dom";

const mainRowGutter = 24;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Option } = Select;
const DEFAULT_ACCOUNT = 1111;

type propsType = {
  id?: any;
  onClose?: any;
  supplierId?: any;
  refCollection?: string;
};

export default function PaymentVoucherForm(
  props: propsType
): React.JSX.Element {
  useResetAction();
  const { id, supplierId, onClose, refCollection } = props;
  const [form] = Form.useForm();
  const ref = useRef();

  //Hook
  const [isSubmitLoading, handleCreate] = useCreatePaymentVoucher(onClose);
  const [, handleUpdate] = useUpdatePaymentVoucher();
  const [, handleConfirm] = useConfirmPaymentVoucher();
  const [voucher, isLoading] = useGetPaymentVoucher(id);
  const initPaymentVoucher = useInitWhPaymentVoucher(voucher);
  const [settingDocs, setSettingDocs] = useState({
    name: "CÔNG TY TNHH WORLDCARE MIỀN TRUNG",
    address: "559 Lê Văn Hiến, P. Khuê Mỹ, Q. Ngũ Hành Sơn, TP Đà Nẵng",
    isVisibleSettings: false,
  });

  const [dataAccounting, setDataAccounting] = useState([
    {
      content: `rút tiền từ ví , mã yêu cầu `,
      // content: `rút tiền từ ví , mã yêu cầu ${get(requestVoucher,'requestNumber','')}`,
      debitAccount: 635,
      creditAccount: DEFAULT_ACCOUNT,
      amountOfMoney: 0,
    },
  ]);
  const [accountingDetails, setAccountingDetails] = useState([]);
  const [initEmployee, setInitEmployee] = useState([]);

  //Hook
  const [supplier] = useGetSupplier(supplierId);

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
      arrAppointmentCancel: [],
    };
  }, [id, initPaymentVoucher]);

  const fetchOptionEmployee = useCallback(
    async (keyword?: any) => {
      const res = await apiEmployee.getAll({ keyword });
      const mapRes = res?.docs?.map((item: any) => ({
        label: item?.fullName,
        value: item?._id,
      }));
      setInitEmployee(mapRes);
      return mapRes;
    },
    [id]
  );

  useEffect(() => {
    if (!id) {
      form.resetFields();
      if (supplier) {
        form.setFieldsValue({
          supplier: supplier?.name,
          supplierReceive: supplier?.name,
          provider: supplier?._id,
          code: supplier?.code,
          supplierAddress: compactAddress(supplier?.address),
        });
      }
    } else {
      form.setFieldsValue(initPaymentVoucher);
      setDataAccounting(initPaymentVoucher?.accountingDetails);
    }
  }, [supplier, supplierId, id, initPaymentVoucher]);

  useEffect(() => {
    if (id) {
      fetchOptionEmployee();
    }
  }, [id]);
  const onValuesChange = () => {
    console.log("first");
  };
  const onFinish = async (values: any) => {
    try {
      await form.validateFields();
      const fullValues = form.getFieldsValue(true);
      const { accountingDate, dateOfIssue } = fullValues;
      const newValue = {
        ...omit(values, ["code", "supplierAddress", "supplier"]),
        accountingDate: dayjs(accountingDate).format("YYYY-MM-DD"),
        dateOfIssue: dayjs(dateOfIssue).format("YYYY-MM-DD"),
        refCollection: refCollection ? REF_COLLECTION[refCollection] : null,
        accountingDetails: accountingDetails,
      };
      if (id) {
        console.log("update");
        // handleUpdate({ ...whPaymentVoucher, id: head(id.split("&")) });
      } else {
        handleCreate(newValue);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onWhVoucherStatusChange = async (status: string) => {
    // if(id){ // UPDATING
    //   if(!isHaveUpdateVoucher) return toastr.error("Bạn không có quyền chỉnh sửa")
    // }else{ // CREATE
    //   if(!isHaveCreateVoucher) return toastr.error("Bạn không có quyền Tạo phiếu")
    // }
    switch (status) {
      case WH_VOUCHER_STATUS.CONFIRMED:
        handleConfirm({ id: id,status : WH_VOUCHER_STATUS.CONFIRMED });
        break;
      case WH_VOUCHER_STATUS.APPROVED:
        handleConfirm({ id:id,status : WH_VOUCHER_STATUS.APPROVED });
        break;
      case WH_VOUCHER_STATUS.REJECT:
        handleConfirm({ id:id,status : WH_VOUCHER_STATUS.REJECT });
        break;
      default:
        break;
    }
    // onCancel()
    // else{
    //   confirm({

    //     title: `Bạn có muốn ${WH_VOUCHER_ACTION_NAME[status][LANGUAGE.VI]} phiếu này?`,
    //     icon: <ExclamationCircleOutlined />,
    //     content: '',
    //     onOk() {
    //       const fullValues = form.getFieldsValue(true);

    //       const whPaymentVoucher = toJSON({
    //         ...(whBill && { whBillId: get(whBill, '_id') }),
    //         ...(whBillItem && { whBillItemId: get(whBillItem, '_id') }),
    //         ...(whAppointment && { whAppointmentId: get(whAppointment, '_id') }),
    //         ...fullValues,
    //         accountingDetails: [...ref.current.getAccountingDetailsData()],
    //         totalAmount:sumBy([...ref.current.getAccountingDetailsData()],(item) => get(item,'amountOfMoney',0))
    //       });
    //       switch (status) {
    //         case WH_VOUCHER_STATUS.CONFIRMED:
    //           handleConfirm({ id: head(id.split("&")),...whPaymentVoucher,status : null });
    //           break;
    //         case WH_VOUCHER_STATUS.APPROVED:
    //           handleApprove({ id: head(id.split("&")),...whPaymentVoucher,status : null });
    //           break;
    //         case WH_VOUCHER_STATUS.REJECT:
    //           handleReject({ id: head(id.split("&")),...whPaymentVoucher,status : null });
    //           break;
    //         default:
    //           break;
    //       }
    //     },
    //     onCancel() {
    //     },
    //   });
    // }
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
                      label={"Mã nhà cung cấp"}
                      labelCol={{ lg: 8 }}
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã khách hàng!",
                        },
                      ]}
                    >
                      {render(
                        // <DebounceSelect
                        //   fetchOptions={async (keyword?: string) => {
                        //     return [
                        //       {
                        //         label: "1111",
                        //         value: "1111",
                        //       },
                        //     ];
                        //   }}
                        //   allowClear
                        //   showSearch
                        // />
                        <Input disabled />
                      )}
                    </FormItem>
                    <FormItem hidden name="provider"></FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label={"Tên nhà cung cấp"}
                      labelCol={{ lg: 8 }}
                      name="supplier"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Vui lòng chọn tên nhà cung cấp!",
                      //   },
                      // ]}
                    >
                      {isLoading ? <Skeleton.Input active /> : <Input />}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={36}>
                  <Col span={24}>
                    <FormItem label="Người nhận" name="supplierReceive">
                      {isLoading ? <Skeleton.Input active /> : <Input />}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={36}>
                  <Col span={24}>
                    <FormItem label="Địa chỉ" name={"supplierAddress"}>
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
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Vui lòng nhập số chứng từ!',
                      //   }
                      // ]}
                    >
                      {isLoading ? <Skeleton.Input active /> : <Input />}
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
                  isShowSuggest={!id}
                  setAccountingDetails={setAccountingDetails}
                />
              </Space>
            </TabPane>
          </Tabs>
          <Collapse style={{ backgroundColor: "transparent" }} bordered={false}>
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
              // historyLogs={get(whPaymentVoucher, 'historyLogs', [])}
              />
            </Collapse.Panel>
          </Collapse>

          {/* <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            justify="center"
            align="middle"
            wrap={false}
            className="form-actions"
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ marginRight: "10px" }}
            >
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
            <Button
              type="default"
              onClick={() => {
                onClose();
              }}
            >
              Huỷ
            </Button>
          </Row> */}
          <Row className="staff-form__submit-box">
            <Button icon={<SaveOutlined />} onClick={onFinish} type="primary">
              Lưu
            </Button>

            {id &&
              (!get(mergedInitWhPaymentVoucher, "status") ||
                get(mergedInitWhPaymentVoucher, "status") ===
                  WH_VOUCHER_STATUS.CREATED) && (
                // <WithPermission permission={POLICIES}>
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
                // </WithPermission>
              )}

            {id &&
              get(mergedInitWhPaymentVoucher, "status") ===
                WH_VOUCHER_STATUS.CONFIRMED && (
                <Space>
                  {/* <WithPermission permission={POLICIES.UPDATE_WHUPDATERECEIPTANDPAYMENTVOUCHERSTATUS}> */}
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
                  {/* </WithPermission> */}
                  {/* <WithPermission permission={POLICIES.UPDATE_WHUPDATERECEIPTANDPAYMENTVOUCHERSTATUS}> */}
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
                  {/* </WithPermission> */}
                </Space>
              )}

            {/* <div className='buttonSaveFile'>
              <Button
                icon={<FileWordOutlined />}
                loading={isPrinting}
                onClick={() => onPrint()}
              >
                Tải về file Docx
              </Button>
              <Button onClick={onOpenSettingDocs} className='buttonSaveFile--addAfter'><SettingOutlined /></Button>
              </div> */}

            {isSubmitLoading ? (
              <Button disabled>Đóng</Button>
            ) : (
              // onCancel
              //   ? <Button icon={<CloseCircleOutlined />} onClick={onCancel}>Đóng</Button>
              //     :
                  (
                  <Link to={'/'}>
                    <Button icon={<CloseCircleOutlined />}>Đóng</Button>
                  </Link>
                )
            )}

            <Button
              icon={<EyeOutlined />}
              // loading={isPrinting}
              // onClick={() => onPrint(true)}
            >
              Xem trước file
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
