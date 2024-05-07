import React from "react";
import Context from "../components/Context";
import TableReport from "../components/TableReport";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";

type propsType = {};
export default function ReportSalaryPartner(
  props: propsType
): React.JSX.Element {

  return (
    <Context >
      <WhiteBox className="report-salary-container">
        <Breadcrumb title={'Báo cáo lương cộng tác viên'}/>
        <TableReport/>
      </WhiteBox>
    </Context>
  );
}
