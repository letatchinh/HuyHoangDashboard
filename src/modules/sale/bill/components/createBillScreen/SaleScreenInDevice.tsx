import { Button, Col, Divider, Form, Row } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo } from "react";
import { FormFieldCreateBill, PayloadCreateBill } from "~/modules/sale/bill/bill.modal";
import QuotationModule from '~/modules/sale/quotation';
import { DataResultType } from "~/pages/Dashboard/Bill/CreateBill";
import useNotificationStore from "~/store/NotificationContext";
import { useChangeDocumentTitle } from "~/utils/hook";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import ProductSelectedTable from "../ProductSelectedTable";
import SelectPharmacy from "../SelectPharmacy";
import TotalBill from "./TotalBill";
import ProductSelectedTableInDevice from "../ProductSelectedTableInDevice";
import TotalBillInDevice from "./TotalBillInDevice";
import SelectPharmacyInDevice from "../SelectPharmacyInDevice";
type propsType = {};
export default function SaleScreenInDevice(props: propsType): React.JSX.Element {
 const {form,onValueChange,quotationItems,totalPriceAfterDiscount,verifyData,onRemoveTab,bill,onOpenModalResult,totalAmount} = useCreateBillStore();
 const {onNotify} = useNotificationStore();
 const callBackAfterSuccess = (newData : DataResultType) => {
  onRemoveTab();
  onOpenModalResult(newData);
 };
 const [isSubmitLoading,onCreateQuotation] = QuotationModule.hook.useCreateQuotation(callBackAfterSuccess);
 const [,onUpdateQuotation] = QuotationModule.hook.useUpdateQuotation(callBackAfterSuccess);
 const [,onConvertQuotation] = QuotationModule.hook.useConvertQuotation(callBackAfterSuccess);
  const onFinish = (values: FormFieldCreateBill) => {
try {
  if(!quotationItems?.length){
    return onNotify?.warning("Vui lòng chọn thuốc!")
  }
  
  if(totalPriceAfterDiscount < 0){
    return onNotify?.warning("Số tiền không hợp lệ")
  }
  const submitData : PayloadCreateBill = QuotationModule.service.convertDataQuotation({
    quotationItems : quotationItems,
    data : values,
    totalPriceAfterDiscount,
    _id : get(bill,'dataUpdateQuotation.id'),
    totalAmount,
    
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
        {/* <Col span={16}>
          <ProductSelectedTableInDevice />
        </Col> */}
        <Col span={24} className="form-create-bill--payment">
          <div>
            <SelectPharmacyInDevice form={form} allowClear={false}/>
            {/* <Divider/>
            <TotalBillInDevice /> */}
          </div>
        </Col>
          {/* <div className="form-create-bill--payment__actions">
            <Row gutter={8} justify={"space-between"} align='middle' wrap={false}>
              <Col flex={1}>
              </Col>
              <Col span={14}>
                <Button
                  block
                  disabled={!quotationItems?.length}
                  className="form-create-bill--payment__actions__btnPayment"
                  type="primary"
                  loading={isSubmitLoading}
                  onClick={() => form.submit()}
                >
                  {textSubmit}
                </Button>
              </Col>
            </Row>
          </div> */}
      </Row>
    </Form>
  );
}
