import { Button, Col, Form, Modal, Row, Select } from "antd";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import DebounceSelect from "~/components/common/DebounceSelect";
import RenderLoading from "~/components/common/RenderLoading";
import { MAX_LIMIT } from "~/constants/defaultValue";
import ManufacturerModule from "~/modules/manufacturer";
import { filterSelectWithLabel, getActive } from "~/utils/helpers";
import { useFetchState } from "~/utils/hook";

type propsType = {
  isLoading: boolean;
  product: any;
};

export default function SelectManufacturer({
  isLoading,
  product,
}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [reFetch,setReFetch] = useState(false);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const [manufacturers,loading] = useFetchState({api : ManufacturerModule.api.getAllPublic,useDocs : false,reFetch});
  const options = useMemo(() => manufacturers?.map((item:any) => ({
    label : get(item,'name'),
    value : get(item,'_id'),
  })),[manufacturers]);
  const fetchOptionsManufacturer = useCallback(async (keyword?: string) => {
    try {
      const res = await ManufacturerModule.api.getAll({
        keyword,
        limit: MAX_LIMIT,
      });
      return getActive(get(res, "docs", []))?.map((item: any) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }, []);

  const initManufacturer = useMemo(
    () =>
      product && [
        {
          label: get(product, "manufacturer.name"),
          value: get(product, "manufacturerId"),
        },
      ],
    [product]
  );
  return (
    <>
      <Form.Item
        label="Hãng sản xuất"
        name="manufacturerId"
        rules={[{ required: true, message: "Vui lòng chọn hãng sản xuất!" }]}
      >
      {RenderLoading(
          isLoading,
          // <DebounceSelect 
          //   className="right--parent"
          //   placeholder="Hãng sản xuất"
          //   fetchOptions={fetchOptionsManufacturer}
          //   style={{ width: "100%" }}
          //   initOptions={initManufacturer}
          // />
          <Select 
            className="right--parent"
            placeholder="Nhóm thuốc"
            options={options}
            style={{ width: "100%" }}
            showSearch
            filterOption={filterSelectWithLabel}
          />
        )}
      </Form.Item>
      <Button className="right--child" onClick={onOpen}>
        +
      </Button>
      <Modal destroyOnClose open={open} onCancel={onClose} footer={null}>
        <ManufacturerModule.page.form
          callBack={() => {
            onClose();
            setReFetch(!reFetch)
          }}
          updateManufacturer={() => {}}
        />
      </Modal>
    </>
  );
}
