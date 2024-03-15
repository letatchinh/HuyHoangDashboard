import {
  ApartmentOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  SisternodeOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tooltip, Typography } from "antd";
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
import { concatAddress, StringToSlug } from "~/utils/helpers";
import {
  useSalesGroupQueryParams,
  useDeleteSalesGroup,
  useGetSalesGroups,
  useGetSalesGroupsSearch,
  useUpdateSalesGroup,
} from "../salesGroup.hook";
import { SalesGroupType } from "../salesGroup.modal";
import SalesGroupForm from "../components/SalesGroupForm";
import AssignTeamLead from "../components/AssignTeamLead";
import useSalesGroupStore, { SalesGroupProvider } from "../salesGroupContext";
import Member from "../components/Member";
import TargetSalesGroup from "../components/TargetSalesGroup";
import { RulesLeader, RulesMember } from "../salesGroup.service";
import { SALES_GROUP_GEOGRAPHY, SALES_GROUP_GEOGRAPHY_VI } from "../constants";
import Relationship from "../components/Relationship";
const RulesMemberMethod = new RulesMember();
const RulesLeaderMethod = new RulesLeader();
const CLONE_SALES_GROUP_GEOGRAPHY_VI : any = SALES_GROUP_GEOGRAPHY_VI;
export default function SalesGroup() {
  const {
    isSubmitLoading,
    updateSalesGroup,
    isOpenForm,
    onCloseForm,
    onOpenForm,
    onOpenFormCreateGroupFromExistGroup,
    id,
    parentNear,
    isOpenFormRelation,
    onCloseFormRelation,
    onOpenFormRelation,
  } = useSalesGroupStore();
  const [query] = useSalesGroupQueryParams();
  const [data, isLoading, actionUpdate] = useGetSalesGroups(query);

  const dataSearch = useGetSalesGroupsSearch();
  const [, deleteSalesGroup]: any = useDeleteSalesGroup();


  const onSearch = (keyword: any) => {
    // Get Data Filter From Redux
    const resultSearch = data?.filter((item: SalesGroupType) => {
      const name = get(item, "nameChild", "");
      const member = get(item, "memberChild", "");
      const keywordSlug = StringToSlug(keyword?.trim()?.toLowerCase());
      const nameSlug = StringToSlug(name?.trim()?.toLowerCase());
      const memberSlug = StringToSlug(member?.trim()?.toLowerCase());

      return (
        nameSlug?.includes(keywordSlug) || memberSlug?.includes(keywordSlug)
      );
    });

    actionUpdate(resultSearch);
  };
  const columns: ColumnsType = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, rc) => {
        const addressCode = {
          wardId : get(rc,'managementArea.[0].wardCode'),
          districtId : get(rc,'managementArea.[0].districtCode'),
          cityId : get(rc,'managementArea.[0].cityCode'),
          areaId : get(rc,'managementArea.[0].areaCode'),
        };
        const address = concatAddress(addressCode);
        return <div>
          <p>{`${name} ${get(rc, "alias") ? `(${get(rc, "alias")})` : ""}`}</p>
          <div  style={{marginLeft : 25}}>
          <Typography.Text type="secondary">Địa chỉ: {address}</Typography.Text>
          </div>
        </div>;
      },
    },
    {
      title: "Loại nhóm",
      key: "typeArea",
      dataIndex: "typeArea",
      width: 100,
      align : 'center',
      render: (typeArea, rc) => CLONE_SALES_GROUP_GEOGRAPHY_VI?.[typeArea]
    },
    {
      title: "Chỉ tiêu",
      key: "targets",
      dataIndex: "_id",
      width: "20%",
      render: (_id, rc) => (
        <TargetSalesGroup _id={_id} targetLead={get(rc, "targetLead", 0)} />
      ),
    },
    {
      title: "Thành viên",
      key: "salesGroupPermission",
      dataIndex: "_id",
      width: "30%",
      render: (_id, rc) => (
        <Member _id={_id} data={get(rc, "salesGroupPermission", [])} typeArea={get(rc,'typeArea','')} child={get(rc,'children',[])}/>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      fixed: "right",
      width: "15%",
      render(_id, rc) {
        const existMember = RulesMemberMethod.isExist(
          get(rc, "salesGroupPermission", [])
        );
        const notExistLeader = !RulesLeaderMethod.isExist(
          get(rc, "salesGroupPermission", [])
        );
        const isZone = get(rc, "typeArea") === SALES_GROUP_GEOGRAPHY.ZONE;
        return (
          <Space direction="vertical">
            <Tooltip
              title={
                isZone || existMember || notExistLeader
                  ? "Đã có TDV hoặc đã là nhóm nhỏ hoặc không có quản lý"
                  : ""
              }
            >
              <Button
                disabled={existMember || isZone || notExistLeader}
                block
                icon={<SisternodeOutlined />}
                onClick={() =>
                  onOpenFormCreateGroupFromExistGroup({
                    parentNear: _id,
                    parentNearName: get(rc, "name", ""),
                    parentNearPath : get(rc,'managementArea',[])?.map((area:any) => get(area,'path'))
                  })
                }
                size="small"
                type="dashed"
              >
                Tạo nhóm
              </Button>
            
            </Tooltip>
            <Button
                block
                icon={<ApartmentOutlined />}
                onClick={() =>
                  onOpenFormRelation(_id)
                }
                size="small"
                type="primary"
                ghost
              >
                Xem tổng thể
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
  console.log(parentNear,'parentNear');
  
  return (
    <div>
      <Breadcrumb title={"Nhóm bán hàng"} />
      <WhiteBox>
        <SelectSearch
          onChange={(e: any) => onSearch(e.target.value)}
          handleOnClickButton={() => onOpenForm()}
          showSelect={false}
          isShowButtonAdd
        />
        <TableAnt
          dataSource={dataSearch?.length ? dataSearch : data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={false}
        />
      </WhiteBox>
      <ModalAnt
        onCancel={onCloseForm}
        open={isOpenForm}
        footer={null}
        destroyOnClose
      >
        <SalesGroupForm
          onCancel={onCloseForm}
          onUpdate={updateSalesGroup}
          id={id}
          parentNear={get(parentNear, "parentNear")}
          parentNearName={get(parentNear, "parentNearName")}
          parentNearPath={get(parentNear, "parentNearPath")}
        />
      </ModalAnt>
      <ModalAnt
        onCancel={onCloseFormRelation}
        open={isOpenFormRelation}
        footer={null}
        destroyOnClose
        width={'max-content'}
      >
        <Relationship id={id}/>
      </ModalAnt>
    </div>
  );
}
