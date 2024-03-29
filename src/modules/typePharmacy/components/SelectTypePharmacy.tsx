import { useMemo, useState } from "react";
import TypePharmacyModule from "~/modules/typePharmacy";
import { get } from "lodash";
import { Form, Select } from "antd";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import RenderLoading from "~/components/common/RenderLoading";

type propsType = {
  isLoading: boolean;
  typePharmacy: any;
  onChange: (value: string) => void;
};
export default function SelectTypePharmacy({
  isLoading,
  typePharmacy,
  onChange
}: propsType): React.JSX.Element {
  const [reFetch, setReFetch] = useState(false);
  const [typesPharmacy, loading] = useFetchState({
    api: TypePharmacyModule.api.searchList,
    useDocs: false,
    reFetch,
  });
  const options = useMemo(
    () =>
      typesPharmacy?.map((item: any) => ({
        label: get(item, "title"),
        value: get(item, "_id"),
      })),
    [typesPharmacy]
  );

  return (
    <>
      <Form.Item
        label="Loại nhà thuốc"
        name="customerGroupId"
        rules={[{ required: true, message: "Vui lòng chọn loại nhà thuốc!" }]}
      >
        {RenderLoading(
          isLoading,
          <Select
            className="right--parent"
            placeholder="Loại nhà thuốc"
            options={options}
            style={{ width: "100%" }}
            showSearch
            filterOption={filterSelectWithLabel}
            onChange={onChange}
          />
        )}
      </Form.Item>
    </>
  );
}
