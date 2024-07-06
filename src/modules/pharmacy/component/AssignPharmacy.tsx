import { Button, List, Tag, Typography } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import { concatAddress, useFetchState } from "~/utils/helpers";
import api from "~/modules/pharmacy/pharmacy.api";
import { debounce, find, get } from "lodash";
import { DataSourceItemType } from "../pharmacy.modal";
import Search from "antd/es/input/Search";

type propsType = {
  onChange: (newDataSource: DataSourceItemType) => void;
  dataSource: DataSourceItemType[];
  id?  : string;
};

type DataSourceItemTypeSearch = DataSourceItemType & {
  employee: {
    fullName: string;
    _id: string;
  };
};

export default function AssignPharmacy({
  onChange,
  dataSource,
  id,
}: propsType): React.JSX.Element {
  const [keyword, setKeyword] = useState("");
  const query = useMemo(() => ({ keyword,id }), [keyword,id]);
  const [pharmacySearch, isLoading] = useFetchState({
    api: api.getAssign,
    query,
    useDocs: false,
  });

  const onAdd = useCallback(
    (newData: DataSourceItemType) => {
        onChange(newData);
      },
    [onChange],
  )
  ;

  const data = useMemo(
    () =>
      pharmacySearch?.filter((item:DataSourceItemTypeSearch) => {
        const ExistInDataSource = dataSource?.some(
            (itemDataSource: DataSourceItemType) =>
              get(itemDataSource, "_id") === get(item, "_id")
          );
          return !ExistInDataSource
      }),
    [dataSource, pharmacySearch]
  );
  const debounceFetcher = debounce(setKeyword, 300);

  return (
    <BaseBorderBox title={"Thêm khách hàng B2B"}>
      <Search onChange={(e) => debounceFetcher(e.target.value)}/>
      <List
      size="small"
        loading={isLoading}
        className="scrollList"
        itemLayout="horizontal"
        dataSource={data || []}
        renderItem={(item: DataSourceItemType) => (
          <List.Item
            actions={[
                <Button disabled={!!get(item,'employee')} onClick={() => onAdd(item)} type="primary">
                Thêm
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <span>
                  {get(item, "name", "")} - {get(item, "phoneNumber", "")} {get(item,'employee') ? <Tag color={'error'}>Đã được đảm nhiệm bởi: <Typography.Text copyable>{get(item,'employee.fullName','')}</Typography.Text></Tag> : ""}
                </span>
              }
              description={concatAddress(get(item, "address"))}
            />
          </List.Item>
        )}
      />
    </BaseBorderBox>
  );
}
