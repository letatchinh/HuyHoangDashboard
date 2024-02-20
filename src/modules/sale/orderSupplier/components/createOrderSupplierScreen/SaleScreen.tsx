import { UserOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Row } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo } from "react";
import { FormFieldCreateBill, PayloadCreateBill } from "~/modules/sale/bill/bill.modal";
import OrderSupplierModule from '~/modules/sale/orderSupplier';
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { DataResultType } from "~/pages/Dashboard/OrderSupplier/CreateOrderSupplier";
import useNotificationStore from "~/store/NotificationContext";
import { useChangeDocumentTitle } from "~/utils/hook";
import { FormFieldCreateOrderSupplier, PayloadCreateOrderSupplier } from "../../orderSupplier.modal";
import useCreateOrderSupplierStore from "../../storeContext/CreateOrderSupplierContext";
import ProductSelectedTable from "../ProductSelectedTable";
// import SelectPharmacy from "../SelectPharmacy";
import TotalBill from "./TotalBill";
type propsType = {};
export default function SaleScreen(props: propsType): React.JSX.Element {
 const {form,onValueChange,orderSupplierItems,totalPriceAfterDiscount,onRemoveTab,bill,onOpenModalResult,totalAmount} = useCreateOrderSupplierStore();
 
 const {onNotify} = useNotificationStore();
 const callBackAfterSuccess = (newData : DataResultType) => {  
  onRemoveTab();
  onOpenModalResult(newData);
 };
 const [isSubmitLoading,onCreateOrderSupplier] = OrderSupplierModule.hook.useCreateOrderSupplier(callBackAfterSuccess);
  const onFinish = (values: FormFieldCreateOrderSupplier) => {
try {
  if(!orderSupplierItems?.length){
    return onNotify?.warning("Vui lòng chọn thuốc!")
  }
  
  if(totalPriceAfterDiscount < 0){
    return onNotify?.warning("Số tiền không hợp lệ")
  }
  const submitData : PayloadCreateOrderSupplier = OrderSupplierModule.service.convertDataOrderSupplier({
    orderSupplierItems,
    data : values,
    totalPriceAfterDiscount,
    totalAmount,
    
  });
  
    switch (get(bill,'typeTab')) {
      case 'createOrderSupplier':
        onCreateOrderSupplier(submitData);
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
      case 'createOrderSupplier':
        return "Tạo đơn hàng (F1)"
    
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

  const supplierId = Form.useWatch('supplierId',form);
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
        <Form.Item label={<UserOutlined style={{fontSize : 18}}/>} colon={false} name={'supplierId'}>
        <SelectSupplier
          style={{width : '100%'}}
          disabled={!!supplierId && !!orderSupplierItems?.length}
          size='large'
        />

        </Form.Item>
            <Divider/>
            <TotalBill />
          </div>
          <div className="form-create-bill--payment__actions">
            <Row gutter={8} justify={"space-between"} align='middle' wrap={false}>
              <Col flex={1}>
                {/* <Button
                block
                  className="form-create-bill--payment__actions__btnDebt"
                  onClick={onOpenDebt}
                >
                  Hình thức thanh toán
                </Button> */}
              </Col>
              <Col span={14}>
                <Button
                  block
                  disabled={!orderSupplierItems?.length}
                  className="form-create-bill--payment__actions__btnPayment"
                  type="primary"
                  loading={isSubmitLoading}
                  onClick={() => form.submit()}
                >
                  {textSubmit}
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
