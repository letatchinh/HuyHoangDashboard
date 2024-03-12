import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { StringToSlug } from "~/utils/helpers";
import {
    useSalesGroupQueryParams,
    useDeleteSalesGroup,
    useGetSalesGroups,
    useGetSalesGroupsSearch,
    useUpdateSalesGroup
} from "../salesGroup.hook";
import { SalesGroupType } from "../salesGroup.modal";
import SalesGroupForm from "../components/SalesGroupForm";
import AssignTeamLead from "../components/AssignTeamLead";
import { SalesGroupProvider } from "../salesGroupContext";
export default function SalesGroup() {
  const [query] = useSalesGroupQueryParams();
  const [data, isLoading,actionUpdate] = useGetSalesGroups(query);
  const dataSearch = useGetSalesGroupsSearch()
  const [id, setId]: any = useState();
  const [isOpenForm, setIsOpenForm]: any = useState(false);
  const [isSubmitLoading, updateSalesGroup]: any =
    useUpdateSalesGroup();
  const [, deleteSalesGroup]: any =
    useDeleteSalesGroup();

  // Control form
  const onOpenForm = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenForm(true);
  }, []);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);

  const onSearch = (keyword:any) => {
    // Get Data Filter From Redux
    const resultSearch = data?.filter((item:SalesGroupType) => {
        const name = get(item,'name','');
        const alias = get(item,'alias','');
        const keywordSlug = StringToSlug(keyword?.trim()?.toLowerCase());
        const nameSlug = StringToSlug(name?.trim()?.toLowerCase());
        const aliasSlug = StringToSlug(alias?.trim()?.toLowerCase());
        return  nameSlug?.includes(keywordSlug) || aliasSlug?.includes(keywordSlug);
        });
        
        actionUpdate(resultSearch);
  }
  const columns: ColumnsType = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render : (name,rc) => `${name} ${get(rc,'alias') ? `(${get(rc,'alias')})` : ''}` 
    },
    {
      title: "Chỉ tiêu",
      key: "targets",
      render : (name,rc) => 'chi tieu'
    },
    {
      title: "Thành viên",
      key: "member",
      render : (name,rc) => <AssignTeamLead />
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      fixed: 'right',
      render(_id) {
        return (
          <Space direction="horizontal">
            <Button
              block
              icon={<InfoCircleOutlined />}
              onClick={() => onOpenForm(_id)}
              size="small"
              type="primary"
            >
              Xem chi tiết
            </Button>
            <WithPermission permission={POLICIES.DELETE_AREACONFIGURATION}>
            <Popconfirm
              title="Bạn muốn xoá địa chỉ này?"
              onConfirm={() => deleteSalesGroup(_id)}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <Button
                block
                loading={isSubmitLoading}
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Xoá
              </Button>
            </Popconfirm>
            </WithPermission>
          </Space>
        );
      },
    },
  ];
  return (
    <SalesGroupProvider>

    <div>
      <Breadcrumb title={"Cấu hình vùng"} />
      <WhiteBox>
        <SelectSearch onChange={(e:any) => onSearch(e.target.value)} handleOnClickButton={() => onOpenForm()} showSelect={false} isShowButtonAdd />
        <TableAnt
          dataSource={dataSearch?.length ? dataSearch : data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={false}
        />
      </WhiteBox>
      <ModalAnt onCancel={onCloseForm} open={isOpenForm} footer={null} destroyOnClose>
        <SalesGroupForm
          onCancel={onCloseForm}
          onUpdate={updateSalesGroup}
          id={id}
        />
      </ModalAnt>
    </div>
    </SalesGroupProvider>

  );
}
