import { Button, Divider, Popconfirm, Row } from "antd";
import React from "react";
import ProductItem from "../ProductItem";
import TagBillItem from "../TagBillItem";
import PriceBill from "./PriceBill";
import useSplitBillStore from "../../storeContext/SplitBillContext";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
type propsType = {
  data: any;
};
export default function TabSplitBill({ data }: propsType): React.JSX.Element {
  const { onSubmit ,onCloseSplitBillForm} = useSplitBillStore();
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
      <ProductItem data={data?.billItems} column={addColumn} stylesTable={{height: '300px', overflowY: 'auto'}}/>
      <Divider />
      <PriceBill data={data} />
      <Row justify={"end"} align="middle">
        <WithPermission permission={POLICIES.WRITE_BILLSPLIT}>
        <Popconfirm
          title="Hành động này sẽ tạo ra 2 đơn hàng tạm và xoá đi đơn hàng chính thức này, bạn có chắc chắn?"
          onConfirm={onSubmit}
          okText="Đồng ý"
          cancelText="Huỷ"
          >
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            >
            Tách đơn
          </Button>
        </Popconfirm>
            </WithPermission>
        <Button danger onClick={onCloseSplitBillForm}>Huỷ</Button>
      </Row>
    </>
  );
}
