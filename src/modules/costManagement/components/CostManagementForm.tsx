import { GiftTwoTone, UndoOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, notification, Row, Select, Tabs } from "antd";
import { compact, concat, debounce, get, head, keys } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
// import { Pie } from "@ant-design/charts";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { useSupplierInfoRedux } from "~/modules/productsAll/productsAll.hook";

import TabPane from "antd/es/tabs/TabPane";
import useNotificationStore from "~/store/NotificationContext";
import { useCreateCostManagement, useGetCostManagement, useResetAction, useUpdateCostManagement } from "../costManagement.hook";
import { DatePickerProps } from "antd/lib";
import dayjs from "dayjs";
// type DataType = "new" | "evaluating" | "ongoing" | "finished" | "archived";

// interface PieChartData {
//   type: DataType;
//   value: number;
// }
// const pieChartData: PieChartData[] = [
//   {
//     type: "new",
//     value: 40,
//   },
//   {
//     type: "evaluating",
//     value: 25,
//   },
//   {
//     type: "ongoing",
//     value: 22,
//   },
//   {
//     type: "finished",
//     value: 22,
//   },
//   {
//     type: "archived",
//     value: 10,
//   },
// ];

// const config = {
//   appendPadding: 10,
//   data: pieChartData,
//   angleField: "value",
//   colorField: "type",
//   radius: 0.8,
//   label: {
//     type: "outer",
//     content: "{value}",
//   },
//   interactions: [
//     {
//       type: "element-active",
//     },
//   ],
// };

const layoutRow = {
  gutter: 16,
};
export default function CostManagementForm({
  id,
  onCancel,
  priceByProduct,
}: any): React.JSX.Element {
  // const supplierInfo = useSupplierInfoRedux();
  const { onNotify } = useNotificationStore();
  const [form] = Form.useForm();
  const [backupForm, setBackupForm] = useState<any[]>([]);

  const [isSubmitLoading, onCreate] = useCreateCostManagement(onCancel);
  const [, onUpdate] = useUpdateCostManagement(onCancel);
  const [costManagementById, isLoading] = useGetCostManagement(id);
  const [toTalPrice, setToTalPrice] = useState(50000); //giá bán
  const [toTalDiscount, setToTalDiscount] = useState(0); // tổng tiền chiết khấu
  const [totalAmount, setTotalAmount] = useState(0); // tổng lợi nhuận
  const [totalRelated, setTotalRelated] = useState<number>(0); //tổng chi phí liên quan
  const [priceMemo, setPriceMemo] = useState(0);
  // const [dataNotificationUndo,setDataNotificationUndo] = useState({
  //   open : false,
  //   description : null
  // })
  useResetAction();
 
  const handleChangeKeyword = useCallback((value: any) => {
    setKeyword(value);
    const price1 = form.getFieldValue("exchangeValue");
    if(price1){
      const a = toTalPrice-price1
      setPriceMemo(a);
      form.resetFields(["cost","logistic"]);
    }
    form.resetFields(["cost","logistic"]);
  },[form]);
   useEffect(() => {


    setPriceMemo(50000);
  }, []);
  const onUndoForm = (isLast = false) => {

    // Action Back One step to set Form And Remove last Recover
    const stepUndo = ((backupForm.length === 1) || isLast) ? 1 : 2;

    const preForm = backupForm[backupForm.length - stepUndo];
    form.setFieldsValue(preForm);
    const newRecoverForm = [...backupForm];

    newRecoverForm.pop();
    setBackupForm(newRecoverForm);
  }

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
  const [keyword, setKeyword] = useState<any>("VND");
  const onFinish = (values: any) => {
    const formattedValues: any = {
        ...values,
        startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
    };

    if (keyword === 'percent') {
        const percentKeys = ['distributionChannel', 'maketing', 'management', 'pharmaceutical', 'logistic','operations'];
        percentKeys.forEach(key => {
            formattedValues.cost[key] = (toTalPrice * values.cost[key]) / 100;
        });
    }
    console.log(formattedValues);
    // onCreate({ ...formattedValues, productId: id });
    // form.resetFields();
    // onCancel();
};
  useEffect(() => {

    if (costManagementById && id) {
      const { shippingCost } = costManagementById;
      form.setFieldsValue({
        priceProduct: 50000,
        cost: [
          {
            distributionChannel: shippingCost?.cost?.distributionChannel,
            pharmaceutical: shippingCost?.cost?.pharmaceutical,
            operations: shippingCost?.cost?.operations,
            maketing: shippingCost?.cost?.maketing,
            management: shippingCost?.cost?.management,
            logistic: shippingCost?.cost?.logistic,
          }
        ]
      });

      setBackupForm([costManagementById]);
    } else {
      setBackupForm([form.getFieldsValue()])
    };

  }, [costManagementById, id, form]);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  const onValuesChange = (valueChange: any, values: any) => {

    // Recover Form
    const onSetRecoverForm = () => setBackupForm((pre: any[]) => [...pre, values]);
    const debounceSetRecover = debounce(onSetRecoverForm, 0);
    debounceSetRecover();
  };

  const onChange1 = (value: any) => {
    console.log(value)
    // setTotalAmount(value);
  }
  const handLeBlur = (value: any) => {
    const values = totalRelated + parseFloat(value);
    setTotalRelated(values);
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
        {/* <Form.Item<any> name="medicalCode" hidden /> */}
        {/* <BaseBorderBox title={"Thông tin sản phẩm"}>
          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Mã sản phẩm"
                name={'code'}
              >
                {RenderLoading(isLoading, <Input readOnly />)}
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
                label="Chi nhánh"
                name={'branch'}
              >
                {RenderLoading(isLoading, <Input readOnly />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox> */}
        <BaseBorderBox title={"Khoảng ngày"}>
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
        </BaseBorderBox>

        <BaseBorderBox title={"Thông tin sản phẩm"}>
          {/* <Col style={{ paddingBottom: 10 }} span={12}>
            <Form.Item<any>
              label="Giá bán"
              name={'priceProduct'}
            >
              {RenderLoading(isLoading, <InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
          <Col style={{ paddingBottom: 10 }} span={12}>
            <Form.Item<any>
              label="Lợi nhuận mong đợi"
              name={'exchangeValue'}
            >
              {RenderLoading(isLoading, <InputNumber onChange={(e: any) => {
                onChange1(e);
              }}
                onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  //  handLeBlur(e.target.value)
                  ;
                }} style={{ width: '100%' }} />)}
            </Form.Item>
          </Col> */}
          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Mã sản phẩm"
                name={'code'}
              >
                {RenderLoading(isLoading, <Input disabled />)}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item<any>
                label="Tên sản phẩm"
                name={'name'}
              >
                {RenderLoading(isLoading, <Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
              label="Giá bán"
              name={'priceProduct'}
            >
              {RenderLoading(isLoading, <InputNumber disabled style={{ width: '100%' }} />)}
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item<any>
              label="Lợi nhuận mong đợi"
              name={'exchangeValue'}
            >
              {RenderLoading(isLoading, <InputNumber onChange={(e: any) => {
                onChange1(e);
              }}
                onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  //  handLeBlur(e.target.value)
                  ;
                }} style={{ width: '100%' }} />)}
            </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <Select
          style={{ width: 120 }}
          value={keyword}
          options={options}
          onChange={(value) => handleChangeKeyword(value)
          }
        />
        <BaseBorderBox title={"Thông tin chi phí liên quan"}>

          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí vận chuyển"
                name={["cost", "logistic"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí kênh phân phối"
                name={["cost", "distributionChannel"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí trình dược viên"
                name={["cost", "pharmaceutical"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
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
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí maketing"
                name={["cost", "maketing"]}
              >
                {keyword === 'VND' ? RenderLoading(isLoading, <InputNumber onBlur={(e: any) => {
                  const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
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
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />) : RenderLoading(isLoading, <InputNumber max={100} onBlur={(e: any) => {
                  const a = priceMemo - (toTalPrice * e.target.value) / 100
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                    ;
                }} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
            {/* <strong style={{ color: "red", float: 'right' }}>{`Tổng số tiền chi phí liên quan: ${totalRelated}`}</strong> */}
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin chương trình khuyến mãi"}>
          <Row {...layoutRow}>
            <Col span={12}>

            </Col>
          </Row>
        </BaseBorderBox>

        <h5 style={{ color: "red" }}>Số tiền còn lại: {priceMemo}</h5>

        {/* <Pie {...config} /> */}
        <Row justify={"end"} gutter={16}>
          {/* <Col>
            <Button disabled={backupForm.length <= 1} onClick={() => onUndoForm()}>
              Hoàn tác
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
