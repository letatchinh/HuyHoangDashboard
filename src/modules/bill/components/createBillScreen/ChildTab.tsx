import { Button, Col, ColProps, Form, Row, RowProps } from "antd";
import React from "react";
import useCreateBillStore from "~/store/createBillContext";
import { FormFieldCreateBill } from "../../bill.modal";
import ProductSelectedTable from "../ProductSelectedTable";
import SelectPharmacy from "../SelectPharmacy";
import TotalBill from "./TotalBill";
type propsType = {};
export default function ChildTab(props: propsType): React.JSX.Element {
 const {form,onValueChange} = useCreateBillStore();
  const onFinish = (values: FormFieldCreateBill) => {
    console.log(values);
  };
  return (
    <Form className="form-create-bill" form={form} onFinish={onFinish} onValuesChange={onValueChange}>
      <Row gutter={16} >
        <Col span={16}>
          <ProductSelectedTable />
        </Col>
        <Col span={8} className="form-create-bill--payment">
         <div>
         <SelectPharmacy />
          <TotalBill />
         </div>
         <div className="form-create-bill--payment__actions">
         <Row justify={"end"}>
            <Col>
              <Button
                className="form-create-bill--payment__actions__btnPayment"
                size="large"
                type="primary"
                htmlType="submit"
              >
                Tạo đơn hàng (F1)
              </Button>
            </Col>
          </Row>
         </div>
        </Col>
      </Row>
    </Form>
  );
}
