import Search from "antd/es/input/Search";
import { SearchProps } from "antd/lib/input/index";
import React from "react";
interface propsType extends SearchProps {
  onParamChange: (obj: any) => void;
  keyPath?: string;
}
export default function SearchAnt({
  onParamChange,
  keyPath = "keyword",
  ...props
}: propsType): React.JSX.Element {
  return (
    <Search
      placeholder="Tìm kiếm ..."
      style={{ width: 300 }}
      onSearch={(value: any) => onParamChange({ [keyPath]: value?.trim() })}
      enterButton
      allowClear
      {...props}
    />
  );
}
