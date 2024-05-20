import { Select, SelectProps } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";

interface TypeProps extends SelectProps {
  defaultProduct?: any[];
  data?: any[];
  placeholder?: string;
}

export default function SelectArea({
  defaultProduct,
  data,
  placeholder,
  ...props
}: TypeProps): React.JSX.Element {
  const options = useMemo(
    () =>
      (defaultProduct ?? data)?.map((item: any) => ({
        label: get(item, "name"),
        value: get(item, "code"),
      })),
    [data, defaultProduct]
  );
  return (
    <Select
      options={options}
      allowClear
      style={{ minWidth: 200 }}
      placeholder={placeholder}
      popupMatchSelectWidth={false}
      filterOption={filterSelectWithLabel}
      {...props}
    />
  );
}
