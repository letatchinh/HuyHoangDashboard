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
type propsType = {};

const rangerTimeDef = "WEEKLY";

export default function ReportIndividualCollaborator(
  props: Partial<propsType>
): React.JSX.Element {
  const [query] = useReportIndividualCollaboratorQueryParams();

  const [, {  onParamChange }] =
    useUpdateReportIndividualCollaboratorParams(query);
  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const paging = useReportIndividualCollaboratorPaging();

  const [data, isLoading] = useGetReportIndividualCollaborators(query);
  useEffect(() => {
    console.log('data',data)
  }, [data]);
  useEffect(() => {
    onParamChange({
      // spaceType: spaceType,
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

  const options = useMemo(
    () =>
      Object.entries(datatypeReportVi)?.map((item: any) => ({
        label: item[1],
        value: item[0],
      })),
    [datatypeReportVi]
  );

  return (
    <div style={{ display: "block" }}>
      {/* <Row style={{ marginBottom: 20 }}> */}
        <FilterByDate onParamChange={onParamChange} query={query} isLoading={isLoading} />
        
      {/* </Row> */}
      <Row>
      <Col>
          <Select
            loading={isLoading}
            defaultValue={"reportProduct"}
            options={options}
            allowClear
            style={{ minWidth: 200, marginRight: "10%" }}
            popupMatchSelectWidth={false}
            filterOption={filterSelectWithLabel}
            onChange={(value) => onParamChange({ datatype: value || null })}
          ></Select>
        </Col>
      </Row>
      {/* <BillTable
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
      /> */}
      <ProductQuantityTable
        data={data}
        pagination={{
          ...paging,
          onChange( page:number, limit:number) {
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
