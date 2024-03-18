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
type propsType = {

}
export default function ReportEmployee(props:propsType) : React.JSX.Element {
      const [query] = useReportEmployeeQueryParams();
    //   const [data, isLoading] = useGetReportEmployees(query);
      const [openDetail,setOpenDetail] = useState(true);
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
      ];
    return (
        <div>
      <Breadcrumb title={"Nhóm bán hàng"} />
      <WhiteBox>
        <SelectSearch
          showSelect={false}
        />
        <TableAnt
        //   dataSource={data}
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