import { useMemo, useState } from "react";
import SaleChannelModule from "~/modules/saleChannel";
import { get } from "lodash";
import { Form, Select } from "antd";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import RenderLoading from "~/components/common/RenderLoading";

type propsType = {
  isLoading: boolean;
  saleChannel: any;
};
export default function SelectSaleChannel({
  isLoading,
  saleChannel,
}: propsType): React.JSX.Element {
  const [reFetch, setReFetch] = useState(false);
  const [salesChannel, loading] = useFetchState({
    api: SaleChannelModule.api.search,
    useDocs: false,
    reFetch,
  });
  const options = useMemo(
    () =>
      salesChannel?.map((item: any) => ({
        label: get(item, "title"),
        value: get(item, "_id"),
      })),
    [salesChannel]
  );

  return (
    <>
      <Form.Item
        label="Kênh bán hàng"
        name="salesChannelId"
        rules={[{ required: true, message: "Vui lòng chọn kênh bán hàng!" }]}
      >
        {RenderLoading(
          isLoading,
          <Select
            // className="right--parent"
            placeholder="Kênh bán hàng"
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
