import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useMemo, useState } from "react";
import { get, map, reduce, truncate } from "lodash";
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
import dayjs, { Dayjs } from "dayjs";
import SelectPharmacy from "~/modules/sale/bill/components/SelectPharmacy";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import SelectProductBySupplier from "~/modules/product/components/SelectProductBySupplier";
import SelectArea from "./SelectArea";
import subvn from "~/core/subvn";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

interface propsType {
  query?: any;
  spaceType?: any;
}

export default function ReportChart(
  props: Partial<propsType>
): React.JSX.Element {
  const { query, spaceType } = props;

  const [keyword, { setKeyword, onParamChange }] =
    useUpdateReportProductSupplierParams(query);

  const [form] = Form.useForm();
  const [date, setDate] = useState<any[]>([null, null]);
  const [detail, setDetail] = useState<any>(null);
  const cities = subvn.getProvinces();
  const areas = useMemo(() => subvn.getAreas(), []);
  const memoQuery = useMemo(
    () => ({
      api: apis.getListChart,
      query: query,
      useDocs: false,
      required: ["dataType"] as (keyof getReportProductbody)[],
      ...date,
    }),
    [query, date]
  );
  

  const [dataReport, isLoading] = useFetchState(memoQuery);


  useEffect(() => {
    if (query?.rangerTime) {
      let rangerTime: string = query?.rangerTime;
      setDate(map(rangerTime.split(","), (e: string) => dayjs(e)));
    } else setDate([dayjs().startOf("month"), dayjs().endOf("month")]);
  }, [query.rangerTime]);

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

  function checkKeyContainsGroupByRangerDate(
    key: keyof typeof TYPE_REPORT
  ): boolean {
    return key.includes("groupByRangerDate");
  }
  const options = useMemo(
    () =>
      Object.entries(TYPE_REPORT_VI)?.map((item: any) => ({
        label: item[1],
        value: item[0],
      })),
    [TYPE_REPORT_VI]
  );

  return (
    <div>
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Space>
            <Typography style={{ fontSize: 14, marginRight: 20 }}>
              Phân loại:
            </Typography>
            <Select
              loading={isLoading}
              defaultValue={"groupProduct"}
              options={options}
              allowClear
              style={{ minWidth: 300 }}
              popupMatchSelectWidth={false}
              filterOption={filterSelectWithLabel}
              onChange={(value) => onParamChange({ dataType: value || null })}
            ></Select>
          </Space>
        </Col>
        <Col span={12}>
          <Space>
            <Typography style={{ fontSize: 14, marginRight: 20 }}>
              Thời gian:
            </Typography>
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
                // setDate(P);
              }}
            />
          </Space>
        </Col>
      </Row>
      <Row
        justify="space-around"
        gutter={[16, 24]}
        style={{ marginLeft: 2, marginRight: 2 }}
      >
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
            onChange={(value) => onParamChange({ productId: value || null })}
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
            margin={{ top: 20, right: 200, bottom: 100, left: 100 }}
            padding={0.5}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={{ scheme: "red_yellow_blue" }}
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
              legend: `Biểu đồ thống kê`,
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
