import { AutoComplete, Button, Empty, Form, Space } from "antd";
import React, { useMemo, useRef, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import { useFetchState } from "~/utils/hook";
import ProductModule from "~/modules/product";
import useNotificationStore from "~/store/NotificationContext";
import { debounce, get } from "lodash";
type propsType = {
  supplierId?: string;
  form: any;
  cumulativeDiscount: any;
  name: number;
};
export default function ItemRewardName({
  supplierId,
  form,
  cumulativeDiscount,
  name,
}: propsType): React.JSX.Element {
  const ref : any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { onNotify } = useNotificationStore();
  const query = useMemo(() => ({ supplierId }), [supplierId]);

  const fetchOptions = async (keyword?: string) => {
    try {
      setLoading(true);
      const products = await ProductModule.api.search({
        ...query,
        keyword: keyword ?? "",
        limit: 20,
      });

      setData(products);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra");
    }
  };
  const debounceFetcher = debounce(fetchOptions, 300);

  const onSelect = (rewardName: any) => {
    
    const newCumulativeDiscount = cumulativeDiscount?.map(
      (item: any, index: number) =>
        index === name
          ? {
              ...item,
              itemReward: {
                ...get(item, "itemReward"),
                name: rewardName,
              },
            }
          : item
    );
    form.setFieldsValue({
      cumulativeDiscount: newCumulativeDiscount,
    });
    ref.current.blur();
  };
  return (
    <Form.Item label="Hàng hoá thưởng" name={[name, "itemReward", "name"]} 
    rules={
      [
        {
          required : true,
          message : "Vui lòng nhập"
        }
      ]
    }
    >
      <AutoComplete
        ref={ref}
        allowClear
        onFocus={() => debounceFetcher("")}
        onSearch={(kw) => debounceFetcher(kw)}
        notFoundContent={
          <div>
            <Empty />
          </div>
        }
        popupMatchSelectWidth={400}
        dropdownRender={() => {
          return (
            <TableAnt
              scroll={{ y: 300 }}
              className="table-searchProduct"
              size="small"
              loading={loading}
              dataSource={data}
              pagination={false}
              rowKey={(rc) => rc._id}
              columns={[
                {
                  title: "Tên thuốc",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Chọn đơn vị",
                  dataIndex: "variants",
                  key: "variants",
                  render(variants, record, index) {
                    return (
                      <Space>
                        {variants?.map((item: any) => (
                          <Button
                          size="small"
                            onClick={() =>
                              onSelect(
                                `${get(record, "name", "")} - ${get(
                                  item,
                                  "unit.name",
                                  ""
                                )}`
                              )
                            }
                            type="primary"
                          >
                            {get(item, "unit.name", "")}
                          </Button>
                        ))}
                      </Space>
                    );
                  },
                },
              ]}
            />
          );
        }}
      />
    </Form.Item>
  );
}
