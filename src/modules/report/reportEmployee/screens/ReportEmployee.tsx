import { ColumnsType } from "antd/es/table/InternalTable";
import { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import DetailReport from "../components/DetailReport/index";
import {
    useDeleteReportEmployee,
    useGetReportEmployees,
    useReportEmployeeQueryParams
} from "../reportEmployee.hook";
import data from './data.json'
import { get } from "lodash";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import { Typography } from "antd";
import { formatter } from "~/utils/helpers";
import dayjs from "dayjs";
type propsType = {

}
const CLONE_EMPLOYEE_LEVEL_VI : any = EMPLOYEE_LEVEL_VI;
export default function ReportEmployee(props:propsType) : React.JSX.Element {
      const [query] = useReportEmployeeQueryParams();
    //   const [data, isLoading] = useGetReportEmployees(query);
      const [openDetail,setOpenDetail] = useState(false);
      const [id,setId] = useState<any>();

      const onOpenDetail = useCallback((idSelect : any) => {
        setOpenDetail(true);
        setId(idSelect)
      },[]);
      const onCloseDetail = useCallback(() => {
        setOpenDetail(false);
        setId(null)
      },[]);
      const [, deleteReportEmployee]: any = useDeleteReportEmployee();
    
      const columns: ColumnsType = [
        {
          title : "Tên nhân viên",
          dataIndex : "employee",
          key : "employee",
          render: (employee: any) => <span>{get(employee,'employeeNumber')} - {get(employee,'fullName')}</span>
        },
        {
          title : "Vị trí",
          dataIndex : "employee",
          key : "employee",
          render: (employee: any) => CLONE_EMPLOYEE_LEVEL_VI?.[employee?.employeeLevel]
        },
        {
          title : "Ngày kết toán",
          dataIndex : "createdAt",
          key : "createdAt",
          render: (createdAt: any) => dayjs(createdAt).format("DD/MM/YYYY")
        },
        {
          title : "Lương",
          dataIndex : "salary",
          key : "salary",
          render: (salary: any) => <Typography.Text strong>{formatter(salary || 0)}</Typography.Text>
        },
      ];
    return (
        <div>
      <Breadcrumb title={"Báo cáo lương"} />
      <WhiteBox>
        <SelectSearch
          showSelect={false}
        />
        <TableAnt
          dataSource={data}
        //   loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={false}
          bordered
        />
        <ModalAnt width={1000} footer={null} onCancel={onCloseDetail} open={openDetail}>
            <DetailReport />
        </ModalAnt>
      </WhiteBox>
    </div>
    )
}