import { ApartmentOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { useRef, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import POLICIES from "~/modules/policy/policy.auth";
import { StringToSlug } from "~/utils/helpers";
import Action from "../components/Action";
import Address from "../components/Address";
import ExchangeRate from "../components/ExchangeRate";
import Member from "../components/Member";
import Relationship from "../components/Relationship";
import SalesGroupForm from "../components/SalesGroupForm";
import SalesGroupTree from "../components/SalesGroupTree";
import TargetSalesGroup from "../components/TargetSalesGroup";
import {
  useGetSalesGroups,
  useGetSalesGroupsSearch,
  useSalesGroupQueryParams
} from "../salesGroup.hook";
import { SalesGroupType } from "../salesGroup.modal";
import useSalesGroupStore from "../salesGroupContext";
export default function SalesGroup() {
  const {
    updateSalesGroup,
    isOpenForm,
    onCloseForm,
    onOpenForm,
    id,
    parentNear,
    isOpenFormRelation,
    onCloseFormRelation,
    isOpenTarget,
    onOpenFormTarget,
    onCloseFormTarget,
    isOpenFormExchangeRate,
    onOpenFormExchangeRate,
    onCloseFormExchangeRate,
    setParentNear,
    setGroupInfo,
    canUpdate
  } = useSalesGroupStore();
  const rowSelect = useRef();
  const [expandedRowKeys, setExpandedRowKeys]: any = useState([]);
  const [query] = useSalesGroupQueryParams();
  const [data, isLoading, actionUpdate] = useGetSalesGroups(query);
  const [modeView,setModeView] = useState<'table' | 'tree'>('table');
  
  const dataSearch = useGetSalesGroupsSearch();

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

  const onExpand = (record : any) => {
    const idSelect: any = get(record, "_id");
    const indexRow :any = get(record,'indexRow');
    
    
      if(rowSelect.current !== indexRow && indexRow){ // Click on The Record Have Index Diff rowSelect current

        setExpandedRowKeys([idSelect]);
          rowSelect.current = indexRow;
          return 
      }
        onSetRowKey(idSelect);
  }
  const onSetRowKey = (idSelect:any) => {
    if (expandedRowKeys.includes(idSelect)) {
      setExpandedRowKeys(
        expandedRowKeys?.filter((k: any) => k !== idSelect)
      );
    } else {
      setExpandedRowKeys(expandedRowKeys.concat(idSelect));
    }
  };
  
  const columns: ColumnsType = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      onCell : (data,index) => ({
        style : {
          borderTop : index === 0 ? "1px solid " + get(data,'color') : "unset",
          borderBottom : '2px solid ' + get(data,'color'),
          borderLeft : '2px solid ' + get(data,'color'),
          borderRight : '2px solid ' + get(data,'color'),
          boxSizing : 'border-box' 
        }
      }),
      render: (name, rc) => {
        return (
          <div>
            {`${name} ${get(rc, "alias") ? `(${get(rc, "alias")})` : ""}`}
            <Address managementArea={get(rc, "managementArea", [])} />
          </div>
        );
      },
    },
    // {
    //   title: "Loại nhóm",
    //   key: "typeArea",
    //   dataIndex: "typeArea",
    //   width: 140,
    //   align: "center",
    //   render: (typeArea, rc) => (
    //     <Tag color={CLONE_SALES_GROUP_GEOGRAPHY_COLOR[typeArea]}>
    //       {CLONE_SALES_GROUP_GEOGRAPHY_VI?.[typeArea]}
    //     </Tag>
    //   ),
    // },
    {
      title: "Chỉ tiêu",
      key: "targets",
      dataIndex: "_id",
      width: "10%",
      align: "center",
      render: (_id, rc) => (
        <Button size="small" onClick={() => onOpenFormTarget(_id)}>
          Xem chỉ tiêu
        </Button>
      ),
    },
    {
      title: "Thành viên",
      key: "salesGroupPermission",
      dataIndex: "_id",
      width: "30%",
      render: (_id, rc:any) => (
        <Member
          _id={_id}
          data={get(rc, "salesGroupPermission", [])}
          typeArea={get(rc, "typeArea", "")}
          child={get(rc, "children", [])}
        />
      ),
    },
    ...(canUpdate ? [  {
          title: "Quy đổi",
          key: "exchangeRate",
          dataIndex: "exchangeRate",
          width: "10%",
          align: "center" as any,
          render: (_id : any, rc: any) => (
            <Button type="link" onClick={() => {
              onOpenFormExchangeRate(rc?._id);
              setParentNear(rc?.parent);
              setGroupInfo(rc);
            }}>Nhập quy đổi</Button>
          ),
      }
    ]: []),
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      fixed: "right",
      width: 80,
      render(_id, rc) {
        return <Action _id={_id} rc={rc} />;
      },
    },
  ];
  return (
    <div>
      <Breadcrumb title={"Nhóm bán hàng"} />
      <WhiteBox>
        <SelectSearch
          onChange={(e: any) => onSearch(e.target.value)}
          handleOnClickButton={() => onOpenForm()}
          showSelect={false}
          isShowButtonAdd
          permissionKey={[POLICIES.WRITE_SALESGROUP]}
        />
        <Flex style={{marginTop : 20}}>
          <Button.Group>
            <Button onClick={() => setModeView('table')} type={modeView === 'table' ? 'primary' : 'default'} icon={<AppstoreOutlined />}/>
            <Button onClick={() => setModeView('tree')} type={modeView === 'tree' ? 'primary' : 'default'} icon={<ApartmentOutlined />}/>
          </Button.Group>
        </Flex>
        {modeView === 'table' && <TableAnt
          expandable={{
            expandedRowKeys,
            
            onExpand: (open, record) => {
              onExpand(record)
            },
          }}
          onRow={(record: any) => {
            
            return {
              onClick: (event: any) => {                
                const cellIndex = event?.target?.cellIndex ?? event?.target?.offsetParent?.cellIndex;
                
                if ([0, 1].includes(cellIndex)) {
                  onExpand(record)
                }
              }, // click row
            };
          }}
          dataSource={dataSearch?.length ? dataSearch : data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={false}
          bordered
          style={{ marginTop: 20 }}
        />}
        {modeView === 'tree' && <SalesGroupTree dataSource={dataSearch?.length ? dataSearch : data}/>}
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
          parentNearPath={get(parentNear, "parentNearPath")}
        />
      </ModalAnt>
      <ModalAnt
        onCancel={onCloseFormRelation}
        open={isOpenFormRelation}
        footer={null}
        destroyOnClose
        width={"max-content"}
        centered
      >
        <Relationship id={id} />
      </ModalAnt>

      <ModalAnt
        onCancel={onCloseFormTarget}
        open={isOpenTarget}
        footer={null}
        destroyOnClose
        width={"auto"}
        className="modalScroll"
        centered
      >
        <TargetSalesGroup _id={id} />
        </ModalAnt>

      <ModalAnt
        title="Nhập quy đổi cho từng nhóm nhà cung cấp"
        onCancel={onCloseFormExchangeRate}
        open={isOpenFormExchangeRate}
        footer={null}
        destroyOnClose
        width={1200}
      >
        <ExchangeRate id={id} />
      </ModalAnt>
    </div>
  );
}
