import { Form } from "antd";
import { get } from "lodash";
import React, { useCallback, useMemo } from "react";
import DebounceSelect from "~/components/common/DebounceSelect";
import RenderLoading from "~/components/common/RenderLoading";
import { MAX_LIMIT } from "~/constants/defaultValue";
import ManufacturerModule from "~/modules/manufacturer";
import { getActive } from "~/utils/helpers";

type propsType = {
  isLoading: boolean;
  product: any;
};

export default function SelectManufacturer({
  isLoading,
  product,
}: propsType): React.JSX.Element {
  const fetchOptionsManufacturer = useCallback(async (keyword?: string) => {
    const res = await ManufacturerModule.api.getAll({
      keyword,
      limit: MAX_LIMIT,
    });
    return getActive(get(res, "docs", []))?.map((item: any) => ({
      label: get(item, "name"),
      value: get(item, "_id"),
    }));
  }, []);

  const initManufacturer = useMemo(
    () =>
      product && [
        {
          label: get(product, "manufacturer.name"),
          value: get(product, "manufacturerId"),
        },
      ],
    [product]
  );
  return (
    <Form.Item
      label="Hãng sản xuất"
      name="manufacturerId"
      rules={[{ required: true, message: "Vui lòng chọn hãng sản xuất!" }]}
    >
      {RenderLoading(
        isLoading,
        <DebounceSelect
          placeholder="Hãng sản xuất"
          fetchOptions={fetchOptionsManufacturer}
          style={{ width: "100%" }}
          initOptions={initManufacturer}
        />
      )}
    </Form.Item>
  );
}
