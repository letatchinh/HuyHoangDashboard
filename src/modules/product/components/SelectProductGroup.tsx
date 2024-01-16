import { Button, Col, Form, Modal, Row } from "antd";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import DebounceSelect from "~/components/common/DebounceSelect";
import RenderLoading from "~/components/common/RenderLoading";
import { MAX_LIMIT } from "~/constants/defaultValue";
import ProductGroupModule from "~/modules/productGroup";
import { getActive } from "~/utils/helpers";

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
  const fetchOptionsProductGroup = useCallback(async (keyword?: string) => {
    try {
      const res = await ProductGroupModule.api.getAll({
        keyword,
        limit: MAX_LIMIT,
      });
      return getActive(get(res, "docs", []))?.map((item: any) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
      }));
    } catch (error) {
      console.log(error);
      return []
      
    }
  }, []);

  const initProductGroup = useMemo(
    () =>
      product && [
        {
          label: get(product, "productGroup.name"),
          value: get(product, "productGroupId"),
        },
      ],
    [product]
  );
  return (
    <>
    <Form.Item
      label="Nhóm thuốc"
      name="productGroupId"
      rules={[{ required: true, message: "Vui lòng chọn Nhóm thuốc!" }]}
    >
      <Row>
          <Col flex={1}>
          {RenderLoading(
        isLoading,
        <DebounceSelect
          placeholder="Nhóm thuốc"
          fetchOptions={fetchOptionsProductGroup}
          style={{ width: "100%" }}
          initOptions={initProductGroup}
        />
      )}
          </Col>
          <Col>
            <Button onClick={onOpen}>+</Button>
          </Col>
        </Row>
    
    </Form.Item>
      <Modal destroyOnClose open={open} onCancel={onClose} footer={null}>
      <ProductGroupModule.page.form callBack={onClose} updateProductConfig={() => {}}/>
    </Modal>
    </>
  );
}
