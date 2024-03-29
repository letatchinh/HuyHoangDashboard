import { get } from "lodash";
import { TreeNode } from "react-organizational-chart";
import { concatAddress } from "~/utils/helpers";
import CardRelation from "./components/Relationship/CardRelation";
import { RULE_SALES_GROUP } from "./constants";
import { FieldTypeForm, MemberRulesInGroupType } from "./salesGroup.modal";

export const service = {};
export const convertSubmitData = (data: FieldTypeForm) => {
  const { managementArea } = data;
  return {
    ...data,
    managementArea: managementArea?.map((option: any) =>
      typeof option === "string" // Update
        ? {
            path: option,
          }
        : { // Create
            path: get(option, "value"),
          }
    ),
  };
};

export const convertInitData = (salesGroupInit: any) => {
  const { managementArea } = salesGroupInit;
  return {
    ...salesGroupInit,
    managementArea: managementArea?.map((option: any) => get(option, "path")),
  };
};

export const convertAddress = (managementArea?:any,onlyShowLastPath?:boolean) => {
    return managementArea?.map((area:any) => {
      const addressCode = {
        wardId : get(area,'wardCode'),
        districtId : get(area,'districtCode'),
        cityId : get(area,'cityCode'),
        areaId : get(area,'areaCode'),
      };
      if(onlyShowLastPath){
        const {cityId,districtId,wardId} = addressCode;
        if(wardId){
          return concatAddress({wardId});
        }
        if(districtId){
          return concatAddress({districtId});
        }
        if(cityId){
          return concatAddress({cityId});
        }
      }else{
        const address = concatAddress(addressCode);
        return address;
      }
  
    })
    
}
export class RulesMember {
  isExist(salesGroupPermission: MemberRulesInGroupType[]) {
    return salesGroupPermission?.some(
      (m) => get(m, "rule") === RULE_SALES_GROUP.MEMBER
    );
  }
  FindOne(salesGroupPermission: MemberRulesInGroupType[]) {
    return salesGroupPermission?.find(
      (m) => get(m, "rule") === RULE_SALES_GROUP.MEMBER
    );
  }
}
export class RulesLeader {
  isExist(salesGroupPermission: MemberRulesInGroupType[]) {
    return salesGroupPermission?.some(
      (m) => get(m, "rule") === RULE_SALES_GROUP.LEADER
    );
  }
  FindOne(salesGroupPermission: MemberRulesInGroupType[]) {
    return salesGroupPermission?.find(
      (m) => get(m, "rule") === RULE_SALES_GROUP.LEADER
    );
  }
}
// Loop Deep Child
export function getDeepChild (child : any[]){
  return child?.map((c : any) => {
    const leader = new RulesLeader().FindOne(get(c,'salesGroupPermission',[]));
    const member = new RulesMember().FindOne(get(c,'salesGroupPermission',[]));
    
    return <TreeNode label={<CardRelation typeArea={get(c,'typeArea')} name={get(c,'name','')} parentNear={get(c,'parentNear')} member={member} leader={leader} managementArea={get(c,'managementArea',[])}/>}>
    {get(c,'children',[])?.length ? getDeepChild(get(c,'children',[])) : null} 
</TreeNode>
  })
}