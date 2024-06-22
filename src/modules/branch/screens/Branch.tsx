import { Button, Tag } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import { useChangeDocumentTitle } from "~/utils/hook";
import StatusTagWarehouse from "../components/StatsusTagWarehouse";
import useBranchContext, { BranchProviderContext } from "../store/BranchContext";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";

export default function BranchScreen() {
  useChangeDocumentTitle("Danh sách chi nhánh");
  const {closeForm, openForm,openFormApiKey, branches, paging, id, isSubmitLoading, isLoading, onParamChange} = useBranchContext();
  const { t }: any = useTranslate();
  const canUpdateApiKey = useMatchPolicy(POLICIES.UPDATE_WAREHOUSELINK);
  const columns : ColumnsType = [
    {
      title : "Tên chi nhánh",
      dataIndex : "name",
      key: "name",
      width: 300,
    },
    {
      title : "Địa chỉ",
      dataIndex : "address",
      key: "address",
      width: 300,
      render(value, record, index) {
        return concatAddress(value)
      },
    },
    {
      title : "Trạng thái liên kết kho",
      dataIndex : "statusLinkWarehouse",
      key: "statusLinkWarehouse",
      align: "center",
      width: 180,
      render: (value, record) =>  <StatusTagWarehouse status={record?.statusLinkWarehouse}/>,
    },
    {
      title : "Các kho đã liên kết",
      // dataIndex : "listWarehouse",
      key: "listWarehouse",
      align: "center",
      width: 180,
      render: (value, record) =>  (record?.listWarehouse || [])?.map((item: any)=> <Tag>{item?.name?.vi}</Tag>)
    },
    ...(canUpdateApiKey? [{
      title : "Mã liên kết",
      key: "id",
      align: "center" as any,
      width: 150,
      render(value: any, record: any, index: any) {
        return <Button type="primary" onClick={()=>  openFormApiKey({branchId: record?._id})}>Mã liên kết kho</Button>
      }
    }]:[]),
  ];

  return (
      <>
      <Breadcrumb title={t("Danh sách chi nhánh")} />
      <WhiteBox>
        <SelectSearch
          showSelect = {false}
          isShowButtonAdd
          handleOnClickButton={openForm}
          permissionKey={[POLICIES.WRITE_BRANCH]}
          onSearch={(e: any)=> onParamChange({keyword: e})}
        />
        <TableAnt
          dataSource={branches} 
          loading={isLoading}
          rowKey={rc => rc?._id}
          columns={columns}
          size='small'
          scroll={{ x: 300 }}
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showTotal: (total) => `Tổng cộng: ${total}`,
          }}
          stickyTop
        />
      </WhiteBox>
      </>
  );
}
