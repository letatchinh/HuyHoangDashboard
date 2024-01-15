import { Button, Col, ColProps, Form, Row, RowProps } from "antd";
import React from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { FormFieldCreateBill } from "../bill.modal";
import ProductSelectedTable from "../components/ProductSelectedTable";
import SelectPharmacy from "../components/SelectPharmacy";
import SelectProduct from "../components/SelectProduct";
type propsType = {};
const layoutRow : RowProps = {
    gutter : 16
}
const layoutCol : ColProps = {
    span : 8
}
export default function CreateBill(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: FormFieldCreateBill) => {
    console.log(values);
  };
  return (
    <div>
      <Breadcrumb title={"Tạo đơn hàng"} />

      <Form 
      className="form-create-bill"
      form={form} 
      onFinish={onFinish}
      >
        <Row {...layoutRow}>
          <Col {...layoutCol}>
            <SelectPharmacy />
          </Col>
          
        </Row>
        <Row {...layoutRow}>
          <Col {...layoutCol}>
            <SelectProduct />
          </Col>
          
        </Row>
        <ProductSelectedTable 
        />
        <Row justify={"end"}>
          <Col>
          <Button size="large" type="primary" htmlType="submit">
          Tạo đơn hàng
        </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
