import { get } from "lodash";
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
