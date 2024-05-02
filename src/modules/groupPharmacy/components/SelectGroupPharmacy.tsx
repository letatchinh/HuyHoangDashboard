import { useEffect, useMemo, useState } from "react";
import GroupPharmacyModule from "~/modules/groupPharmacy";
import { get } from "lodash";
import { Form, Select } from "antd";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import RenderLoading from "~/components/common/RenderLoading";
import apis from "../groupPharmacy.api";

type propsType = {
  isLoading: boolean;
};
export default function SelectGroupPharmacy({
  isLoading,
}: propsType): React.JSX.Element {
  const [groups, isLoadingGroups] = useFetchState({api: apis.search ,useDocs: false});
  const options = useMemo(
    () =>
      groups?.map((item: any) => ({
        label: get(item, "title"),
        value: get(item, "_id"),
      })),
    [groups]
  );

  return (
    <>
      <Form.Item
        label="Nhóm khách hàng"
        name="customerId"
        rules={[{ required: true, message: "Vui lòng chọn nhóm khách hàng!" }]}
      >
        {RenderLoading(
          isLoading,
          <Select
            // className="right--parent"
            placeholder="Nhóm khách hàng"
            options={options}
            // style={{ width: "100%" }}
            showSearch
            filterOption={filterSelectWithLabel}
            loading={isLoadingGroups}
          />
        )}
      </Form.Item>
    </>
  );
}
