import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { map } from "lodash";
import {
  useReportGroupCollaboratorPaging,
  useReportGroupCollaboratorQueryParams,
  useUpdateReportGroupCollaboratorParams,
} from "../reportGroupCollaborator.hook";
import { datatypeReportVi } from "../reportGroupCollaborator.modal";
import BillAndDebtTable from "../components/BillAndDebtTable";
import { TableRowSelection } from "antd/es/table/interface";
import ProductQuantityTable from "../components/ProductQuantityTable";
import FilterByDate from "../components/FilterByDate";
import { Select } from "antd";
type propsType = {};
const rangerTimeDef = "WEEKLY";
export default function ReportGroupCollaborator(
  props: propsType
): React.JSX.Element {
  const [mode, setMode] = useState("reportProduct");
  const [query] = useReportGroupCollaboratorQueryParams();
  const [, { onParamChange }] = useUpdateReportGroupCollaboratorParams(query);

  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const paging = useReportGroupCollaboratorPaging();

  useEffect(() => {
    if (query?.rangerTime) {
      let rangerTime: string = query?.rangerTime;
      setDate(map(rangerTime.split(","), (e: string) => dayjs(e)));
    } else setDate([dayjs().startOf("month"), dayjs().endOf("month")]);
  }, [query.rangerTime]);

  useEffect(() => {
    onParamChange({ getByRanger: mode.includes("RangerType") });
  }, [mode]);

  const renderTable = () => {
    const hasProductKey = Object.keys(datatypeReportVi).some(
      (key) => key.includes("Product") && mode === key
    );

    return hasProductKey ? (
      <ProductQuantityTable
        query={query}
        pagination={{
          ...paging,
          onChange(page: number, limit: number) {
            onParamChange({ page, limit });
          },
          showSizeChanger: true,
          showTotal: (total: any) => `Tổng cộng: ${total} `,
        }}
      />
    ) : (
      <BillAndDebtTable
        query={query}
        pagination={{
          ...paging,
          onChange(page: number, limit: number) {
            onParamChange({ page, limit });
          },
          showSizeChanger: true,
          showTotal: (total: any) => `Tổng cộng: ${total} `,
        }}
      />
    );
  };
  useEffect(() => {
    onParamChange({
      // datatype: "reportProduct",
      rangerTime: date.map((time) => time.format("YYYY-MM-DD")).join(","),
      rangerType: rangerTimeDef,
      getByRanger: false,
    });
  }, []);
  const options = useMemo(
    () =>
      Object.entries(datatypeReportVi)?.map((item: any) => ({
        label: item[1],
        value: item[0],
      })),
    [datatypeReportVi]
  );
  
  return (
    <div>
      <FilterByDate
        onParamChange={onParamChange}
        query={query}
        showSeller={false}
        showCollaborator={false}
        showProduct={true}
        onChange={(value: string) => setMode(value)}
        options={options}
      />
      {renderTable()}
    </div>
  );
}
