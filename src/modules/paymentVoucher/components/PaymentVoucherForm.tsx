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
  TYPE_VOUCHER,
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
import apiPaymentVoucher from "~/modules/paymentVoucher/paymentVoucher.api";
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
import { get, omit, sumBy } from "lodash";
import { CheckOutlined, CloseCircleOutlined, ExclamationCircleOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
// import myFile from '../../../assets/templates/PC_Template_V2.docs'
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
  onCancel?: any;
  debt?: number | null;
};

export default function PaymentVoucherForm(
  props: propsType
): React.JSX.Element {
  useResetAction();
  const dispatch = useDispatch();
  const { id, supplierId, onClose, refCollection,onCancel, debt } = props;
  const [form] = Form.useForm();
  const ref = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  const [accountingDetails, setAccountingDetails] = useState([]);
  const [url, setUrl] = useState<string>('');
  const [isOpenViewer, setIsOpenViewer] = useState(false);
  const [initEmployee, setInitEmployee] = useState<any[]>([]);
  //Hook
  const [isSubmitLoading, handleCreate] = useCreatePaymentVoucher(onClose);
  const [, handleUpdate] = useUpdatePaymentVoucher(onClose);
  const [, handleConfirm] = useConfirmPaymentVoucher(onClose);
  const [voucher, isLoading] = useGetPaymentVoucher(id);
  const initPaymentVoucher = useInitWhPaymentVoucher(voucher);
  const [supplier] = useGetSupplier(supplierId);
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
      const res = await apiEmployee.getALLAuthenticated({ keyword });
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
    form.setFieldsValue({
      issueNumber: res?.result,
    });
  };

  // const onPrint = async (viewOnly = false): Promise<void> => {
  //   const downloadURL = (data: string, fileName: string): void => {
  //     const a : any = document.createElement('a');
  //     a.href = data;
  //     a.download = fileName;
  //     document.body.appendChild(a);
  //     a.style = 'display: none';
  //     a.click();
  //     a.remove();
  //   };

  //   const saveDataToFile = (data: string, fileName: string, mimeType: string): void => {
  //     const blob = new Blob([data], { type: mimeType });
  //     const url = window.URL.createObjectURL(blob);
  //     downloadURL(url, fileName);
  //     setTimeout(() => {
  //       window.URL.revokeObjectURL(url);
  //     }, 1000);
  //   };

  //   const renderFile = async (data: string, fileName: string, mimeType: string): Promise<void> => {
  //     const blob = new Blob([data], { type: mimeType });
  //     const url = window.URL.createObjectURL(blob);

  //     // const res = await api.whReceiptVoucher.upload(blob); // Replace with your actual API call
  //     // const res = await api.whReceiptVoucher.upload(url);
  //     // setUrl(get(res, "url"));
  //     setUrl('https://calibre-ebook.com/downloads/demos/demo.docx');
  //     setIsOpenViewer(true);
  //   };

  //   setIsPrinting(true);
  //   const template = await fetch(myFile).then((res) => res.arrayBuffer());

  //   try {
  //     await form.validateFields();

  //     const {
  //       customerAddress,
  //       customerName,
  //       issueNumber,
  //       originalDocument,
  //       reason,
  //       accountingDate,
  //       employeeId,
  //     }: any = form.getFieldsValue();

  //     // const employee: any = await api.userEmployee.getById(employeeId);
  //     // const totalAmountOfMoney = sumBy(dataSource, (item) => Number(get(item, 'amountOfMoney')));
  //     // const totalAmountOfMoneyString = `${readNumber(totalAmountOfMoney)} ${
  //     //   CURRENCY_STRING[CURRENCY.VND]
  //     // }`;
  //     // const debitAccounts = uniq(dataSource.map((item) => get(item, 'debitAccount'))).join(', ');
  //     // const creditAccounts = uniq(dataSource.map((item) => get(item, 'creditAccount'))).join(', ');

  //     // const accountingDateDD = get(initWhPaymentVoucher, 'dateApproved')
  //     //   ? moment(get(initWhPaymentVoucher, 'dateApproved')).date()
  //     //   : moment(get(initWhPaymentVoucher, 'createdAt')).date();
  //     // const accountingDateMM = get(initWhPaymentVoucher, 'dateApproved')
  //     //   ? moment(get(initWhPaymentVoucher, 'dateApproved')).month() + 1
  //     //   : moment(get(initWhPaymentVoucher, 'createdAt')).month() + 1;
  //     // const accountingDateYY = get(initWhPaymentVoucher, 'dateApproved')
  //     //   ? moment(get(initWhPaymentVoucher, 'dateApproved')).year()
  //     //   : moment(get(initWhPaymentVoucher, 'createdAt')).year();

  //     // const report = await createReport({
  //     //   template,
  //     //   cmdDelimiter: ['{#', '#}'],
  //     //   data: {
  //     //     accountingDateDD,
  //     //     accountingDateMM,
  //     //     accountingDateYY,
  //     //     creditAccounts,
  //     //     customerAddress: get(customerAddress, 'street') || customerAddress,
  //     //     customerName,
  //     //     debitAccounts,
  //     //     issueNumber,
  //     //     originalDocument,
  //     //     reason,
  //     //     totalAmountOfMoney: floorFormatter(totalAmountOfMoney),
  //     //     totalAmountOfMoneyString: capitalizeFirstLetter(totalAmountOfMoneyString),
  //     //     EmployeeName: get(employee, 'data.fullName', ''),
  //     //     nameCompany: get(settingDocs, 'name', ''),
  //     //     addressCompany: get(settingDocs, 'address', ''),
  //     //   },
  //     // });

  //     // if (viewOnly) {
  //     //   renderFile(
  //     //     report,
  //     //     `${issueNumber}.docx`,
  //     //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  //     //   );
  //     // } else {
  //     //   saveDataToFile(
  //     //     report,
  //     //     `${issueNumber}.docx`,
  //     //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  //     //   );
  //     // }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsPrinting(false);
  //   }
  // };


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
    if (id && mergedInitWhPaymentVoucher ) {
      const initEmployee = {
        label: mergedInitWhPaymentVoucher?.employee?.fullName,
        value: mergedInitWhPaymentVoucher?.employee?._id
      };
      setInitEmployee([initEmployee]);
    } else {
      fetchIssueNumber();
    }
  }, [id, mergedInitWhPaymentVoucher]);
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
        totalAmount:sumBy([...accountingDetails],(item) => get(item,'amountOfMoney',0))
      };
      if (id) {
        handleUpdate({ id: id, ...newValue });
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
                      {render(<Input disabled />)}
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
          <Row className="staff-form__submit-box">
            <Button icon={<SaveOutlined />} type="primary" htmlType="submit">
              Lưu
            </Button>

            {id &&
              (!get(mergedInitWhPaymentVoucher, "status") ||
                get(mergedInitWhPaymentVoucher, "status") ===
                  WH_VOUCHER_STATUS.CREATED) && (
              <WithPermission permission={POLICIES.UPDATE_STATUS_VOUCHER}>
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
              get(mergedInitWhPaymentVoucher, "status") ===
                WH_VOUCHER_STATUS.CONFIRMED && (
                <Space>
                  <WithPermission permission={POLICIES.UPDATE_STATUS_VOUCHER}>
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
                  <WithPermission permission={POLICIES.UPDATE_STATUS_VOUCHER}>
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
              onCancel
                ? <Button icon={<CloseCircleOutlined />} onClick={onCancel}>Đóng</Button>
                  :
                  (
                  <Link to={'/'}>
                    <Button icon={<CloseCircleOutlined />}>Đóng</Button>
                  </Link>
                )
            )}

            {/* <Button
              icon={<EyeOutlined />}
              // loading={isPrinting}
              // onClick={() => onPrint(true)}
            >
              Xem trước file
            </Button> */}
          </Row>
        </Form>
      </div>
    </div>
  );
}
