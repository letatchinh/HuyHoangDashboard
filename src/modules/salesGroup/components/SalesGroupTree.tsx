import {
    DownOutlined
} from "@ant-design/icons";
import { Tree } from "antd";
import { get } from "lodash";
import React from "react";
import useSalesGroupStore from "../salesGroupContext";
type propsType = {
  dataSource: any[];
};
export default function SalesGroupTree({
  dataSource,
}: propsType): React.JSX.Element {
    const {onOpenFormRelation} = useSalesGroupStore();
  return (
    <Tree
      showLine
      switcherIcon={<DownOutlined />}
      defaultExpandedKeys={["0-0-0"]}
      treeData={dataSource}
      fieldNames={{
        title: "name",
      }}
      onSelect={(keys,{node}) => {
        onOpenFormRelation(get(node,'_id'))
        
      }}
    />
  );
}
