import { Col, Form, Row, Typography } from "antd";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectCollaboratorV2 from "~/modules/collaborator/components/SelectCollaboratorV2";
import BillAndDebtTable from "../components/BillAndDebtTable";
import FilterByDate from "../components/FilterByDate";
import ProductQuantityTable from "../components/ProductQuantityTable";
import {
  useReportGroupCollaboratorPaging,
  useReportGroupCollaboratorQueryParams,
  useUpdateReportGroupCollaboratorParams,
} from "../reportGroupCollaborator.hook";
import { datatypeReportVi } from "../reportGroupCollaborator.modal";
type propsType = {};
const rangerTimeDef = "WEEKLY";
export default function ReportGroupCollaborator(
  props: propsType
): React.JSX.Element {
  const [mode, setMode] = useState("reportProduct");
  const [query] = useReportGroupCollaboratorQueryParams();
  const [, { onParamChange }] = useUpdateReportGroupCollaboratorParams(query);
  const [form] = Form.useForm();
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
      />
    ) : (
      <BillAndDebtTable
        query={query}
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
      <Breadcrumb title={"Báo cáo doanh thu đội nhóm cộng tác viên"} />
      <FilterByDate
        onParamChange={onParamChange}
        query={query}
        showSeller={false}
        showCollaborator={false}
        showProduct={true}
        onChange={(value: string) => setMode(value)}
        options={options}
      />
      <Row style={{ width: "100%", marginBottom: 24 }}>
        <Col span={8} style={{ display: "flex", alignItems: "center", width: "420px"  }}>
        <Typography style={{ fontSize: 14, marginRight: 16 }}>Tìm kiếm theo:</Typography>
          <Form form={form} initialValues={{ collaboratorId: query?.sellerId }}>
            <SelectCollaboratorV2
              validateFirst={false}
              form={form}
              style={{ width: 200 }}
              showIcon={false}
              size={"middle"}
              defaultValue={query?.sellerId || null}
              onChange={(value) => onParamChange({ sellerId: value })}
              // mode="multiple"
            />
          </Form>
        </Col>
      </Row>
      {renderTable()}
    </div>
  );
}
