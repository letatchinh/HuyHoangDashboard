import React, { useEffect, useMemo, useState } from "react";
import {
  useReportGroupEmployeeSellerPaging,
  useReportGroupEmployeeSellerQueryParams,
  useUpdateReportGroupEmployeeSellerParams,
} from "../reportGroupEmployeeSeller.hook";
import dayjs from "dayjs";
import { map } from "lodash";
import { datatypeReportVi } from "~/modules/reportGroupCollaborator/reportGroupCollaborator.modal";
import FilterByDate from "~/modules/reportGroupCollaborator/components/FilterByDate";
import ProductQuantityTable from "../components/ProductQuantityTable";
import BillAndDebtTable from "../components/BillAndDebtTable";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectGroupSeller from "../components/SelectGroupSeller";
import { Col, Row, Typography } from "antd";

type propsType = {};

const rangerTimeDef = "WEEKLY";
export default function ReportGroupEmployeeSeller(
  props: propsType
): React.JSX.Element {
  const [mode, setMode] = useState("reportProduct");
  const [query] = useReportGroupEmployeeSellerQueryParams();
  const [, { onParamChange }] = useUpdateReportGroupEmployeeSellerParams(query);

  const [date, setDate] = useState<any[]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const paging = useReportGroupEmployeeSellerPaging();

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
      <ProductQuantityTable query={query} />
    ) : (
      <BillAndDebtTable query={query} />
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
      <Breadcrumb title={"Báo cáo doanh thu đội nhóm trình dược viên"} />
      <FilterByDate
        onParamChange={onParamChange}
        query={query}
        showSeller={false}
        showCollaborator={false}
        showProduct={true}
        onChange={(value: string) => setMode(value)}
        options={options}
      />
      <Row style={{ width: "100%", marginBottom: 20 }} wrap>
        <Col span={2}>
          <Typography>Đội nhóm: </Typography>
        </Col>
        <Col span={6}>
          <SelectGroupSeller
            query={query}
            value={query?.salesGroupId ? query?.salesGroupId?.split(",") : []}
            onChange={(value) => onParamChange({ salesGroupId: value || null })}
          />
        </Col>
      </Row>
      {renderTable()}
    </div>
  );
}
