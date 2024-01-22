import { Button, Col, Form, Row } from "antd";
import { get, pick } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import { quotation, FormFieldCreateBill, PayloadCreateBill } from "~/modules/sale/bill/bill.modal";
import useNotificationStore from "~/store/NotificationContext";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import ProductSelectedTable from "../ProductSelectedTable";
import SelectPharmacy from "../SelectPharmacy";
import SelectDebt from "./SelectDebt";
import TotalBill from "./TotalBill";
import QuotationModule from '~/modules/sale/quotation';
type propsType = {};
export default function ChildTab(props: propsType): React.JSX.Element {
 const {form,onValueChange,quotationItems,totalPriceAfterDiscount,verifyData,onRemoveTab,bill} = useCreateBillStore();
 const {onNotify} = useNotificationStore();
 const [isSubmitLoading,onCreateQuotation] = QuotationModule.hook.useCreateQuotation(() => onRemoveTab());
 const [,onUpdateQuotation] = QuotationModule.hook.useUpdateQuotation(() => onRemoveTab());
 const [,onConvertQuotation] = QuotationModule.hook.useConvertQuotation(() => onRemoveTab());
 const [openDebt,setOpenDebt] = useState(false);
 const onOpenDebt = useCallback(() => setOpenDebt(true),[]);
 const onCloseDebt = useCallback(() => setOpenDebt(false),[]);
  const onFinish = (values: FormFieldCreateBill) => {
try {
  const submitData : PayloadCreateBill = QuotationModule.service.convertDataQuotation({
    quotationItems : quotationItems,
    data : values,
    totalPriceAfterDiscount,
    _id : get(bill,'dataUpdateQuotation.id')
  });
  console.log(submitData,'submitData')
    switch (get(bill,'typeTab')) {
      case 'createQuotation':
        onCreateQuotation(submitData);
        break;
      case 'updateQuotation':
        onUpdateQuotation(submitData);
        break;
      case 'convertQuotation':
        onConvertQuotation(submitData);
        break;
    
      default:
        break;
    }
  
} catch (error : any) {
  onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra")
}
    

  };
  const textSubmit = useMemo(() => {
    switch (get(bill,'typeTab')) {
      case 'createQuotation':
        return "Tạo đơn hàng tạm (F1)"
      case 'updateQuotation':
        return "Cập nhật đơn hàng (F1)"
      case 'convertQuotation':
        return "Chuyển đổi đơn hàng (F1)"
    
      default:
        break;
    }
  },[bill])
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
                  {textSubmit}
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
