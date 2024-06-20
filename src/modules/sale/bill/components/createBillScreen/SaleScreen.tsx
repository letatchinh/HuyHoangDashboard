import { Button, Col, Divider, Form, Row } from "antd";
import { get, head } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FormFieldCreateBill, PayloadCreateBill } from "~/modules/sale/bill/bill.modal";
import QuotationModule from '~/modules/sale/quotation';
import { DataResultType } from "~/pages/Dashboard/Bill/CreateBill";
import useNotificationStore from "~/store/NotificationContext";
import { concatAddress } from "~/utils/helpers";
import { useChangeDocumentTitle } from "~/utils/hook";
import { defaultFee } from "../../constants";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import ProductSelectedTable from "../ProductSelectedTable";
import SelectPharmacy from "../SelectPharmacy";
import TotalBill from "./TotalBill";
type propsType = {};
export default function SaleScreen(props: propsType): React.JSX.Element {
  const { form, onValueChange, quotationItems, totalPriceAfterDiscount, onRemoveTab, bill, onOpenModalResult, totalAmount, mutateReValidate, setAddress, setFormAndLocalStorage, setPharmacyInfo } = useCreateBillStore();
 const feeForm = Form.useWatch('fee',form);
  const { onNotify } = useNotificationStore();
  const callBackAfterSuccess = (newData: DataResultType) => {
    onRemoveTab();
    onOpenModalResult(newData);
  };
  const [isSubmitLoading, onCreateQuotation] =
    QuotationModule.hook.useCreateQuotation(callBackAfterSuccess);
  const [, onUpdateQuotation] =
    QuotationModule.hook.useUpdateQuotation(callBackAfterSuccess);
  const [, onConvertQuotation] =
    QuotationModule.hook.useConvertQuotation(callBackAfterSuccess);
  const onFinish = (values: FormFieldCreateBill) => {
    try {
      if (!quotationItems?.length) {
        return onNotify?.warning("Vui lòng chọn thuốc!");
      }

      if (totalPriceAfterDiscount < 0) {
        return onNotify?.warning("Số tiền không hợp lệ");
      }
      const submitData: PayloadCreateBill =
        QuotationModule.service.convertDataQuotation({
          quotationItems: quotationItems,
          data: values,
          totalPriceAfterDiscount,
          _id: get(bill, "dataUpdateQuotation.id"),
          totalAmount,
          dataTransportUnit: get(bill, 'dataTransportUnit'),
          warehouseId: get(bill, 'warehouseId'),
        });
      switch (get(bill, "typeTab")) {
        case "createQuotation":
          onCreateQuotation(submitData);
          break;
        case "updateQuotation":
          onUpdateQuotation(submitData);
          break;
        case "convertQuotation":
          onConvertQuotation(submitData);
          break;

        default:
          break;
      }
    } catch (error: any) {
      onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra");
    }
  };
  const textSubmit = useMemo(() => {
    switch (get(bill, "typeTab")) {
      case "createQuotation":
        return "Tạo đơn hàng tạm (F1)";
      case "updateQuotation":
        return "Cập nhật đơn hàng (F1)";
      case "convertQuotation":
        return "Chuyển đổi đơn hàng (F1)";

      default:
        break;
    }
  }, [bill]);
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      // Check if the pressed key is F1
      if (event.key === "F1") {
        form.submit();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
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
        pair: 0,
        fee: defaultFee,
      }}
    >
      <Row gutter={16}>
        <Col span={16}>
          <ProductSelectedTable />
        </Col>
        <Col span={8} className="form-create-bill--payment">
          <div>
            <SelectPharmacy onChange={(value, option) => {
                const fee = get(option,'data.fee',[]);
                if(fee?.length){
                  feeForm[0] = head(fee);
                }else{
                  feeForm[0] = {
                    typeFee : 'SUB_FEE',
                    typeValue : 'VALUE',
                    value : 0
                  }
                }
                const deliveryAddress = concatAddress(get(option,'data.addressDelivery',get(option,'data.address','')));
                const address = get(option,'data.addressStories',[]);
                setFormAndLocalStorage({
                    fee : feeForm,
                    pharmacyId : value,
                    deliveryAddress,
                  });
  
                setAddress(address);
                mutateReValidate();
                setPharmacyInfo(option);
                }}
                id={get(bill, 'pharmacyId')} form={form} allowClear={false} />
            <Divider/>
            <TotalBill />
          </div>
          <div className="form-create-bill--payment__actions">
            <Row gutter={8} justify={"center"} align="middle" wrap={false}>
              {/* <Col flex={1}>
                <Button
                block
                  className="form-create-bill--payment__actions__btnDebt"
                  onClick={onOpenDebt}
                >
                  Hình thức thanh toán
                </Button>
              </Col> */}
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
          </div>
        </Col>
      </Row>
    </Form>
  );
}
