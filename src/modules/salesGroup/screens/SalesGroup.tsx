import { Form } from "antd";
import { compact, get, initial } from "lodash";
import { useCallback, useMemo, useRef, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import POLICIES from "~/modules/policy/policy.auth";
import { StringToSlug } from "~/utils/helpers";
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
    onCloseFormTarget,
  } = useSalesGroupStore();

  const [formBusiness] = Form.useForm();

  const [query] = useSalesGroupQueryParams();
  const refQuery = useRef({
    "salesChannelId": '',
    "customerGroupId": '',
    "customerId": '',
    keyword:'',
})

  const [data,loading, actionUpdate] = useGetSalesGroups(query);
  const dataSearch = useGetSalesGroupsSearch();

  const onSearch = useCallback((keyword: any) => {
    // Get Data Filter From Redux
    const keywordSlug = StringToSlug(keyword?.trim()?.toLowerCase());
    refQuery.current.keyword = keywordSlug;

    function loopFilter(item?: SalesGroupType) {
      const name = get(item, "nameChild", "");
      const nameSlug = StringToSlug(name?.trim()?.toLowerCase());

      const children = compact(
        get(item, "children", []).map(loopFilter)
      ) as SalesGroupType[];

      const hasInChild: boolean = Boolean(children.length);
      let checkSalesChannel = refQuery.current.salesChannelId
        ? !!item?.salesGroupPermission?.filter(({ employee }) =>
            employee.pharmacies.some(
              (el: any) =>
                el.salesChannelId === refQuery.current.salesChannelId ||
                el.customerGroupId === refQuery.current.customerGroupId ||
                el.customerId === refQuery.current.customerId
            )
          ).length
        : true;

      const valid = !!keywordSlug ? nameSlug?.includes(keywordSlug) : true;

      if ((!valid || !checkSalesChannel) && !hasInChild) {
        return null;
      }

      let valueReturn = { ...item };

      if (!!item?.children && hasInChild) {
        valueReturn = { ...valueReturn, children: children };
      }
      return valueReturn;
    }
    const resultSearch = compact(data.map(loopFilter));
    actionUpdate(resultSearch);
  },[data]);


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
  const onValuesChange = (value:any)=>{
    const key = Object.keys(value)[0];
    if(key === 'salesChannelId'){
      formBusiness.setFieldsValue({
        customerGroupId : null,
        customerId: null
      })
    }
    if(key === 'customerGroupId'){
      formBusiness.setFieldsValue({
        customerId: null
      })
    }
    Object.assign(refQuery.current,value);
    onSearch('');
   
  }
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
          onValuesChange={onValuesChange}
        >
          <SelectBusinessModel form={formBusiness} />
        </Form>

        <SalesGroupTree dataSource={ compact(Object.values(refQuery.current)).length ? dataSearch : data} />
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
