import React, { useEffect, useState } from "react";
import FilterByDate from "~/components/common/FilterByDate";

import dayjs from "dayjs";
import { map } from "lodash";
import {
  useGetReportGroupCollaborators,
  useReportGroupCollaboratorPaging,
  useReportGroupCollaboratorQueryParams,
  useUpdateReportGroupCollaboratorParams,
} from "../reportGroupCollaborator.hook";
import { datatypeReportVi } from "../reportGroupCollaborator.modal";
import BillAndDebtTable from "../components/BillAndDebtTable";
type propsType = {};
const rangerTimeDef = "WEEKLY";
export default function ReportGroupCollaborator(
  props: propsType
): React.JSX.Element {
  const [query] = useReportGroupCollaboratorQueryParams();

  const [, { onParamChange }] = useUpdateReportGroupCollaboratorParams(query);
  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const paging = useReportGroupCollaboratorPaging();

  const [data, isLoading] = useGetReportGroupCollaborators(query);
  console.log(data, "data");

  useEffect(() => {
    onParamChange({
      // datatype: "reportProduct",
      // rangerTime: date.map((time) => time.format("YYYY-MM-DD")).join(","),
      // rangerType: rangerTimeDef,
      getByRanger: false,
    });
  }, []);

  // useEffect(() => {
  //   if (query?.rangerTime) {
  //     let rangerTime: string = query?.rangerTime;
  //     setDate(map(rangerTime.split(","), (e: string) => dayjs(e)));
  //   } else setDate([dayjs().startOf("month"), dayjs().endOf("month")]);
  // }, [query.rangerTime]);

  return (
    <div>
      <FilterByDate
        onParamChange={onParamChange}
        query={query}
        isLoading={isLoading}
        dataOptions={datatypeReportVi}
        showRangerType={false}
        showSeller={false}
        showCollaborator={false}
        showProduct={true}
      />
      <BillAndDebtTable
        query={query}
        data={data}
        pagination={{
          ...paging,
          onChange(page: number, limit: number) {
            onParamChange({ page, limit });
          },
          showSizeChanger: true,
          showTotal: (total: any) => `Tổng cộng: ${total} `,
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
