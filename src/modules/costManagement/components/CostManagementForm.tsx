import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { get, head, omit } from "lodash";
import React, {  useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import useNotificationStore from "~/store/NotificationContext";
import { formatNumberThreeComma, formatter } from "~/utils/helpers";
import {
  convertData,
  convertDataSubmit,
  handleConvertCost,
  useGetCostManagement,
  useResetAction,
} from "../costManagement.hook";
import SkeletonInput from "antd/es/skeleton/Input";
import { useQueryParams } from "~/utils/hook";
import dayjs from "dayjs";
import { Layout } from "~/modules/sale/bill/components/createBillScreen/TotalBill";
import DatePickerAnt from "./DatePicker";
import { useCostManagementContext } from "../screens/CostManagement";
import { InfoCircleOutlined } from "@ant-design/icons";

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
    value: "PERCENT",
  },
];

interface Props{
}

export default function CostManagementForm({}: Props): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const { date, typeDate, id, onUpdate, onCancel, isSubmitLoading} = useCostManagementContext();
  const [form] = Form.useForm();
  const query = useQueryParams();
  const newQuery = useMemo(() => ({
    id: id,
    startDate: dayjs(date?.startDate).startOf(typeDate as any).format("YYYY-MM-DD HH:mm:ss") ?? query.get("startDate"),
    endDate: dayjs(date?.endDate).endOf(typeDate  as any).format("YYYY-MM-DD HH:mm:ss") ?? query.get("endDate"),
  }), [id]);
  const [costManagementById, isLoading] = useGetCostManagement(id && newQuery);
  const [optionsVariants, setOptionVariants] = useState<Variant[]>([]);
  const [variantId, setVariantId] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [referenceUnit, setReferenceUnit] = useState<any>(head(optionsReferenceUnit)?.value);
  const handleConvert = handleConvertCost(data,setData, referenceUnit);
  useResetAction();
  const [profit, setProfit] = useState(0);
  const [variantCurrent, setVariantCurrent] = useState<any>(null);
  
  useEffect(() => {
    if (costManagementById && id) {
      setData({
        ...costManagementById,
        variants :costManagementById?.variants?.map((item: any) => ({
          ...item,
          variantId: item?._id,
        ...convertData(item),
        }))
      });
      const {variants,name} = costManagementById;
      const optionsV = variants?.map((item: any) => ({
        label: item?.unit?.name || item?.variantCode,
        value: item._id,
      }));
      setOptionVariants(optionsV);
      setVariantId(optionsV[0]?.value || null);
      form.setFieldsValue({
        name: name ?? "",
      });
    };
  }, [costManagementById, id, form]);

  useEffect(() => {
    if (data && variantId) {
      const variant = data?.variants?.find((item: any) => item?._id === variantId);
      const expense = get(variant, 'logistic.VND', 0) + get(variant, 'costEmployee.VND', 0) + get(variant, 'operations.VND', 0) + get(variant, 'financialCost.VND', 0) + get(variant, 'marketing.VND', 0) + get(variant, 'management.VND', 0);
      const profit = +((variant?.totalRevenueVariant || 0) - expense);
      if (variantId) { 
      form.setFieldsValue({
        variant: variantId,
        distributionChannel: variant?.distributionChannel ?? 0,
        code: variant?.variantCode,
        costPrice: variant?.cost,
        totalRevenueVariant: variant?.totalRevenueVariant,
        totalQuantity: variant?.totalQuantity,
        ...variant,
        price: variant?.price,
      });
    };

      setVariantCurrent(variant);
      setProfit(profit);
    };
  }, [data, variantId, optionsVariants]);
  
  //Handle referenceUnit
  useEffect(() => {
    if (data && id) { 
      form.setFieldsValue({
        referenceUnit,
      });
    };
  }, [referenceUnit,costManagementById,id]);

  const onFinish = (values: any) => {
    const startDate = dayjs(date?.startDate)?.startOf('month').format("YYYY-MM-DD HH:mm:ss");
    const endDate = dayjs(date?.endDate)?.endOf('month').format("YYYY-MM-DD HH:mm:ss");
    const submitData = convertDataSubmit(data?.variants);
    onUpdate({
      data: submitData,
      _id: costManagementById?._id,
      startDate,
      endDate
    })
  };
  //Handle render UI
  const renderLoading = (component: any) => isLoading ? <SkeletonInput /> : component;

  const addonAfter = useMemo(() => referenceUnit === "VND" ? "VND" : "%", [referenceUnit]);

  return (
    <div>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        scrollToFirstError={true}
        onFinish={onFinish}
      >
        <BaseBorderBox title={'Thời gian'}>
          <Form.Item
            label={"Thời gian"}
          >
            <DatePickerAnt disabled = {true}/>
          </Form.Item>

        </BaseBorderBox>
        <BaseBorderBox title={'Hệ số'}>
          <Row gutter ={16}>
            <Col span={12}>
              <Form.Item name={"variant"} label={"Đơn vị sản phẩm"}>
                <Select
                  style={{ width: '100%' }}
                  options={optionsVariants}
                  onChange={(value) => setVariantId(value)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"referenceUnit"} label={"Đơn vị quy chiếu"}>
                <Select
                  style={{ width: '100%'  }}
                  value={referenceUnit}
                  options={variantCurrent?.totalRevenueVariant > 0 ? optionsReferenceUnit : [optionsReferenceUnit[0]]}
                  onChange={setReferenceUnit}
                />
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        
        <BaseBorderBox title={"Thông tin sản phẩm"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item label="Mã sản phẩm" name={"code"}>
                {renderLoading(<Input readOnly />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên sản phẩm" name={"name"}>
                {renderLoading(<Input readOnly />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item label="Giá thu về" name={"costPrice"}>
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
              <Form.Item label="Giá niêm yết" name={"price"}>
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
              <Form.Item label="Số lượng đã bán" name={"totalQuantity"}>
                {renderLoading(
                  <InputNumber readOnly style={{ width: "100%" }}formatter={formatNumberThreeComma} />
                )}
              </Form.Item>
            </Col>
            <Col style={{ paddingBottom: 10 }} span={12}>
              <Form.Item label="Doanh thu" name={"totalRevenueVariant"}>
                {renderLoading(
                  <InputNumber readOnly style={{ width: "100%" }} formatter={formatNumberThreeComma}/>
                )}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin chi phí vận chuyển (1)"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item
                label="Chi phí vận chuyển"
                name={["logistic", referenceUnit]}
              >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                    addonAfter={addonAfter}
                    onChange={(value)=> handleConvert("logistic", value, form.getFieldValue("variant"))}
                  />
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox title={"Thông tin chi phí kênh phân phối (2)"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                label= {
                  <Tooltip title="Chi phí trình dược viên sẽ được hệ thống tự động tính toán = (DS sản phẩm / Tổng DS) * Tổng chi phí TDV ">
                    Chi phí trình dược viên  <InfoCircleOutlined/>
                  </Tooltip>
                }
                name={["costEmployee",referenceUnit]}
              > 
                  <InputNumber
                    min={0}
                    readOnly
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                    addonAfter= {addonAfter}
                  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Chi phí vận hành"
                name={ ["operations",referenceUnit]}
              >
                <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                    addonAfter= {addonAfter}
                    onChange={(value)=> handleConvert("operations", value, form.getFieldValue("variant"))}
                  />
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item
                label="Chi phí marketing"
                name={ ["marketing",referenceUnit]}
              >
                <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                    addonAfter= {addonAfter}
                    onChange={(value)=> handleConvert("marketing", value, form.getFieldValue("variant"))}
                  />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Chi phí quản lý"
                name={ ["management", referenceUnit]}
              >
                <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                    addonAfter= {addonAfter}
                    onChange={(value)=> handleConvert("management", value, form.getFieldValue("variant"))}
                  />
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox title={"Tổng tin chi phí tài chính (3)"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item label="Chi phí tài chính" name={ ["financialCost", referenceUnit]}>
                <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    formatter={formatNumberThreeComma}
                    addonAfter= {addonAfter}
                    onChange={(value)=> handleConvert("financialCost", value, form.getFieldValue("variant"))}
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
                  type={profit <= 0 ? "danger" : "success"}
                  strong
                >
                  {formatter(profit)}đ
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
