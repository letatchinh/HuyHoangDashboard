import { useMemo } from "react";
import { get } from "lodash";
import { Form, Select } from "antd";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import RenderLoading from "~/components/common/RenderLoading";
import apis from "../warehouse.api";
import { useGetProfile } from "~/modules/auth/auth.hook";

type propsType = {
  isLoading?: boolean;
  data?: any;
  index?: number;
  name?: any;
  isLoadingWarehouse?: any;
  options: any;
};
export default function SelectWarehouse({
  isLoading = false,
  data,
  index,
  name,
  isLoadingWarehouse = false,
  options,
}: propsType): React.JSX.Element {

  return (
    <>
      <Form.Item
        label="Kho"
        name={[name , "warehouseId"]}
        rules={[{
          required: true,
          message: "Vui lòng chọn kho",
        }]}
      >
        {RenderLoading(
          isLoadingWarehouse,
          <Select
            placeholder="Danh sách kho"
            options={options}
            showSearch
            filterOption={filterSelectWithLabel}
            loading={isLoadingWarehouse || isLoading}
          />
        )}
      </Form.Item>
    </>
  );
}
