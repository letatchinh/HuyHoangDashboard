import { ColumnsType } from "antd/es/table/InternalTable";
import TableAnt from "~/components/Antd/TableAntd";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useEmployeePaging, useEmployeeQueryParams, useGetEmployeees, useUpdateEmployeeParams
} from "../employee.hook";
const columns : ColumnsType = [
  {
    title : "Tên nhân viên",
    dataIndex : "name",
    key : "name",
  },
  {
    title : "Địa chỉ",
    dataIndex : "address",
    key : "address",
    render(value, record, index) {
      return concatAddress(value)
    },
  }
]
export default function Employee() {
  const { t }: any = useTranslate();
  const [query] = useEmployeeQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateEmployeeParams(query);
  const [data, isLoading] = useGetEmployeees();
  const paging = useEmployeePaging();
  return (
    <div>
      <Breadcrumb title={t("Quản lý nhân viên")} />
      <WhiteBox>
        <TableAnt
          dataSource={ []}
          // loading={isLoading}
          columns={columns}
          size='small'
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              // onParamChange({ page, limit: pageSize });
            },
          }}
        />
      </WhiteBox>
    </div>
  );
}

