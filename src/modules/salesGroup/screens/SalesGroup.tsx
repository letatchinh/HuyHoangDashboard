import { Button, Form } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { compact, get, initial } from "lodash";
import { useMemo, useRef, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import POLICIES from "~/modules/policy/policy.auth";
import { StringToSlug } from "~/utils/helpers";
import Action from "../components/Action";
import Address from "../components/Address";
import Member from "../components/Member";
import Relationship from "../components/Relationship";
import SalesGroupForm from "../components/SalesGroupForm";
import SalesGroupTree from "../components/SalesGroupTree";
import TargetSalesGroup from "../components/TargetSalesGroup";
import {
  useGetSalesGroups,
  useGetSalesGroupsSearch,
  useSalesGroupQueryParams,
} from "../salesGroup.hook";
import { SalesGroupType } from "../salesGroup.modal";
import useSalesGroupStore from "../salesGroupContext";
import SelectBusinessModel from "~/components/common/SelectBusinessModel/SelectBusinessModel";
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
    canUpdate,
  } = useSalesGroupStore();

  const [formBusiness] = Form.useForm();

  const rowSelect = useRef();
  const [expandedRowKeys, setExpandedRowKeys]: any = useState([]);
  const [query] = useSalesGroupQueryParams();

  const [data, isLoading, actionUpdate] = useGetSalesGroups(query);
  const [modeView, setModeView] = useState<"table" | "tree">("table");
  const ref = useRef(data);
  const dataSearch = useGetSalesGroupsSearch();

  const onSearch = (keyword: any) => {
    // Get Data Filter From Redux
    const keywordSlug = StringToSlug(keyword?.trim()?.toLowerCase());
    function loopFilter(item?: SalesGroupType) {
      const name = get(item, "nameChild", "");
      const member = get(item, "memberChild", "");
      const nameSlug = StringToSlug(name?.trim()?.toLowerCase());
      const memberSlug = StringToSlug(member?.trim()?.toLowerCase());
      const children = compact(get(item, "children", []).map(loopFilter)) as SalesGroupType[];

      const hasInChild: boolean = Boolean(children.length);
      console.log("🚀 ~ loopFilter ~ hasInChild:", hasInChild,name)
      const valid =
        nameSlug?.includes(keywordSlug) ||
        memberSlug?.includes(keywordSlug) ||
        hasInChild;

      if (!valid) {
        return null;
      }
      if (!!item?.children) {
        return { ...item, children: children };
      } else {
        return item;
      }
    }
    const resultSearch = data.map(loopFilter);
    console.log("🚀 ~ loopFilter ~ resultSearch:", compact(resultSearch));

    // actionUpdate(resultSearch);
  };

  const onExpand = (record: any) => {
    const idSelect: any = get(record, "_id");
    const indexRow: any = get(record, "indexRow");

    if (rowSelect.current !== indexRow && indexRow) {
      // Click on The Record Have Index Diff rowSelect current

      setExpandedRowKeys([idSelect]);
      rowSelect.current = indexRow;
      return;
    }
    onSetRowKey(idSelect);
  };
  const onSetRowKey = (idSelect: any) => {
    if (expandedRowKeys.includes(idSelect)) {
      setExpandedRowKeys(expandedRowKeys?.filter((k: any) => k !== idSelect));
    } else {
      setExpandedRowKeys(expandedRowKeys.concat(idSelect));
    }
  };

  const filterDataSource = useMemo(() => {
    function loop(item: any) {
      let itemData = {
        value: item._id,
        title: item.name,
      };
      if (item?.children?.length) {
        Object.assign(itemData, { children: item.children.map(loop) });
      }
      return itemData;
    }
    return initial(data).map(loop);
  }, [data]);
  return (
    <div>
      <WhiteBox>
        <SelectSearch
          onChange={(e: any) => onSearch(e.target.value)}
          handleOnClickButton={() => onOpenForm()}
          showSelect={false}
          isShowButtonAdd
          permissionKey={[POLICIES.WRITE_SALESGROUP]}
        />
        <Form
          form={formBusiness}
          onValuesChange={(value, values) => {
            console.log("====================================");
            console.log(values);
            console.log("====================================");
          }}
        >
          <SelectBusinessModel query={query} form={formBusiness} />
        </Form>

        <SalesGroupTree dataSource={dataSearch?.length ? dataSearch : data} />
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
          dataSourceTree={filterDataSource}
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
    </div>
  );
}
