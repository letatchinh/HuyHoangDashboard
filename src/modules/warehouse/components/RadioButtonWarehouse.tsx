import React, { useMemo, useState } from "react";
import { useGetProfile } from "~/modules/auth/auth.hook";
import { useFetchState } from "~/utils/hook";
import apis from "../warehouse.api";
import { get } from "lodash";
import { Button, Radio, RadioChangeEvent, Row, Space, Spin } from "antd";
type propsType = {
  setValue: (value: number) => void;
  value: number | undefined;
  onClick?: () => void;
  onCancel?: () => void;
  title: string;
};
export default function RadioButtonWarehouse({
  setValue,
  value,
  onClick,
  onCancel,
  title,
}: propsType): React.JSX.Element {
  const profile = useGetProfile();
  const query = useMemo(
    () => ({
      branchId: profile?.profile?.branchId,
    }),
    [profile]
  );
  const [listWarehouse, isLoadingWarehouse] = useFetchState({
    api: apis.getAllWarehouse,
    query,
    useDocs: false,
  });
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  return (
    <>
      {isLoadingWarehouse
        ? <Spin />
        : <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            {listWarehouse?.map((item: any) => (
              <Radio value={get(item, "_id")}>
                {get(item, "name.vi") || get(item, "name")}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      }
      <Row justify={"end"}>
        <Button type="primary" onClick={onClick} style={{ marginRight: "10px" }}>
          {title || 'Chọn'}
        </Button>
      </Row>
    </>
  );
}
