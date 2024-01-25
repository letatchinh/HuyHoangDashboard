import { Button, Col, Divider, Form, Row } from "antd";
import { get, pick } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import { quotation, FormFieldCreateBill, PayloadCreateBill } from "~/modules/sale/bill/bill.modal";
import useNotificationStore from "~/store/NotificationContext";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import ProductSelectedTable from "../ProductSelectedTable";
import SelectPharmacy from "../SelectPharmacy";
import SelectDebt from "./SelectDebt";
import TotalBill from "./TotalBill";
import QuotationModule from '~/modules/sale/quotation';
import { DataResultType } from "~/pages/Dashboard/Bill/CreateBill";
import { useChangeDocumentTitle } from "~/utils/hook";
type propsType = {};
export default function SaleScreen(props: propsType): React.JSX.Element {
 const {form,onValueChange,quotationItems,totalPriceAfterDiscount,verifyData,onRemoveTab,bill,onOpenModalResult} = useCreateBillStore();
 const {onNotify} = useNotificationStore();
 const callBackAfterSuccess = (newData : DataResultType) => {
  onRemoveTab();
  onOpenModalResult(newData);
 };
 const [isSubmitLoading,onCreateQuotation] = QuotationModule.hook.useCreateQuotation(callBackAfterSuccess);
 const [,onUpdateQuotation] = QuotationModule.hook.useUpdateQuotation(callBackAfterSuccess);
 const [,onConvertQuotation] = QuotationModule.hook.useConvertQuotation(callBackAfterSuccess);
 const [openDebt,setOpenDebt] = useState(false);
 const onOpenDebt = useCallback(() => setOpenDebt(true),[]);
 const onCloseDebt = useCallback(() => setOpenDebt(false),[]);
  const onFinish = (values: FormFieldCreateBill) => {
try {
  if(!quotationItems?.length){
    return onNotify?.warning("Vui lòng chọn thuốc!")
  }
  const submitData : PayloadCreateBill = QuotationModule.service.convertDataQuotation({
    quotationItems : quotationItems,
    data : values,
    totalPriceAfterDiscount,
    _id : get(bill,'dataUpdateQuotation.id'),
    
  });
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
  },[bill]);
  useEffect(() => {
    const handleKeyPress = (event : any) => {
      // Check if the pressed key is F1
      if (event.key === 'F1') {
        form.submit();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); 

  useChangeDocumentTitle("Tạo đơn hàng");
  return (
    <Form
      className="form-create-bill"
      form={form}
      onFinish={onFinish}
      onValuesChange={onValueChange}
      initialValues={{
        pair : 0
      }}
    >
      <Row gutter={16}>
        <Col span={16}>
          <ProductSelectedTable />
        </Col>
        <Col span={8} className="form-create-bill--payment">
          <div>
            <SelectPharmacy form={form} allowClear={false}/>
            <Divider/>
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
                  disabled={!quotationItems?.length}
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
      <ModalAnt onCancel={onCloseDebt} open={openDebt} footer={[<Button onClick={onCloseDebt}>Đóng</Button>]}>
        <SelectDebt />
      </ModalAnt>
    </Form>
  );
}
