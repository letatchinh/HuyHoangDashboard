import React from "react";
import Context from "../components/Context";
import TableReport from "../components/TableReport";

type propsType = {};
export default function ReportSalaryPartner(
  props: propsType
): React.JSX.Element {

  return (
    <Context >
      <div className="report-salary-container">
        <TableReport/>
      </div>
    </Context>
  );
}
