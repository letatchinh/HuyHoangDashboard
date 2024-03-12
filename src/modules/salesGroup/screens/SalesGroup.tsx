import { DeleteOutlined, InfoCircleOutlined, SisternodeOutlined } from "@ant-design/icons";
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
import useSalesGroupStore, { SalesGroupProvider } from "../salesGroupContext";
import Member from "../components/Member";
import TargetSalesGroup from "../components/TargetSalesGroup";
export default function SalesGroup() {
  const {isSubmitLoading,updateSalesGroup} = useSalesGroupStore();
  const [query] = useSalesGroupQueryParams();
  const [data, isLoading,actionUpdate] = useGetSalesGroups(query);
    console.log(data,'data');
    
  const dataSearch = useGetSalesGroupsSearch()
  const [id, setId]: any = useState();
  const [parentNear, setParentNear]: any = useState();
  const [isOpenForm, setIsOpenForm]: any = useState(false);
  const [, deleteSalesGroup]: any =
    useDeleteSalesGroup();

  // Control form
  const onOpenForm = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenForm(true);
  }, []);
  const onOpenFormCreateGroupFromExistGroup = useCallback((data: any) => {
    setParentNear(data);
    setIsOpenForm(true);
  }, []);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
    setParentNear(null)
  }, []);

  const onSearch = (keyword:any) => {
    // Get Data Filter From Redux
    const resultSearch = data?.filter((item:SalesGroupType) => {
        
        const name = get(item,'nameChild','');
        const member = get(item,'memberChild','');
        const keywordSlug = StringToSlug(keyword?.trim()?.toLowerCase());
        const nameSlug = StringToSlug(name?.trim()?.toLowerCase());
        const memberSlug = StringToSlug(member?.trim()?.toLowerCase());
        
        return  nameSlug?.includes(keywordSlug) || memberSlug?.includes(keywordSlug) 
        });
        
        actionUpdate(resultSearch);
  }
  const columns: ColumnsType = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, rc) =>
        `${name} ${get(rc, "alias") ? `(${get(rc, "alias")})` : ""}`,
    },
    {
      title: "Chỉ tiêu",
      key: "targets",
      dataIndex: "_id",
      width : '20%',
      render: (_id, rc) => (
        <TargetSalesGroup
          _id={_id}
          targetLead={get(rc, "targetLead",0)}
          targetMember={get(rc, "targetMember",0)}
        />
      ),
    },
    {
      title: "Thành viên",
      key: "salesGroupPermission",
      dataIndex: "_id",
      width : '30%',
      render: (_id, rc) => (
        <Member _id={_id} data={get(rc, "salesGroupPermission", [])} />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      fixed: "right",
      width : '10%',
      render(_id,rc) {
        return (
          <Space direction="horizontal">
            <Button
              block
              icon={<SisternodeOutlined />}
              onClick={() => onOpenFormCreateGroupFromExistGroup({
                parentNear : _id,
                parentNearName : get(rc,'name','')
              })}
              size="small"
              type="dashed"
            >
              Tạo nhóm
            </Button>
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
          parentNear={get(parentNear,'parentNear')}
          parentNearName={get(parentNear,'parentNearName')}
        />
      </ModalAnt>
    </div>

  );
}
