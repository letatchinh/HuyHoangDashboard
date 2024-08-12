import { Col, Row, Select } from "antd";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import FilterByDate from "~/components/common/FilterByDate";
import ProductQuantityTable from "~/components/common/TableReportPersonnal/ProductQuantityTable";
import { filterSelectWithLabel } from "~/utils/helpers";
import {
  useGetReportIndividualCollaborators,
  useReportIndividualCollaboratorPaging,
  useReportIndividualCollaboratorQueryParams,
  useUpdateReportIndividualCollaboratorParams,
} from "../reportIndividualCollaborator.hook";
import { datatypeReportVi } from "../reportIndividualCollaborator.modal";
import Breadcrumb from "~/components/common/Breadcrumb";
import DebtTable from "~/components/common/TableReportPersonnal/DebtTable";
import BillTable from "~/components/common/TableReportPersonnal/BillTable";
type propsType = {};

const rangerTimeDef = "WEEKLY";

export default function ReportIndividualCollaborator(
  props: Partial<propsType>
): React.JSX.Element {

  const [query] = useReportIndividualCollaboratorQueryParams();

  const [, { onParamChange }] = useUpdateReportIndividualCollaboratorParams(query);
  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const paging = useReportIndividualCollaboratorPaging();

  const [data, isLoading] = useGetReportIndividualCollaborators(query);

  useEffect(() => {
    onParamChange({
      datatype: "reportProduct",
      rangerTime: date.map((time) => time.format("YYYY-MM-DD")).join(","),
      rangerType: rangerTimeDef,
    });
  }, []);

  useEffect(() => {
    if (query?.rangerTime) {
      let rangerTime: string = query?.rangerTime;
      setDate(map(rangerTime.split(","), (e: string) => dayjs(e)));
    } else setDate([dayjs().startOf("month"), dayjs().endOf("month")]);
  }, [query.rangerTime]);

  const renderTable = () => {
    switch (true) {
      case query?.datatype?.includes("Product"):
        return (
          <ProductQuantityTable
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
        );
      case query?.datatype?.includes("Bill"):
        return (
          <BillTable
            query={query}
            data={data}
            pagination={{
              ...paging,
              onChange({ page, pageSize }: any) {
                onParamChange({ page, limit: pageSize });
              },
              showSizeChanger: true,
              showTotal: (total: any) => `Tổng cộng: ${total} `,
            }}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <DebtTable
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
        );
    }
  };

  return (
    <div style={{ display: "block" }}>
      <Breadcrumb title={"Báo cáo doanh thu cá nhân khách hàng B2C"} />
      <FilterByDate
        onParamChange={onParamChange}
        query={query}
        isLoading={isLoading}
        dataOptions={datatypeReportVi}
        showRangerType={true}
        showSeller={false}
        showCollaborator={true}
        showProduct={true}
      />
      {renderTable()}
    </div>
  );
}
