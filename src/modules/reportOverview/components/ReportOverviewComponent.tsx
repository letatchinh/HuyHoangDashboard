import React, { useMemo } from "react";
import { useFetchState } from "~/utils/hook";
import apis from "../reportOverview.api";
import { ResponsivePie } from "@nivo/pie";
import { Tag } from "antd";
import { formatter } from "~/utils/helpers";

type typeMatch = "SUPPLIER" | "SALE_CHANNEL" | "AREA";
type typeAreaMatch = "area" | "city" | "district";
interface propsType {
  typeMatch?: typeMatch;
  typeAreaMatch?: typeAreaMatch;
}
export default function ReportOverviewComponent(
  props: Partial<propsType>
): React.JSX.Element {
  const { typeMatch, typeAreaMatch } = props;
  const query = useMemo(
    () => ({ typeMatch, typeAreaMatch }),
    [typeMatch, typeAreaMatch]
  );
  const [dataReport, isLoading] = useFetchState({
    api: apis.getOverview,
    query: query,
    useDocs: false,
  });

  return (
    <div style={{ width: "100%", aspectRatio: "5/6" }}>
      <ResponsivePie
        data={dataReport}
        id={"_id"}
        margin={{ top: 40, right: 80, bottom: 250, left: 80 }}
        innerRadius={0.5}
        padAngle={1}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        valueFormat={(e) => formatter(e)}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        tooltip={(e) => <Tag color={e.datum.color}>{e.datum.label}</Tag>}
        enableArcLinkLabels={false}
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
            anchor: "bottom",
            direction: "column",
            justify: false,
            translateX: 0,
            translateY: 150,
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 18,
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
