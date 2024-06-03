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
};
export default function SelectWarehouse({
  isLoading = false,
  data,
  index
}: propsType): React.JSX.Element {
  const profile = useGetProfile();
  const query = useMemo(() => ({
    branchId: profile?.profile?.branchId,
  }), [profile]);
  const [warehouse, isLoadingWarehouse] = useFetchState({api: apis.getAllWarehouse,query ,useDocs: false});
  const options = useMemo(
    () =>
      warehouse?.map((item: any) => ({
        label: get(item, "name.vi") || get(item, "name"),
        value: get(item, "_id"),
      })),
    [warehouse]
  );

  return (
    <>
      <Form.Item
        label="Kho"
        name="warehouseId"
        rules={[{
          required: true,
          message: "Vui lòng chọn kho",
        }]}
      >
        {RenderLoading(
          isLoading,
          <Select
            placeholder="Danh sách kho"
            options={options}
            showSearch
            filterOption={filterSelectWithLabel}
            loading={isLoadingWarehouse}
          />
        )}
      </Form.Item>
    </>
  );
}
