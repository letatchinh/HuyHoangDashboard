import { SwapOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, InputNumber, Row, Select, Typography } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { requireRules } from "~/constants/defaultValue";
import { formatter } from "~/utils/helpers";
import useDetailReportStore from "../../DetailReportContext";
import {
  DataSwapType,
  ExchangeRateType,
  TargetsSupplierItem,
} from "../../reportEmployee.modal";
import { SwapStructure } from "../../reportEmployee.service";
type propsType = {};
type SwapStructureType = {
  id: string;
  rateSelf: number;
  name: string;
  rateTarget: number;
  maxValue?: number;
  handleExchange: (p?: any) => void;
};
export default function Swap(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const {
    dataSwap,
    dataSourceTargetsTeam,
    dataSourceTargetsSelf,
    exchangeRateOverrideTargetsTeam,
    exchangeRateOverrideTargetsSelf,
  } = useDetailReportStore();
  const dataExchangeHandle: ExchangeRateType[] = useMemo(() => {
    switch (dataSwap?.type) {
      case "team":
        return exchangeRateOverrideTargetsTeam;
      case "self":
        return exchangeRateOverrideTargetsSelf;
      default:
        return [];
    }
  }, [dataSwap, exchangeRateOverrideTargetsTeam, exchangeRateOverrideTargetsSelf]);
  const dataHandleTargetsHandle: TargetsSupplierItem[] = useMemo(() => {
    switch (dataSwap?.type) {
      case "team":
        return dataSourceTargetsTeam;
      case "self":
        return dataSourceTargetsSelf;
      default:
        return [];
    }
  }, [dataSwap, dataSourceTargetsTeam, dataSourceTargetsSelf]);

  const [dataExchangeSwap, setDataExchangeSwap] = useState<{
    source?: SwapStructureType;
    target?: SwapStructureType;
  }>();

  const onFinish = (values: DataSwapType) => {
    console.log(values, "values");
  };
  useEffect(() => {
    form.setFieldsValue({
      ...dataSwap,
    });
  }, [dataSwap]);
  const getOptionsSupplier = (disabledId?: string) => {
    let handle = (dataSourceTarget: TargetsSupplierItem[]) =>
      dataSourceTarget?.map((item: TargetsSupplierItem) => ({
        label: get(item, "supplier.name", ""),
        value: get(item, "supplier._id", ""),
        disabled: get(item, "supplier._id", "") === disabledId,
      }));
    return handle(dataHandleTargetsHandle);
  };
  const onValuesChange = (change: DataSwapType, allValue: DataSwapType) => {
    const { resourceSupplierId, targetSupplierId, resourceValue, targetValue } =
    allValue;
    
    switch (true) {
      case !!change?.resourceSupplierId : 
      case !!change?.targetSupplierId:
        if(!!resourceSupplierId && !!targetSupplierId){          
          const dataTargetsSource = dataHandleTargetsHandle?.find(
            (dataItem: TargetsSupplierItem) =>
              get(dataItem, "supplier._id") === resourceSupplierId
          );
          const dataTargetsTarget = dataHandleTargetsHandle?.find(
            (dataItem: TargetsSupplierItem) =>
              get(dataItem, "supplier._id") === targetSupplierId
          );
          
          const dataExchange = dataExchangeHandle?.find(
            (dataItem: ExchangeRateType) =>
              [
                get(dataItem, "supplierAId"),
                get(dataItem, "supplierBId"),
              ]?.includes(resourceSupplierId || "") &&
              [
                get(dataItem, "supplierAId"),
                get(dataItem, "supplierBId"),
              ]?.includes(targetSupplierId || "")
          );
          
          const { exchangeRateA, exchangeRateB, supplierAId, supplierBId } =
            dataExchange || {};
          const rate =
            supplierAId === resourceSupplierId
              ? [exchangeRateA, exchangeRateB]
              : [exchangeRateB, exchangeRateA];
          let constructorSwapSource: any = {
            id: resourceSupplierId,
            rateSelf: rate[0],
            name: dataTargetsSource?.supplier?.name,
            rateTarget: rate[1],
            maxValue : dataTargetsSource?.saleCanChange || 0
          };
          let constructorSwapTarget: any = {
            id: targetSupplierId,
            rateSelf: rate[1],
            name: dataTargetsTarget?.supplier?.name,
            rateTarget: rate[0],
            maxValue : dataTargetsTarget?.saleCanChange || 0
          };
          const source = new SwapStructure({...constructorSwapSource});
          const target = new SwapStructure({...constructorSwapTarget});
          setDataExchangeSwap({
            source,
            target,
          });
        }
        
        break;

        case !!change?.resourceValue:  // Resource Change
        if(!!dataExchangeSwap){
          form.setFieldsValue({
            targetValue : dataExchangeSwap?.source?.handleExchange(resourceValue)
          })
        }
        break;
        case !!change?.targetValue:  // Target Change
        if(!!dataExchangeSwap){
          form.setFieldsValue({
            resourceValue : dataExchangeSwap?.target?.handleExchange(targetValue)
          })
        }
        break;
      default:
        break;
    }
  };

  const onSwap = () => {
    const cloneForm : DataSwapType = form.getFieldsValue();
    form.setFieldsValue({
      resourceSupplierId : cloneForm?.targetSupplierId,
      targetSupplierId : cloneForm?.resourceSupplierId,
      resourceValue : 0,
      targetValue : 0,
    });
    setDataExchangeSwap({
      source : dataExchangeSwap?.target,
      target : dataExchangeSwap?.source,
    })
  }
  return (
    <Form
      labelCol={{ span: 8 }}
      labelAlign="left"
      style={{ textAlign: "center" }}
      onFinish={onFinish}
      form={form}
      onValuesChange={onValuesChange}
    >
      <Form.Item<DataSwapType> hidden name={"type"} />
      <Row style={{ width: "100%" }}>
        <Col span={12}>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue,setFieldsValue }) => (
              <Form.Item<DataSwapType>
                name={"resourceValue"}
                label="Số lượng quy đổi"
                rules={[
                  ...requireRules,
                  ({}) => ({
                    validator(_, value) {
                      if (dataExchangeSwap?.source?.maxValue && value > dataExchangeSwap?.source?.maxValue) {
                        return Promise.reject(
                          "Đã vượt quá tối đa"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}

              >
                <InputNumberAnt
                  className="noPaddingAfterAddon"
                  addonAfter={
                    <Button
                      disabled={!getFieldValue("targetSupplierId") || !getFieldValue("resourceSupplierId")}
                      block
                      type="text"
                      onClick={() => setFieldsValue({
                        resourceValue : dataExchangeSwap?.source?.maxValue || 0,
                        targetValue : dataExchangeSwap?.source?.handleExchange(dataExchangeSwap?.source?.maxValue || 0)
                      })}
                    >
                      MAX
                    </Button>
                  }
                  disabled={!getFieldValue("targetSupplierId") || !getFieldValue("resourceSupplierId")}
                  min={1}
                  max={dataExchangeSwap?.source?.maxValue}
                  step={500000}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item<DataSwapType>
                name={"resourceSupplierId"}
                rules={requireRules}
              >
                <Select
                  popupMatchSelectWidth={false}
                  options={getOptionsSupplier(
                    getFieldValue("targetSupplierId")
                  )}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
      </Row>
    {dataExchangeSwap &&  <Flex
        gap={10}
        align={"center"}
        style={{ background: "#FBFBFC", borderRadius: 5, padding: 5 }}
      >
        Tối đa có thể quy đổi:
        <Typography.Text strong>
          {formatter(dataExchangeSwap?.source?.maxValue || 0)}
        </Typography.Text>{" "}
        {dataExchangeSwap?.source?.name || ""}
      </Flex>}
      <Button
        onClick={onSwap}
        type="dashed"
        icon={<SwapOutlined style={{ transform: "rotate(90deg)" }} />}
        style={{ marginBottom: 20 }}
      />
      <Row style={{ width: "100%" }}>
        <Col span={12}>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item<DataSwapType>
                name={"targetValue"}
                label="Số lượng nhận"
                rules={requireRules}
              >
                <InputNumberAnt
                  disabled={!getFieldValue("targetSupplierId") || !getFieldValue("resourceSupplierId")}
                  step={500000}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item<DataSwapType>
                name={"targetSupplierId"}
                rules={requireRules}
              >
                <Select
                  popupMatchSelectWidth={false}
                  options={getOptionsSupplier(
                    getFieldValue("resourceSupplierId")
                  )}
                />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Flex
        align={"center"}
        style={{ background: "#FBFBFC", borderRadius: 5, padding: 5 }}
        justify={"space-between"}
      >
        <span>Tỉ lệ quy đổi</span>
        <Flex gap={4} align={"center"}>
          <Typography.Text strong>
            {dataExchangeSwap?.source?.rateSelf || ""}
          </Typography.Text>{" "}
          {dataExchangeSwap?.source?.name || ""} ={" "}
          <Typography.Text strong>
            {dataExchangeSwap?.target?.rateSelf || ""}
          </Typography.Text>{" "}
          {dataExchangeSwap?.target?.name || ""}{" "}
          <Button type="text" icon={<SwapOutlined />} />
        </Flex>
      </Flex>
      <Button size="large" block type="primary" htmlType="submit">
        Quy đổi
      </Button>
    </Form>
  );
}
