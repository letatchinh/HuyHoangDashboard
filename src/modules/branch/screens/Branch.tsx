import { ColumnsType } from "antd/es/table/InternalTable";
import TableAnt from "~/components/Antd/TableAntd";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useBranchPaging, useGetBranches
} from "../branch.hook";
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
  const [data, isLoading] = useGetBranches();
  const paging = useBranchPaging();
  console.log(data,'data');
  return (
    <div>
      <Breadcrumb title={t("list-branch")} />
      <WhiteBox>
        <TableAnt
          dataSource={data}
          loading={isLoading}
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
