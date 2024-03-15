import { Flex } from "antd";
import { get } from "lodash";
import React from "react";
import WhiteBox from "~/components/common/WhiteBox";
import Address from "../Address";
type propsType = {
  managementArea?: any[];
  leader?: any;
  member?: any;
  parentNear?: any;
};
export default function CardRelation({
  managementArea,
  leader,
  member,
  parentNear,
}: propsType): React.JSX.Element {
  return <Flex className="cardRelation" align={"center"} vertical>
  <WhiteBox>
  <Address onlyShowLastPath={!!parentNear} managementArea={managementArea}/> 
    {leader && <div>Quản lý: {get(leader,'employee.fullName','')}</div>}
    {member && <div>TDV: {get(member,'employee.fullName','')}</div>}
    {!leader && !member ? "(Trống)" : null}
  </WhiteBox>
  </Flex>;
}
