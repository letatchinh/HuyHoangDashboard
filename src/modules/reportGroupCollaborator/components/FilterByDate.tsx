import {
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { FILTER_BY_VI } from "~/constants/defaultValue";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import SelectEmployeeV2 from "~/modules/employee/components/SelectEmployeeV2";
import SelectProductBySupplier from "~/modules/product/components/SelectProductBySupplier";
import { filterSelectWithLabel } from "~/utils/helpers";
const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

type propsType = {
  onParamChange?: any;
  query?: any;
  isLoading?: boolean;
  showSeller?: boolean;
  showCollaborator?: boolean;
  showProduct?: boolean;
  onChange?: any;
  options?: any;
};
let styleFlex = {
  display: "flex",
  alignItems: "center",
} as CSSProperties;

const TitleRender = ({
  title,
  style = {},
}: {
  title: string;
  style?: CSSProperties;
}) => (
  <Typography style={{ ...style, fontSize: 14, marginRight: 16 }}>
    {title}:
  </Typography>
);
export default function FilterByDate(props: propsType): React.JSX.Element {
  const {
    onParamChange,
    query,
    isLoading,
    showSeller = true,
    showCollaborator = true,
    showProduct = true,
    onChange,
    options = [],
  } = props;
  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  useEffect(() => {
    if (query?.rangerTime) {
      let rangerTime: string = query?.rangerTime;
      setDate(map(rangerTime.split(","), (e: string) => dayjs(e)));
    } else setDate([dayjs().startOf("month"), dayjs().endOf("month")]);
  }, [query.rangerTime]);
  const [form] = Form.useForm();
  const optionsDate = useMemo(
    () =>
      Object.entries(FILTER_BY_VI)?.map((item: any) => ({
        label: item[1],
        value: item[0],
      })),
    [FILTER_BY_VI]
  );

  return (
    <div style={{ marginBottom: 24, width: "inherit" }}>
      <Row style={{ width: "100%", marginBottom: 20 }} wrap>
        <Col style={{ ...styleFlex, width: "420px" }}>
          <TitleRender title="Báo cáo" />
          <Select
            loading={isLoading}
            defaultValue={"reportProduct"}
            options={options}
            // allowClear
            style={{ marginRight: "10%" }}
            popupMatchSelectWidth={false}
            filterOption={filterSelectWithLabel}
            onChange={onChange}
          ></Select>
        </Col>
        <Col style={styleFlex}>
          <Space>
            <TitleRender title="Thời gian" />
            <RangePicker
              format={dateFormat}
              allowEmpty={[false, false]}
              value={[
                date[0] ? dayjs(date[0]) : null,
                date[1] ? dayjs(date[1]) : null,
              ]}
              onChange={(value) => {
                const P =
                  [
                    dayjs(value?.[0] ?? dayjs().startOf("month").valueOf()),
                    dayjs(value?.[1]),
                  ] ?? dayjs().endOf("month").valueOf();
                onParamChange({
                  rangerTime: P.map((e) => e.format("YYYY-MM-DD")),
                });
              }}
            />
          </Space>
        </Col>
        <Col style={{ ...styleFlex, width: "190px" }}>
          <TitleRender style={{ marginLeft: 16 }} title="Theo" />
          <Select
            loading={isLoading}
            defaultValue={"WEEKLY"}
            options={optionsDate}
            // allowClear
            style={{ marginRight: "10%" }}
            popupMatchSelectWidth={true}
            filterOption={filterSelectWithLabel}
            onChange={(value) => onParamChange({ rangerType: value || null })}
          />
        </Col>
      </Row>
      <Row>
        {showCollaborator && (
          <Col span={8}>
            <SelectCollaborator
              value={query?.sellerId ? query?.sellerId?.split(",") : []}
              onChange={(value) => onParamChange({ sellerId: value || null })}
              style={{ width: 200 }}
            />
          </Col>
        )}
        {showSeller && (
          <Col span={8}>
            <Form form={form} initialValues={{ employeeId: query?.sellerId }}>
              <SelectEmployeeV2
                validateFirst={false}
                form={form}
                style={{ width: 200 }}
                showIcon={false}
                size={"middle"}
                defaultValue={query?.sellerId || null}
                onChange={(value) => onParamChange({ sellerId: value })}
                // mode="multiple"
              />
            </Form>
          </Col>
        )}
        {query?.datatype?.includes("Product") && showProduct && (
          <Col span={8}>
            <Form form={form} initialValues={{ productId: query?.productId }}>
              <SelectProductBySupplier
                validateFirst={false}
                form={form}
                style={{ width: 200 }}
                showIcon={false}
                size={"middle"}
                defaultValue={query?.productId || null}
                onChange={(value) => onParamChange({ productId: value })}
              />
            </Form>
          </Col>
        )}
      </Row>
    </div>
  );
}
