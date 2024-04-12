import { DownOutlined } from "@ant-design/icons";
import { Row, Tree, Col, Button, Flex, Space, Select, Form, Modal, ConfigProvider } from "antd";
import { get, omit, update } from "lodash";
import React, { ReactNode, useMemo, useState } from "react";
import useSalesGroupStore from "../salesGroupContext";
import ModalAnt from "~/components/Antd/ModalAnt";
import TargetSalesGroup from "./TargetSalesGroup";
import Member from "./Member";
import Action from "./Action";
import Address from "./Address";
import { GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI } from "~/modules/reportSalary/benefitConfiguration/constants";
import { RULE_SALES_GROUP } from "../constants";
import { EMPLOYEE_LEVEL_VI } from "~/modules/employee/constants";
import AssignMember from "./AssignMember";
import ListMember from "./ListMember";
import TitleRender from "./TitleRender";
type propsType = {
  dataSource: any[];
};

const CLONE_GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI: any =
  GROUP_TYPE_BENEFIT_EMPLOYEE_LEVEL_VI;
  

export default function SalesGroupTree({
  dataSource,
}: propsType): React.JSX.Element {
  
  return (
        <Tree
          className="sale-tree"
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={["0-0-0"]}
          treeData={dataSource}
          titleRender={(item: any) => <TitleRender {...item}/>}
          fieldNames={{
            title: "name",
          }}
          blockNode	= {true}
          // onSelect={(keys,{node}) => {
          //   onOpenFormRelation(get(node,'_id'))
    
          // }}
        />
  );
}

