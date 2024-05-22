import React, { useMemo, useState } from "react";
import { useFetchState } from "~/utils/hook";
import apis from "../reportOverview.api";
import { LegendDatum, ResponsivePie } from "@nivo/pie";
import { Tag} from "antd";
import { formatter } from "~/utils/helpers";
import { get, round } from "lodash";
import Breadcrumb from "~/components/common/Breadcrumb";

type typeMatch = "SUPPLIER" | "SALE_CHANNEL" | "AREA";
type typeAreaMatch = "area" | "city" | "district";
interface propsType {
  typeMatch?: typeMatch;
  typeAreaMatch?: typeAreaMatch;
  titleName?: string;
}
export default function ReportOverviewComponent(
  props: Partial<propsType>
): React.JSX.Element {
  const [customLegends, setCustomLegends] = useState<LegendDatum<any>[]>([]);

  const { typeMatch, typeAreaMatch, titleName } = props;
  const query = useMemo(
    () => ({ typeMatch, typeAreaMatch }),
    [typeMatch, typeAreaMatch]
  );
  const [dataReport, isLoading] = useFetchState({
    api: apis.getOverview,
    query: query,
    useDocs: false,
  });
  const totalPrice = useMemo(
    () =>
      dataReport?.reduce((sum: number, cur: any) => sum + get(cur, "value"), 0),
    [dataReport]
  );

  const percentageData = useMemo(() => {
    return dataReport?.map((item: any) => ({
      ...item,
      value: round(((item.value / totalPrice) * 100), 2)
    }));
  }, [dataReport, totalPrice]);

  return (
    <div style={{ width: "600px", aspectRatio: "3/2", display: "block" }}>
      <Breadcrumb title={`Biểu đồ theo ${titleName}`} />
      <ResponsivePie
        data={percentageData}
        id={"_id"}
        margin={{ top: 0, right: 290, bottom: 50, left: 20 }}
        innerRadius={0}
        padAngle={0}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "set3" }}
        borderWidth={1}
        valueFormat={(e) => formatter(e)}
        cornerRadius={0}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        tooltip={(e) => (
          <Tag bordered={true} color="default">
            {e.datum.label + " (" + formatter(e.datum.value) + ")"}
          </Tag>
        )}
        enableArcLinkLabels={false}
        arcLinkLabel="label"
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 86,
            translateY: 0,
            itemsSpacing: 0,
            itemWidth: 68,
            itemHeight: 23,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 15,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}
