import { Select, SelectProps } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import { useFetchState } from "~/utils/helpers";
import apis from "../product.api";
interface TypeProps extends SelectProps {
  defaultProduct?: any[];
}
export default function SelectProductBySupplier({
  defaultProduct,
  ...props
}: TypeProps): React.JSX.Element {
  const [data, isLoading] = useFetchState({
    api: apis.searchBySupplierId,
    useDocs: false,
    shouldRun: !defaultProduct,
  });
  const options = useMemo(
    () =>
      (defaultProduct ?? data)?.map((item: any) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
      })),
    [data, defaultProduct]
  );
  return (
    <Select
      options={options}
      loading={isLoading}
      allowClear
      style={{ minWidth: 200 }}
      placeholder="Sản phẩm"
      popupMatchSelectWidth={false}
      {...props}
    />
  );
}
