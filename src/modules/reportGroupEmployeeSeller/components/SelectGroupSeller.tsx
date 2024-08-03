import { TreeSelect, TreeSelectProps } from "antd";
import React, { useState } from "react";
import { useGetGroupSeller } from "../reportGroupEmployeeSeller.hook";
interface propsType extends TreeSelectProps {
  query?: any;
}
export default function SelectGroupSeller({
  query,
  ...props
}: propsType): React.JSX.Element {
  const [data, isLoading] = useGetGroupSeller(query);
  return (
    <TreeSelect
      showSearch
      style={{ width: "100%" }}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      placeholder="Nhóm bán hàng"
      allowClear
      treeDefaultExpandAll
      treeData={data}
      multiple
      {...props}
      //   onPopupScroll={onPopupScroll}
    />
  );
}
