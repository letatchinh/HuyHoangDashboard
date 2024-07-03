import { Button, Divider, Row } from "antd";
import React from "react";
import ProductItem from "../ProductItem";
import TagBillItem from "../TagBillItem";
import PriceBill from "./PriceBill";
import useSplitBillStore from "../../storeContext/SplitBillContext";
type propsType = {
  data: any;
};
export default function TabSplitBill({ data }: propsType): React.JSX.Element {
  const { onSubmit } = useSplitBillStore();
  const addColumn = {
    title: "Trạng thái",
    dataIndex: "statusCheckWarehouse",
    key: "statusCheckWarehouse",
    width: 100,
    align: "center" as any,
    render: (value: any, record: any, index: number) => {
      return <TagBillItem status={record?.statusCheckWarehouse} />;
    },
  };

  return (
    <>
      <ProductItem data={data?.billItems} column={addColumn} />
      <Divider />
      <PriceBill data={data} />
      <Row justify={"end"} align="middle">
        <Button
          type="primary"
          onClick={onSubmit}
          style={{ marginRight: 10 }}
        >
          Tách đơn
        </Button>
        <Button danger>Huỷ</Button>
      </Row>
    </>
  );
}
