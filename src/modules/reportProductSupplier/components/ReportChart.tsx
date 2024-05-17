import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useMemo, useState } from "react";
import { get, reduce, truncate } from "lodash";
import apis from "../reportProductSupplier.api";
import { useFetchState } from "~/utils/hook";
import {
  Col,
  DatePicker,
  Form,
  Radio,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  FILTER_BY_VI,
  TYPE_REPORT,
  TYPE_REPORT_VI,
  getReportProductbody,
} from "../reportProductSupplier.modal";
import { filterSelectWithLabel, formatter } from "~/utils/helpers";
import {
  useReportProductSupplierQueryParams,
  useUpdateReportProductSupplierParams,
} from "../reportProductSupplier.hook";
import apiSupplier from "~/modules/supplier/supplier.api";
import apiPharmacy from "~/modules/pharmacy/pharmacy.api";
import dayjs from "dayjs";
import SelectPharmacy from "~/modules/sale/bill/components/SelectPharmacy";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import SelectProductBySupplier from "~/modules/product/components/SelectProductBySupplier";
import SelectArea from "./SelectArea";
import subvn from "~/core/subvn";

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
// interface propsType {
//   spaceType?: any;
//   dataType?: keyof typeof TYPE_REPORT;
//   rangerTime?: any[];
//   rangerType?: any;
// }
interface propsType {
  query?: any;
  spaceType?: any;
}

export default function ReportChart(
  props: Partial<propsType>
): React.JSX.Element {
  const { query, spaceType } = props;
  console.log(query,'query');
  
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateReportProductSupplierParams(query);
  const [form] = Form.useForm();
  const [date, setDate] = useState<any>([]);
  const [detail, setDetail] = useState<any>(null);

  const cities = subvn.getProvinces();
  const areas = useMemo(() => subvn.getAreas(), []);
  const memoQuery = useMemo(
    () => ({
      api: apis.getListChart,
      query: query,
      useDocs: false,
      required: ["dataType"] as (keyof getReportProductbody)[],
    }),
    [query]
  );
  const [dataReport, isLoading] = useFetchState(memoQuery);
  useEffect(() => {
    if (query) {
      setDate({
        rangerTime: query?.rangerTime,
      });
    }
  }, [query]);

  const keyInData = useMemo(() => {
    if (dataReport) {
      setDetail(dataReport?.info);
      return reduce(
        dataReport?.data,
        (result: string[], current: { [key: string]: unknown }) => {
          const listKey: string[] = Object.keys(current).filter(
            (el) => el !== "_id"
          );
          listKey.map((key: string) => {
            if (!result.includes(key)) {
              result.push(key);
            }
          });
          return result;
        },
        [] as Array<string>
      );
    }
    return [];
  }, [dataReport]);

  const onChange = (e: any) => {
    onParamChange({ dataType: e.target.value });
  };

  return (
    <div>
      <Space style={{ marginBottom: 20 }}>
        <Typography style={{ fontSize: 14, marginRight: 20 }}>
          Phân loại:
        </Typography>
        <Row gutter={14}>
          <Radio.Group
            onChange={onChange}
            optionType="button"
            buttonStyle="solid"
            defaultValue={"groupProduct"}
          >
            {Object.entries(TYPE_REPORT).map(([key, value]: any) => (
              <Radio.Button key={key} value={key}>
                {TYPE_REPORT_VI[value]}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Row>
      </Space>
      {/* <Row>
        <Col span={12}>
          <Space>
            <Select
              // className="right--parent"
              // placeholder="Kênh bán hàng"
              defaultValue={TYPE_REPORT_VI["groupProduct"]}
              options={options}
              style={{ width: "100%" }}
              showSearch
              filterOption={filterSelectWithLabel}
            />
          </Space>
        </Col>
        <Col span={12}>
          <RangePicker
            format={dateFormat}
            allowEmpty={[false, false]}
            value={[
              date[0] ? dayjs(date[0]) : null,
              date[1] ? dayjs(date[1]) : null,
            ]}
            onChange={(value) => {
              setDate({
                rangerTime: [
                  dayjs(value[0]).format("YYYY-MM-DD"),
                  dayjs(value[1]).format("YYYY-MM-DD"),
                ],
              });
            }}
          />
        </Col>
      </Row> */}
      <Row justify="space-around" gutter={[16, 24]}>
        <Col span={4}>
          {spaceType !== "partner" ? (
            <Form form={form} initialValues={{ pharmacyId: query?.customerId }}>
              <SelectPharmacy
                validateFirst={false}
                form={form}
                style={{ width: 200 }}
                showIcon={false}
                size={"middle"}
                defaultValue={query?.customerId || null}
                onChange={(value) => onParamChange({ customerId: value })}
              />
            </Form>
          ) : (
            <SelectCollaborator
              value={query?.customerId ? query?.customerId?.join(",") : []}
              onChange={(value) => onParamChange({ customerId: value || null })}
              style={{ width: 200 }}
            />
          )}
        </Col>
        <Col span={4}>
          <SelectSupplier
            value={query?.supplierId ? query?.supplierId?.split(",") : []}
            onChange={(value) => onParamChange({ supplierId: value || null })}
            style={{ width: 200 }}
            mode="multiple"
          />
        </Col>
        <Col span={4}>
          <SelectProductBySupplier
            value={query?.productId ? query?.productId?.split(",") : []}
            onChange={(value) => {
              console.log(value, "value");
              
              return onParamChange({ productId: value || null })}}
            style={{ width: 200 }}
            mode="multiple"
          />
        </Col>
        <Col span={4}>
          <SelectArea
            data={areas}
            placeholder="Miền"
            value={query?.areaId ? query?.areaId?.split(",") : []}
            onChange={(value) => onParamChange({ areaId: value || null })}
            style={{ width: 200 }}
            mode="multiple"
          />
        </Col>
        <Col span={4}>
          <SelectArea
            data={cities}
            placeholder="Tỉnh"
            value={query?.cityId ? query?.cityId?.split(",") : []}
            onChange={(value) => onParamChange({ cityId: value || null })}
            style={{ width: 200 }}
            mode="multiple"
          />
        </Col>
      </Row>
      {/* <Row justify={"space-around"}>
        <Col span={12}>
          <SelectArea
            data={cities}
            placeholder="Tỉnh"
            value={query?.cityId ? query?.cityId?.split(",") : []}
            onChange={(value) => onParamChange({ cityId: value || null })}
            style={{ width: 250 }}
          />
        </Col>
        <Col span={12}></Col>
      </Row> */}
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div style={{ width: "100%", height: "80%" }}>
          <ResponsiveBar
            data={dataReport?.data ?? []}
            keys={keyInData}
            indexBy="_id"
            margin={{ top: 50, right: 200, bottom: 100, left: 100 }}
            padding={0.5}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "nivo" }}
            enableTotals={true}
            valueFormat={(value?: any) => formatter(value)}
            groupMode="stacked"
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "#38bcb2",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "#eed312",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "fries",
                },
                id: "dots",
              },
              {
                match: {
                  id: "sandwich",
                },
                id: "lines",
              },
            ]}
            borderColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            onClick={(e) => {
              console.log("e :>> ", e);
            }}
            label={(key) => {
              return Number(key.value).toLocaleString("vi");
            }}
            tooltip={(e) => {
              return (
                <Tag color={e.color}>
                  {get(detail, [e.id], e.id) +
                    ": " +
                    Number(e.value).toLocaleString("vi")}
                </Tag>
              );
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -30,
              legend: `Biểu đồ thống kê}`,
              legendPosition: "middle",
              legendOffset: 72,
              // truncateTickAt: 10,
              format: (value) =>
                truncate(get(detail, [value], value), {
                  length: 10,
                }),
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: "middle",
              legendOffset: -40,
              truncateTickAt: 0,
              format: (v) => Number(v).toLocaleString("vi"),
            }}
            enableLabel={false}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[]}
            role="application"
            // barAriaLabel={(e) =>
            //   e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            // }
          />
        </div>
      </div>
    </div>
  );
}
