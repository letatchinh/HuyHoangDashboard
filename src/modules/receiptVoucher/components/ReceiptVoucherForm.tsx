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
import React, { useRef, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import "./form.scss";
import DebounceSelect from "~/components/common/DebounceSelect";
import {
  COMPONENT_MODES,
  WH_PAYMENT_METHOD,
  WH_PAYMENT_METHOD_VI,
} from "~/constants/defaultValue";
import HistoryLogs from "~/modules/vouchers/components/HistoryLog";
import AccountingDetails from "~/modules/vouchers/components/AccountingDetailTable/AccountingDetailTable";

const mainRowGutter = 24;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Option } = Select;
const DEFAULT_ACCOUNT = 1111;

type propsType = {
  id?: any
  onClose?: any
};

export default function ReceiptVoucher(props: propsType): React.JSX.Element {
  const { id , onClose} = props;
  const isLoading = false;
  const [form] = Form.useForm();
  const ref = useRef();

  const [settingDocs,setSettingDocs] = useState({
    name : 'CÔNG TY TNHH WORLDCARE MIỀN TRUNG',
    address:'559 Lê Văn Hiến, P. Khuê Mỹ, Q. Ngũ Hành Sơn, TP Đà Nẵng',
    isVisibleSettings: false,
  });

  const onValuesChange = () => {
    console.log("first");
  };
  const onFinish = async (values: any) => {
    // if(id){ // UPDATING
    //   if(!isHaveUpdateVoucher) return toastr.error("Bạn không có quyền chỉnh sửa")
    // }else{ // CREATE
    //   if(!isHaveCreateVoucher) return toastr.error("Bạn không có quyền Tạo phiếu")
    // };
  
    try {
      await form.validateFields();
      const fullValues = form.getFieldsValue(true);
      const { arrAppointmentCancel } = fullValues;
      // const resultArray = appointments?.filter(itemArr1 => arrAppointmentCancel.includes(itemArr1._id));
      // const newAppoitments = resultArray?.map((item: any) => ({
      //   name: item?.code,
      //   id: item?._id
      // }));
      // const whReceiptVoucher = toJSON({
      //   whBillId: get(whBill, "_id"),
      //   ...(whBillItem && { whBillItemId: get(whBillItem, '_id') }),
      //   ...(whAppointment && { whAppointmentId: get(whAppointment, '_id') }),
      //   ...(additional && { additional }), // add additional payment or receipt
      //   ...fullValues,
      //   accountingDetails: [...ref.current.getAccountingDetailsData()],
      //   action: WH_PAYMENT_VOUCHER_ACTION.PAYMENT_BILL, // add at 02/06
      //   arrAppointmentCancel: newAppoitments
      // });
      if (id) {
        // handleUpdate({ ...whReceiptVoucher, id: head(id.split("&")) });
      } else {
        // handleCreate(whReceiptVoucher);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const render = (component: any) =>
    isLoading ? <Skeleton.Input active /> : component;
  return (
    <div className="page-wraper">
      <div className="container-fluid">
        <Form
          autoComplete="off"
          form={form}
          // initialValues={mergedInitWhReceiptVoucher}
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
                      label={"Mã khách hàng"}
                      labelCol={{ lg: 8 }}
                      name="customerNumber"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã khách hàng!",
                        },
                      ]}
                    >
                      {render(
                        <DebounceSelect
                          fetchOptions={async (keyword?: string) => {
                            return [
                              {
                                label: "1111",
                                value: "1111",
                              },
                            ];
                          }}
                          allowClear
                          showSearch
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      // label={<>Tên khách hàng{` `}<code>customerName</code></>}
                      label={"Tên khách hàng"}
                      labelCol={{ lg: 8 }}
                      name="customerName"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn Tên nhân viên!",
                        },
                      ]}
                    >
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
                    <FormItem label="Người nhận" name="customerName">
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
                    <FormItem
                      label="Địa chỉ"
                      name={["customerAddress", "street"]}
                    >
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
                      {isLoading ? (
                        <Skeleton.Input active />
                      ) : (
                        <DebounceSelect
                          // initOptions={initStaffs}
                          fetchOptions={async (keyword?: string) => {
                            return [
                              {
                                label: "Nhan vien 1",
                                value: "1111",
                              },
                            ];
                          }}
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
                      {isLoading ? (
                        <Skeleton.Input active />
                      ) : (
                        <Input disabled />
                      )}
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
                  // dataSource={dataSource}
                  // whAppointment={whAppointment}
                  // isShowSuggest = {!id}
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
              // historyLogs={get(whReceiptVoucher, 'historyLogs', [])}
              />
            </Collapse.Panel>
          </Collapse>

          <Row
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
              style={{marginRight: '10px'}}
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
          </Row>
        </Form>
      </div>
    </div>
  );
}
