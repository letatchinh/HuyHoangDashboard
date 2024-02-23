import { ColumnsType } from "antd/es/table/InternalTable";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useBranchPaging, useGetBranches
} from "../branch.hook";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
const columns : ColumnsType = [
  {
    title : "Tên chi nhánh",
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
export default function Branch() {
  const { t }: any = useTranslate();
  // const [query] = useBranchQueryParams();
  // const [keyword, { setKeyword, onParamChange }] = useUpdateBranchParams(query);
  // const [data, isLoading] = useGetBranches();
  const paging = useBranchPaging();
  return (
    <div>
      <Breadcrumb title={t("list-branch")} />
      <WhiteBox>
        <SelectSearch
        showSelect = {false}
        isShowButtonAdd
        />
        <TableAnt
          dataSource={[]}
          // loading={isLoading}
          rowKey={rc => rc?._id}
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
