import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useMemo, useState } from "react";
import { get, reduce, truncate } from "lodash";
import apis from "../reportProductSupplier.api";
import { useFetchState } from "~/utils/hook";
import { Radio, Row, Space, Typography } from "antd";
import {
  FILTER_BY_VI,
  TYPE_REPORT,
  TYPE_REPORT_VI,
} from "../reportProductSupplier.modal";
import { Select } from "antd/lib";
import { formatter } from "~/utils/helpers";
import { useUpdateReportProductSupplierParams } from "../reportProductSupplier.hook";

interface propsType {
  spaceType?: any;
  dataType?: keyof typeof TYPE_REPORT;
  rangerTime?: any;
  rangerType?: any;
}

export default function ReportChart(
  props: Partial<propsType>
): React.JSX.Element {
  const { spaceType, dataType, rangerTime, rangerType } = props;
  //   const [viewMode, setViewMode] = useState(TYPE_REPORT);
  //   const [data, setData] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);

  const [keySelect, setKeySelect] = useState<string>(TYPE_REPORT.groupProduct);
  const query = useMemo(
    () => ({ spaceType, dataType, rangerTime, rangerType }),
    [spaceType, dataType, rangerTime, rangerType]
  );
  const [dataReport, isLoading] = useFetchState({
    api: apis.getListChart,
    query: query,
    useDocs: false,
  });

  const keyInData = useMemo(() => {
    if (dataReport) {
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
  console.log(keyInData, "keyInData");
  console.log(dataReport?.data, "dataReport?.data?.[keySelect]");
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateReportProductSupplierParams(query);
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
            {Object.entries(TYPE_REPORT_VI).map(([key, value]: any) => (
              <Radio.Button key={key} value={key}>
                {value}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Row>
      </Space>
      <Space>
        <Select options={FILTER_BY_VI}></Select>
      </Space>

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
            groupMode="grouped"
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
                <span>
                  {get(detail, [e.id], e.id) +
                    ": " +
                    Number(e.value).toLocaleString("vi")}
                </span>
              );
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -30,
              legend: "_id",
              legendPosition: "middle",
              legendOffset: 32,
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
            // layers={['grid', 'axes', 'bars', 'markers', 'legends', 'annotations', 'totals']}
            // totalsOffset={6}
            // enableTotals={true}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1.6]],
            }}
            legends={[
              {
                dataFrom: "keys",
                data: [],
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,

                itemDirection: "left-to-right",
                itemOpacity: 0.5,
                symbolSize: 24,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            role="application"
            barAriaLabel={(e) =>
              e.id + ": " + e.formattedValue + " in country: " + e.indexValue
            }
          />
        </div>
      </div>
    </div>
  );
}
