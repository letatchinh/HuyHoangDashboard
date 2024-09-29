import { PoliciesRuleType } from "./policy.rule";

export type TypeProps = {};
const ResourceTypeRule = {};

type newType =  typeof ResourceTypeRule

export type ResourceType = { [ key in keyof newType] : string[]}

export type policyType =
  | "write"
  | "read"
  | "update"
  | "delete"
  | "download"
  | "admin";

export type PoliciesType = {
  [key in PoliciesRuleType]: [string, policyType];
};

export interface PermissionProps {
  isActive?: boolean;
  onChange?: any;
  disabled?: boolean;
}

export interface onPermissionChangeProps {
  resource?: any;
  action?: any;
  isAssign?: boolean;
};
export interface resources {
  key: string,
  name: string
}; 

export interface permissionResources {
  roleId: string;
  resource:  string,
  action: string,
  isAssigned?: boolean
};