import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import { debounce, get, head } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
// import { Pie } from "@ant-design/charts";

import { DatePickerProps } from "antd/lib";
import dayjs from "dayjs";
import { Layout } from "~/modules/sale/bill/components/createBillScreen/TotalBill";
import useNotificationStore from "~/store/NotificationContext";
import { formatNumberIsPercent, formatNumberThreeComma, formatter } from "~/utils/helpers";
import {
  useCreateCostManagement,
  useGetCostManagement,
  useResetAction,
  useUpdateCostManagement,
} from "../costManagement.hook";
import SkeletonInput from "antd/es/skeleton/Input";

interface Variant {
  label: string,
  value: string
};

const layoutRow = {
  gutter: 16,
};

const optionsReferenceUnit = [
  {
    label: "VND",
    value: "VND",
  },
  {
    label: "Phần trăm",
    value: "percent",
  },
];
const formatPercent = /^(\d+(\.\d{1,2})?)%?$/;
export default function CostManagementForm({
  id,
  onCancel,
  priceByProduct,
  startDate,
  endDate,
  setId,
}: any): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const [form] = Form.useForm();
  const [backupForm, setBackupForm] = useState<any[]>([]);
  const [isSubmitLoading, onUpdate] = useUpdateCostManagement(onCancel);
  const [costManagementById, isLoading] = useGetCostManagement(id);
  const [toTalPrice, setToTalPrice] = useState(0); 
  const [priceMemo, setPriceMemo] = useState(0);
  const [shippingId, setShippingId] = useState(null);
  const [profitVal, setProfitVal] = useState(0);
  const [optionsVariants, setOptionVariants] = useState<Variant[]>([]);
  const [variantId, setVariantId] = useState <any>(null);
  useResetAction();
  const [referenceUnit, setReferenceUnit] = useState<any>(head(optionsReferenceUnit)?.value);

  // const handleChangReferenceUnit = useCallback(
  //   (value?: any) => {
  //     if (value) {
  //       setReferenceUnit(value);
  //     }
  //     const price1 = form.getFieldValue("totalPrices").replace(/,/g, "");
  //     setPriceMemo(price1);
  //     form.setFieldsValue({
  //       cost: {
  //         pharmaceutical: 0,
  //         operations: 0,
  //         marketing: 0,
  //         management: 0,
  //         logistic: 0,
  //       },
  //       financialCost: 0,
  //     });
  //     // };
  //   },
  //   [form]
  // );

  // const onFinish = (values: any) => {
  //   const formattedValues: any = {
  //     ...values,
  //     startDate: dayjs(values.startDate).format("YYYY-MM-DD"),
  //     endDate: dayjs(values.endDate).format("YYYY-MM-DD"),
  //   };
  //   const { cost, financialCost } = values;
  //   const costShipping = {
  //     pharmaceutical: cost?.pharmaceutical
  //       ? parseFloat(cost?.pharmaceutical)
  //       : 0,
  //     operations: parseFloat(cost?.operations) ?? 0,
  //     marketing: parseFloat(cost?.marketing) ?? 0,
  //     management: parseFloat(cost?.management) ?? 0,
  //     logistic: parseFloat(cost?.logistic) ?? 0,
  //     financialCost: parseFloat(financialCost) ?? 0,

  //     get count() {
  //       return (
  //         this.pharmaceutical +
  //         this.operations +
  //         this.marketing +
  //         this.management
  //       );
  //     },
  //   };

  //   const distributionChannel = costShipping.count;

  //   if (referenceUnit === "percent") {
  //     const percentKeys = [
  //       "marketing",
  //       "management",
  //       "pharmaceutical",
  //       "logistic",
  //       "operations",
  //     ];
  //     percentKeys.forEach((key) => {
  //       formattedValues.cost[key] = (toTalPrice * values.cost[key]) / 100;
  //     });
  //     onUpdate({
  //       ...formattedValues,
  //       financialCost: (toTalPrice * financialCost) / 100,
  //       cost: {
  //         ...cost,
  //         distributionChannel: (toTalPrice * distributionChannel) / 100,
  //       },
  //       _id: shippingId,
  //     });
  //     form.resetFields();
  //     setId(null);
  //   } else {
  //     onUpdate({
  //       ...formattedValues,
  //       cost: { ...cost, distributionChannel: distributionChannel },
  //       _id: shippingId,
  //     });
  //     form.resetFields();
  //     setId(null);
  //   }
  // };
  useEffect(() => {
    if (costManagementById && id) {
      const {
        shippingCost,
        variants,
        name,
        profitValue,
      } = costManagementById;
      const optionsV = variants?.map((item: any) => ({
        label: item?.unit?.name || item?.variantCode,
        value: item._id,
      }));
      setOptionVariants(optionsV);
      setVariantId(optionsV[0]?.value || null);
      setShippingId(get(shippingCost, "_id", null));
      // setProfitVal(profitValue);
      form.setFieldsValue({
        name: name ?? "",
      });
      setBackupForm([costManagementById]);
    } else {
      setBackupForm([form.getFieldsValue()]);
    }
  }, [costManagementById, id, form]);
  
  //Handle Variant
  useEffect(() => {
    if (variantId) { 
      const findCost = costManagementById?.shippingCost?.cost?.find((item: any) => item?.variantId === variantId);
      const infoVariant = costManagementById?.variants?.find((item: any) => item?._id === variantId);
      form.setFieldsValue({
        variant: variantId,
        cost: {
          distributionChannel: findCost?.distributionChannel ?? 0,
          pharmaceutical: findCost?.pharmaceutical ?? 0,
          operations: findCost?.operations ?? 0,
          marketing: findCost?.marketing ?? 0,
          management: findCost?.management ?? 0,
          logistic: findCost?.logistic ?? 0,
        },
        code: infoVariant?.variantCode,
        costPrice: infoVariant?.cost,
        price: infoVariant?.price
      });

    };
  }, [variantId, costManagementById, id,optionsVariants]);

  //Handle referenceUnit
  useEffect(() => {
    if (costManagementById && id) { 
      form.setFieldsValue({
        referenceUnit,
      });
    };
  }, [referenceUnit,costManagementById,id]);
  
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };
  const onValuesChange = (valueChange: any, values: any) => {
    const onSetRecoverForm = () =>
      setBackupForm((pre: any[]) => [...pre, values]);
    const debounceSetRecover = debounce(onSetRecoverForm, 0);
    debounceSetRecover();
  };

  //Handle render UI
  const renderLoading = (component: any) =>
    isLoading ? <SkeletonInput /> : component;
  
  // const checkTypePriceIsRender = (component_1: any, component_2: any) => {
  //   return referenceUnit === "VND"
  //     ? renderLoading(component_1)
  //     : renderLoading(component_2);
  // };

  const checkTypePriceIsRender_ = () => {
    /**
     * Nhập đối số field
     * return lại giá trị lợi nhuận khi đang nhập
     */
    return (
      <InputNumber
        onBlur={(e: any) => {
          const a = priceMemo - e.target.value;
          setPriceMemo(a);
        }}
        style={{ width: "100%" }}
        formatter={formatNumberThreeComma}
      />
    );
  };

  const addonAfter = useMemo(() => referenceUnit === "VND" ? "VND" : "%", [referenceUnit]);
  const maxInput = useMemo(() => referenceUnit !== "VND" ? 100 : undefined, [referenceUnit]);
  const formatterInput = useMemo(()=>referenceUnit === "VND" ? formatNumberThreeComma : formatNumberIsPercent,[referenceUnit])
  return (
    <div>
      <h5>Tạo mới chi phí</h5>
      <Form
        form={form}
        // onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        scrollToFirstError={true}
        // initialValues={{
        //   variants: [
        //     {
        //       exchangeValue: 1,
        //       variantIsDefault: true,
        //     },
        //   ],
        // }}
        onValuesChange={onValuesChange}
      >
        <BaseBorderBox title={"Khoảng ngày"}>
          <Row {...layoutRow}>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item<any> label="Ngày bắt đầu" name={"startDate"}>
                <DatePicker onChange={onChange} />
              </Form.Item>
            </Col>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item<any> label="Ngày kết thúc" name={"endDate"}>
                <DatePicker onChange={onChange} />
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={'Hệ số'}>
          <Row>
            <Col span={12}>
              <Form.Item name={"variant"} label={"Đơn vị sản phẩm"}>
                <Select
                  style={{ width: 120 }}
                  options={optionsVariants}
                  onChange={(value) => setVariantId(value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"referenceUnit"} label={"Đơn vị quy chiếu"}>
                <Select
                  style={{ width: 120 }}
                  value={referenceUnit}
                  options={optionsReferenceUnit}
                  onChange={(value) => setReferenceUnit(value)}
                />
              </Form.Item>
            </Col>
          </Row></BaseBorderBox>
        <BaseBorderBox title={"Thông tin sản phẩm"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any> label="Mã sản phẩm" name={"code"}>
                {renderLoading(<Input readOnly />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any> label="Tên sản phẩm" name={"name"}>
                {renderLoading(<Input readOnly />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any> label="Giá thu về" name={"costPrice"}>
                {renderLoading(
                  <InputNumber
                    readOnly
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any> label="Giá niêm yết" name={"price"}>
                {renderLoading(
                  <InputNumber
                    readOnly
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item<any> label="Số lượng đã bán" name={"totalPrices"}>
                {renderLoading(
                  <InputNumber readOnly style={{ width: "100%" }} />
                )}
              </Form.Item>
            </Col>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item<any> label="Doanh thu" name={"totalPrices"}>
                {renderLoading(
                  <InputNumber readOnly style={{ width: "100%" }} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin chi phí vận chuyển (1)"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí vận chuyển"
                name={["cost", "logistic"]}
              >
                  <InputNumber
                    min={0}
                    max={maxInput}
                    style={{ width: "100%" }}
                    formatter={formatterInput}
                    addonAfter= {addonAfter}
                  />
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
                  <InputNumber
                    min={0}
                    max={maxInput}
                    style={{ width: "100%" }}
                    formatter={formatterInput}
                    addonAfter= {addonAfter}
                  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí vận hành"
                name={["cost", "operations"]}
              >
                <InputNumber
                    min={0}
                    max={maxInput}
                    style={{ width: "100%" }}
                    formatter={formatterInput}
                    addonAfter= {addonAfter}
                  />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí marketing"
                name={["cost", "marketing"]}
              >
                <InputNumber
                    min={0}
                    max={maxInput}
                    style={{ width: "100%" }}
                    formatter={formatterInput}
                    addonAfter= {addonAfter}
                  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí quản lý"
                name={["cost", "management"]}
              >
                <InputNumber
                    min={0}
                    max={maxInput}
                    style={{ width: "100%" }}
                    formatter={formatterInput}
                    addonAfter= {addonAfter}
                  />
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Tổng tin chi phí tài chính (3)"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any> label="Chi phí tài chính" name={"financialCost"}>
                <InputNumber
                    min={0}
                    max={maxInput}
                    style={{ width: "100%" }}
                    formatter={formatterInput}
                    addonAfter= {addonAfter}
                  />
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox>
          <Row {...layoutRow}>
            <Col span={6}>
              <Layout
                tooltip="Lợi nhuận bằng doanh thu - (1) - (2) - (3)"
                label={"Lợi nhuận:"}
              >
                <Typography.Text
                  type={profitVal <= 0 ? "danger" : "success"}
                  strong
                >
                  {formatter(profitVal)}đ
                </Typography.Text>
              </Layout>
            </Col>
          </Row>
        </BaseBorderBox>
        <Row justify={"end"} gutter={16}>
          <Col>
            <Button onClick={onCancel}>Huỷ</Button>
          </Col>
          <Col>
            <Button loading={isSubmitLoading} htmlType="submit" type="primary">
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
