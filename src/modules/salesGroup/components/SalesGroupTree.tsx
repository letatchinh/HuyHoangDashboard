import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import React from "react";
import TitleRender from "./TitleRender";
type propsType = {
  dataSource: any[];
};


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

