import { useEffect, useMemo, useState } from "react";
import GroupPharmacyModule from "~/modules/groupPharmacy";
import { get } from "lodash";
import { Form, Select } from "antd";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import RenderLoading from "~/components/common/RenderLoading";

type propsType = {
  isLoading: boolean;
  groupPharmacy: any;
  customerGroupId: any;
};
export default function SelectGroupPharmacy({
  isLoading,
  groupPharmacy,
  customerGroupId,
}: propsType): React.JSX.Element {
  const [groupsPharmacy, setGroupsPharmacy] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchGroupPharmacy = async (customerGroupId: string) => {
    setLoading(true);
    try {
      const response = await GroupPharmacyModule.api.search({ customerGroupId });
      if (response) {
        setGroupsPharmacy(response);
      }
    } catch (error) {
      console.error('Failed to fetch groups pharmacy:', error);
    } finally {
      setLoading(false);
    }
  };
  const options = useMemo(
    () =>
      groupsPharmacy?.map((item: any) => ({
        label: get(item, "title"),
        value: get(item, "_id"),
      })),
    [groupsPharmacy]
  );
  useEffect(() => {
    if (customerGroupId) {
      fetchGroupPharmacy(customerGroupId);
    } else {
      setGroupsPharmacy([]);
    }
  }, [customerGroupId]);

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
            style={{ width: "100%" }}
            showSearch
            filterOption={filterSelectWithLabel}
          />
        )}
      </Form.Item>
    </>
  );
}
