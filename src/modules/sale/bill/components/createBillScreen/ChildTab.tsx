import { Button, Col, Form, Row } from "antd";
import { pick } from "lodash";
import React, { useCallback, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import { billItem, FormFieldCreateBill, PayloadCreateBill } from "~/modules/sale/bill/bill.modal";
import useNotificationStore from "~/store/NotificationContext";
import { useCreateBill } from "../../bill.hook";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import ProductSelectedTable from "../ProductSelectedTable";
import SelectPharmacy from "../SelectPharmacy";
import SelectDebt from "./SelectDebt";
import TotalBill from "./TotalBill";
type propsType = {};
export default function ChildTab(props: propsType): React.JSX.Element {
 const {form,onValueChange,billItems,totalPriceAfterDiscount,verifyData,onRemoveTab} = useCreateBillStore();
 const {onNotify} = useNotificationStore();
 const [isSubmitLoading,onCreateBill] = useCreateBill(onRemoveTab);
 const [openDebt,setOpenDebt] = useState(false);
 const onOpenDebt = useCallback(() => setOpenDebt(true),[]);
 const onCloseDebt = useCallback(() => setOpenDebt(false),[]);
  const onFinish = (values: FormFieldCreateBill) => {
try {
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
      'codeBySupplier'
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
} catch (error : any) {
  onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra")
}
    
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
            <SelectPharmacy form={form}/>
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
                  Hình thức thanh toán
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
