import { Select } from "antd";
import FormItem from "antd/es/form/FormItem/index";
import { get } from "lodash";
import React, { useMemo } from "react";
import { useFetchAreaConfigurations } from "../areaConfiguration.hook";
import { AreaConfigurationType } from "../areaConfiguration.modal";
type propsType = {};
export default function AreaConfigurationSelect(
  props: propsType
): React.JSX.Element {
  const [area, isLoading] = useFetchAreaConfigurations();
  const options = useMemo(
    () =>
      area?.map((area: AreaConfigurationType) => ({
        label: get(area, "name", "") + ` (${get(area, "alias", "")})`,
        value: get(area, "_id"),
      })),
    [area]
  );
  return (
    <FormItem label="Vùng hoạt động" name="areaManager">
      <Select loading={isLoading} options={options} />
    </FormItem>
  );
}
