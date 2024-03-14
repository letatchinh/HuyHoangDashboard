import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Typography } from "antd";
import { debounce, get } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
// import { Pie } from "@ant-design/charts";

import { DatePickerProps } from "antd/lib";
import dayjs from "dayjs";
import { Layout } from "~/modules/sale/bill/components/createBillScreen/TotalBill";
import useNotificationStore from "~/store/NotificationContext";
import { formatter } from "~/utils/helpers";
import { useCreateCostManagement, useGetCostManagement, useResetAction, useUpdateCostManagement } from "../costManagement.hook";
const layoutRow = {
  gutter: 16,
};
export default function CostManagementForm({
  id,
  onCancel,
  priceByProduct,
  startDate,
  endDate,
  setId
}: any): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const [form] = Form.useForm();
  const [backupForm, setBackupForm] = useState<any[]>([]);

  // const [isSubmitLoading, onCreate] = useCreateCostManagement();
  const [isSubmitLoading, onUpdate] = useUpdateCostManagement(onCancel);
  // const queryGet = useMemo(() => ({
  //   id: id,
  //   startDate: dayjs(startDate).format("YYYY-MM-DD"),
  //   endDate: dayjs(endDate).format("YYYY-MM-DD")
  // }), [id, startDate, endDate]);
  const [costManagementById, isLoading] = useGetCostManagement(id);
  const [toTalPrice, setToTalPrice] = useState(0); //giá bán
  const [priceMemo, setPriceMemo] = useState(0);
  const [shippngId, setShippingId] = useState(null);
  const [profitVal, setProfitVal] = useState(0);
  useResetAction();
  const [keyword, setKeyword] = useState<any>("VND");
  const handleChangeKeyword = useCallback((value?: any) => {
    if (value) {
      setKeyword(value);
    }
    const price1 = form.getFieldValue("totalPrices").replace(/,/g, '');
    // if (price1) {
    setPriceMemo(price1);
    form.setFieldsValue({
      cost: {
        pharmaceutical: 0,
        operations: 0,
        marketing: 0,
        management: 0,
      },
      financialCost: 0,
    });
    // };
  }, [form]);
  // const onUndoForm = (isLast = false) => {

  //   // Action Back One step to set Form And Remove last Recover
  //   const stepUndo = ((backupForm.length === 1) || isLast) ? 1 : 2;

  //   const preForm = backupForm[backupForm.length - stepUndo];
  //   form.setFieldsValue(preForm);
  //   const newRecoverForm = [...backupForm];

  //   newRecoverForm.pop();
  //   setBackupForm(newRecoverForm);
  // }

  const options = [
    {
      label: "VND",
      value: "VND",
    },
    {
      label: "Phần trăm",
      value: "percent",
    },

  ];
  const onFinish = (values: any) => {
    const formattedValues: any = {
      ...values,
      startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
    };
    const { cost, financialCost } = values;
    const costShipping = {
      pharmaceutical: parseFloat(cost?.pharmaceutical) ?? 0,
      operations: parseFloat(cost?.operations) ?? 0,
      marketing: parseFloat(cost?.marketing) ?? 0,
      management: parseFloat(cost?.management) ?? 0,
      logistic: parseFloat(cost?.logistic) ?? 0,
      financialCost: parseFloat(financialCost) ?? 0,
    
      get count() {
        return this.pharmaceutical + this.operations + this.marketing + this.management;
      }
    };
    
    const distributionChannel = costShipping.count;
    
    if (keyword === 'percent') {

      const percentKeys = ['marketing', 'management', 'pharmaceutical', 'logistic', 'operations'];
      percentKeys.forEach(key => {
        formattedValues.cost[key] = (toTalPrice * values.cost[key]) / 100;
      });
      onUpdate({ ...formattedValues, financialCost: (toTalPrice * financialCost) / 100, cost: { ...cost, distributionChannel: (toTalPrice * distributionChannel / 100) }, _id: shippngId });
      form.resetFields(); setId(null);
    } else {
      onUpdate({ ...formattedValues, cost: { ...cost, distributionChannel: distributionChannel }, _id: shippngId });
      form.resetFields(); setId(null);
    };
  };
  useEffect(() => {

    if (costManagementById && id) {
      const { shippingCost, variants, medicalCode, name, totalPrices, profitValue } = costManagementById;
      setShippingId(get(shippingCost, '_id', null))
      setToTalPrice(totalPrices);
      setProfitVal(profitValue);
      setKeyword('VND');
      form.setFieldsValue({
        priceProduct: variants?.price ?? 0,
        code: variants?.variantCode ?? '',
        name: name ?? '',
        financialCost: shippingCost?.financialCost?? 0,
        totalPrices: formatter(totalPrices),
        cost: {
          distributionChannel: shippingCost?.cost?.distributionChannel ?? 0,
          pharmaceutical:  shippingCost?.cost?.pharmaceutical??0,
          operations:  shippingCost?.cost?.operations??0,
          marketing:  shippingCost?.cost?.marketing ??0,
          management:  shippingCost?.cost?.management ??0,
          logistic:  shippingCost?.cost?.logistic ??0,
        }
      });
      setBackupForm([costManagementById]);
    } else {
      setBackupForm([form.getFieldsValue()])
    };

  }, [costManagementById, id, form]);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  // const validateNumber = (rule: any, value: any, callback: any) => {
  //   if (isNaN(value)) {
  //     callback('Vui lòng nhập một số!');
  //   } else {
  //     callback();
  //   }
  // };
  const onValuesChange = (valueChange: any, values: any) => {

    // Recover Form
    const onSetRecoverForm = () => setBackupForm((pre: any[]) => [...pre, values]);
    const debounceSetRecover = debounce(onSetRecoverForm, 0);
    debounceSetRecover();
  };
  const handleReset = () => {
    form.resetFields(["cost", 'financialCost']);
    setPriceMemo(priceByProduct);
  };
  const handleBlur = (value: any) => {

  }
  return (
    <div>
      <h5>Tạo mới chi phí</h5>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        scrollToFirstError={true}

        initialValues={{
          variants: [
            {
              exchangeValue: 1,
              variantIsDefault: true,
            },
          ],
        }}
        onValuesChange={onValuesChange}
      >
        <BaseBorderBox title={"Khoảng ngày"}>
          <Row {...layoutRow}>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item<any>
                label="Ngày bắt đầu"
                name={'startDate'}
              >
                <DatePicker onChange={onChange} />
              </Form.Item>
            </Col>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item<any>
                label="Ngày kết thúc"
                name={'endDate'}
              >
                <DatePicker onChange={onChange} />
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin sản phẩm"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Mã sản phẩm"
                name={'code'}
              >
                {id ? RenderLoading(isLoading, <Input readOnly />) : <Select
                  style={{ width: 312 }}
                  value={keyword}
                  // options={optionData}
                  onChange={(value) => handleChangeKeyword(value)
                  }
                />}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Tên sản phẩm"
                name={'name'}
              >
                {RenderLoading(isLoading, <Input readOnly />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Giá bán"
                name={'priceProduct'}
              >
                {RenderLoading(isLoading, <InputNumber readOnly style={{ width: '100%' }} />)}

              </Form.Item>
            </Col>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item<any>
                label="Doanh thu"
                name={'totalPrices'}
              >
                {RenderLoading(isLoading, <InputNumber readOnly style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <span>Chọn đơn vị quy chiếu: </span> <Select
          style={{ width: 120 }}
          value={keyword}
          options={options}
          onChange={(value) => handleChangeKeyword(value)
          }
        />
        {/* <span><Button onClick={() => handleReset()}>Đặt lại</Button></span> */}
        <BaseBorderBox title={"Thông tin chi phí vận chuyển (1)"}>

          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí vận chuyển"
                name={["cost", "logistic"]}

              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  console.log(e.target.value, priceMemo, toTalPrice, 'asdsd')
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>

          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin chi phí kênh phân phối (2)"}>

          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí trình dược viên"
                name={["cost", "pharmaceutical"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí vận hành"
                name={["cost", "operations"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>

            <Col span={12}>
              <Form.Item<any>
                label="Chi phí marketing"
                name={["cost", "marketing"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí quản lý"
                name={["cost", "management"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox title={"Tổng tin chi phí tài chính (3)"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí tài chính"
                name={"financialCost"}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            {/* <strong style={{ color: "red", float: 'right' }}>{`Tổng số tiền chi phí liên quan: ${totalRelated}`}</strong> */}
          </Row>
        </BaseBorderBox>
        <BaseBorderBox>
          <Row {...layoutRow}>
            <Col span={6}>
              <Layout tooltip="Lợi nhuận bằng doanh thu - (1) - (2) - (3)" label={"Lợi nhuận:"}>
                <Typography.Text type="danger" strong>
                  {formatter(profitVal)}đ
                </Typography.Text>
              </Layout>
            </Col>
          </Row>
        </BaseBorderBox>
        <Row justify={"end"} gutter={16}>
          {/* <Col>
            <Button onClick={() => handleReset()}>
              Đặt lại
            </Button>
          </Col> */}
          <Col>
            <Button onClick={onCancel}>
              Huỷ
            </Button>
          </Col>
          <Col>
            <Button

              loading={isSubmitLoading}
              htmlType="submit"
              type="primary"
            >
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Col>
        </Row>
      </Form>

    </div>
  );
}
