import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import Search from "antd/es/input/Search";
import React, { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import DiscountForm from "../components/DiscountForm";
type propsType = {};
export default function Discount(props: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<any>();
  const onOpen = useCallback((i?: any) => {
    if (id) setId(i);
    setOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setOpen(false);
    setId(null);
  }, []);
  return (
    <div>
      <Breadcrumb title={"Danh sách mã giảm giá"} />
      <Flex style={{ marginBottom: 8 }} justify={"space-between"}>
        <Search
          enterButton
          placeholder="Tìm mã giảm giá..."
          style={{ width: 200 }}
        />
        <Button onClick={() => onOpen()} type="primary" icon={<PlusOutlined />}>
          Thêm mới
        </Button>
      </Flex>
      <TableAnt />
      <ModalAnt title="Tạo mới mã giảm giá" width={800} onCancel={onClose} open={open} destroyOnClose footer={null}>
        <DiscountForm />
      </ModalAnt>
    </div>
  );
}
