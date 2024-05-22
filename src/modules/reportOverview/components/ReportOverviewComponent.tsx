import React, { useMemo, useState } from "react";
import { useFetchState } from "~/utils/hook";
import apis from "../reportOverview.api";
import { LegendDatum, ResponsivePie } from "@nivo/pie";
import { Button, Modal, Tag } from "antd";
import { formatter } from "~/utils/helpers";
import { get, round } from "lodash";
import Breadcrumb from "~/components/common/Breadcrumb";
import { ColumnsType } from "antd/es/table";
import TableAnt from "~/components/Antd/TableAnt";

type typeMatch = "SUPPLIER" | "SALE_CHANNEL" | "AREA";
type typeAreaMatch = "area" | "city" | "district";
interface propsType {
  typeMatch?: typeMatch;
  typeAreaMatch?: typeAreaMatch;
  titleName?: string;
  displayMode?: any;
}
export default function ReportOverviewComponent(
  props: Partial<propsType>
): React.JSX.Element {
  const { typeMatch, typeAreaMatch, titleName, displayMode } = props;
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [id, setId] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [current, setCurrent] = useState(1);
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
      value: round((item.value / totalPrice) * 100, 2),
    }));
  }, [dataReport, totalPrice]);

  const onOpenForm = (id?: any) => {
    setId(id);
    setIsOpenForm(true);
  };
  const onCloseForm = () => {
    setId(null);
    setIsOpenForm(false);
  };

  const onPagingChangeLocal = (current : any) => {
    setCurrent(current);
  };

  const columns: ColumnsType = [
    {
      title: "STT",
      key: "index",
      width: 50,
      render: (text, record, index) => {
        return (+pagination.page - 1) * pagination.limit + index + 1;
      }
    },
    {
      title: "Tên",
      dataIndex: "label",
      key: "label",
      width: 250,
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      render: (record) => {
        return formatter(record);
      },
    },
  ];

  return (
    <div style={{ width: "600px", aspectRatio: "3/2", display: "block" }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Breadcrumb title={`Biểu đồ theo ${titleName}`} />
        <Button type="primary" onClick={() => onOpenForm()}>
          Chi tiết
        </Button>
      </div>
      <ResponsivePie
        data={displayMode === "PERCENT" ? percentageData : dataReport}
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
      <Modal
        width={500}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <TableAnt
          dataSource={
            (displayMode === "PERCENT" ? percentageData : dataReport) || []
          }
          onChange={onPagingChangeLocal}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={{
            current,
            showTotal: (total) => `Tổng cộng: ${total} `,
            onChange: (page) => {
              setPagination({ ...pagination, page: page });
            }
          }}
          stickyTop
        />
      </Modal>
    </div>
  );
}
