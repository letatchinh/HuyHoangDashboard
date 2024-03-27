import { useMemo, useState } from "react";
import GroupPharmacyModule from "~/modules/groupPharmacy";
import { get } from "lodash";
import { Form, Select } from "antd";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import RenderLoading from "~/components/common/RenderLoading";

type propsType = {
  isLoading: boolean;
  groupPharmacy: any;
};
export default function SelectGroupPharmacy({
  isLoading,
  groupPharmacy,
}: propsType): React.JSX.Element {
  const [reFetch, setReFetch] = useState(false);
  const [groupsPharmacy, loading] = useFetchState({
    api: GroupPharmacyModule.api.search,
    useDocs: false,
    reFetch,
  });
  const options = useMemo(
    () =>
      groupsPharmacy?.map((item: any) => ({
        label: get(item, "title"),
        value: get(item, "_id"),
      })),
    [groupsPharmacy]
  );

  return (
    <>
      <Form.Item
        label="Nhóm nhà thuốc"
        name="customerId"
        rules={[{ required: true, message: "Vui lòng chọn nhóm nhà thuốc!" }]}
      >
        {RenderLoading(
          isLoading,
          <Select
            className="right--parent"
            placeholder="Nhóm nhà thuốc"
            options={options}
            style={{ width: "100%" }}
            showSearch
            filterOption={filterSelectWithLabel}
          />
        )}
      </Form.Item>
    </>
  );
}
