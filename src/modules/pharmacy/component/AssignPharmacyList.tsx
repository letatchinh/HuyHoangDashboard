import { Button, List } from "antd";
import { get } from "lodash";
import React, { useMemo } from "react";
import { concatAddress } from "~/utils/helpers";
import { DataSourceItemType } from "../pharmacy.modal";
type propsType = {
  dataSource: DataSourceItemType[];
  onRemove: (id: string) => void;
};
export default function AssignPharmacyList({
  dataSource,
  onRemove,
}: propsType): React.JSX.Element {
  return (
    <List
    size="small"
      className="scrollList"
      loading={false}
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={(item: DataSourceItemType) => (
        <List.Item
          actions={[
            <Button danger onClick={() => onRemove(get(item, "_id"))}>
              Gỡ
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={
              <span>
                {get(item, "name", "")} - {get(item, "phoneNumber", "")}
              </span>
            }
            description={concatAddress(get(item, "address"))}
          />
        </List.Item>
      )}
    />
  );
}
