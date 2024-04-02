import { ColumnsType } from "antd/es/table/InternalTable";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useBranchPaging, useBranchQueryParams, useGetBranches, useUpdateBranchParams
} from "../branch.hook";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import { useChangeDocumentTitle } from "~/utils/hook";
const columns : ColumnsType = [
  {
    title : "Tên chi nhánh",
    dataIndex : "name",
    key : "name",
  },
  // {
  //   title : "Email",
  //   dataIndex : "email",
  //   key : "email",
  // },
  {
    title : "Địa chỉ",
    dataIndex : "address",
    key : "address",
    render(value, record, index) {
      return concatAddress(value)
    },
  }
]
export default function Branch() {
  const { t }: any = useTranslate();
  const [query] = useBranchQueryParams();
  // const [keyword, { setKeyword, onParamChange }] = useUpdateBranchParams(query);
  const [data, isLoading] = useGetBranches(query);
  const paging = useBranchPaging(); 
  useChangeDocumentTitle("Danh sách chi nhánh")
  return (
    <div>
      <Breadcrumb title={t("Danh sách chi nhánh")} />
      <WhiteBox>
        <SelectSearch
        showSelect = {false}
        isShowButtonAdd
        />
        <TableAnt
          dataSource={data} 
          loading={isLoading}
          rowKey={rc => rc?._id}
          columns={columns}
          size='small'
          // pagination={{
          //   ...paging,
          //   onChange(page, pageSize) {
          //     // onParamChange({ page, limit: pageSize });
          //   },
          //   showTotal: (total) => `Tổng cộng: ${total}`,
          // }}
          pagination={false}
          stickyTop
        />
      </WhiteBox>
    </div>
  );
}
