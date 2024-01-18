import { Button, Col, ColProps, Form, Modal, Row, RowProps } from "antd";
import React, { useCallback, useState } from "react";
import useCreateBillStore from "~/store/createBillContext";
import { billItem, FormFieldCreateBill, PayloadCreateBill } from "~/modules/bill/bill.modal";
import ProductSelectedTable from "../ProductSelectedTable";
import SelectPharmacy from "../SelectPharmacy";
import TotalBill from "./TotalBill";
import { omit, pick } from "lodash";
import ModalAnt from "~/components/Antd/ModalAnt";
import SelectDebt from "./SelectDebt";
import { useCreateBill } from "../../bill.hook";
type propsType = {};
export default function ChildTab(props: propsType): React.JSX.Element {
 const {form,onValueChange,billItems,totalPriceAfterDiscount,verifyData,debt} = useCreateBillStore();
 const [isSubmitLoading,onCreateBill] = useCreateBill();
 const [openDebt,setOpenDebt] = useState(false);
 const onOpenDebt = useCallback(() => setOpenDebt(true),[]);
 const onCloseDebt = useCallback(() => setOpenDebt(false),[]);
  const onFinish = (values: FormFieldCreateBill) => {
    console.log(values);
    const billItemsSubmit : billItem[] = billItems?.map((billItem : any) => ({
      ...pick(billItem,[
        'cumulativeDiscount',
        'productId',
        'variantId',
        'price',
        'totalPrice',
        'quantity',
        'supplierId',
        'lotNumber',
        'expirationDate',
      ])
    }));
    // FixME : Verify Component not Updated data
    // verifyData(() => {
    //   const submitData : PayloadCreateBill = {
    //     ...values,
    //     billItems : billItemsSubmit,
    //     pair : 0,
    //     totalPrice : totalPriceAfterDiscount
    //   };
  
    //   console.log(submitData,'submitData');
    // });
    const submitData : PayloadCreateBill = {
        ...values,
        billItems : billItemsSubmit,
        pair : 0,
        totalPrice : totalPriceAfterDiscount
      };
      onCreateBill(submitData);
    console.log(submitData,'submitData');
    
  };
  return (
    <Form
      className="form-create-bill"
      form={form}
      onFinish={onFinish}
      onValuesChange={onValueChange}
    >
      <Row gutter={16}>
        <Col span={16}>
          <ProductSelectedTable />
        </Col>
        <Col span={8} className="form-create-bill--payment">
          <div>
            <SelectPharmacy />
            <TotalBill />
          </div>
          <div className="form-create-bill--payment__actions">
            <Row gutter={8} justify={"space-between"} align='middle' wrap={false}>
              <Col flex={1}>
                <Button
                block
                  className="form-create-bill--payment__actions__btnDebt"
                  onClick={onOpenDebt}
                >
                  Thanh toán nhiều hình thức
                </Button>
              </Col>
              <Col span={14}>
                <Button
                  block
                  className="form-create-bill--payment__actions__btnPayment"
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitLoading}
                >
                  Tạo đơn hàng (F1)
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <ModalAnt onCancel={onCloseDebt} open={openDebt}>
        <SelectDebt />
      </ModalAnt>
    </Form>
  );
}
