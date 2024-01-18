import { Button, Col, Form, Modal, Row, Select } from "antd";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import DebounceSelect from "~/components/common/DebounceSelect";
import RenderLoading from "~/components/common/RenderLoading";
import { MAX_LIMIT } from "~/constants/defaultValue";
import ProductGroupModule from "~/modules/productGroup";
import { getActive } from "~/utils/helpers";
import { useFetchState } from "~/utils/hook";

type propsType = {
  isLoading: boolean;
  product: any;
};

export default function SelectProductGroup({
  isLoading,
  product,
}: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const [productGroups,loading] = useFetchState({api : ProductGroupModule.api.getAllPublic,useDocs : false});
  const options = useMemo(() => productGroups?.map((item:any) => ({
    label : get(item,'name'),
    value : get(item,'_id'),
  })),[productGroups]);
  return (
    <>
      <Form.Item
        label="Nhóm thuốc"
        name="productGroupId"
        rules={[{ required: true, message: "Vui lòng chọn Nhóm thuốc!" }]}
      >
        {RenderLoading(
          isLoading,
          <Select 
            className="right--parent"
            placeholder="Nhóm thuốc"
            options={options}
            style={{ width: "100%" }}
          />
        )}
      </Form.Item>
      <Button className="right--child" onClick={onOpen}>
        +
      </Button>
      <Modal destroyOnClose open={open} onCancel={onClose} footer={null}>
        <ProductGroupModule.page.form
          callBack={onClose}
          updateProductConfig={() => {}}
        />
      </Modal>
    </>
  );
}

  // <DebounceSelect
          //   className="right--parent"
          //   placeholder="Nhóm thuốc"
          //   fetchOptions={fetchOptionsProductGroup}
          //   style={{ width: "100%" }}
          //   initOptions={initProductGroup}
          // />