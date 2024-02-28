import { GiftTwoTone, UndoOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, notification, Row, Select, Tabs } from "antd";
import { compact, concat, debounce, get, keys } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";

import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { useSupplierInfoRedux } from "~/modules/productsAll/productsAll.hook";

import TabPane from "antd/es/tabs/TabPane";
import useNotificationStore from "~/store/NotificationContext";
import { useCreateCostManagement, useGetCostManagement, useResetAction, useUpdateCostManagement } from "../costManagement.hook";
import { DatePickerProps } from "antd/lib";
import dayjs from "dayjs";

const layoutRow = {
  gutter: 16,
};
export default function CostManagementForm({
  id,
  onCancel,
}: any): React.JSX.Element {
  // const supplierInfo = useSupplierInfoRedux();
  const {onNotify} = useNotificationStore();
  const [form] = Form.useForm();
  const [backupForm,setBackupForm] = useState<any[]>([]);
  
  const [isSubmitLoading, onCreate] = useCreateCostManagement(onCancel);
  const [, onUpdate] = useUpdateCostManagement(onCancel);
  const [costManagementById, isLoading] = useGetCostManagement(id);
  const [toTalPrice,setToTalPrice] = useState(10000); //giá bán
  const [toTalDiscount,setToTalDiscount] = useState(0); // tổng tiền chiết khấu
  const [totalAmount,setTotalAmount] = useState(0); // tổng lợi nhuận
  const [totalRelated,setTotalRelated] = useState<number>(0); //tổng chi phí liên quan
  const [priceMemo, setPriceMemo] = useState(0);
  // const [dataNotificationUndo,setDataNotificationUndo] = useState({
  //   open : false,
  //   description : null
  // })
  useResetAction();
  useEffect(() => {
    
  
    setPriceMemo(10000)
  }, []);
  const onUndoForm = (isLast = false) => {
    
    // Action Back One step to set Form And Remove last Recover
    const stepUndo = ((backupForm.length === 1) || isLast) ? 1 : 2;
    
    const preForm = backupForm[backupForm.length - stepUndo];
    form.setFieldsValue(preForm);
    const newRecoverForm = [...backupForm];
    
    newRecoverForm.pop();
    setBackupForm(newRecoverForm);
  }


  const onFinish = (values: any) => {
    const data:any ={...values,startDate:dayjs(values.startDate).format('YYYY-MM-DD HH:mm:ss'),endDate:dayjs(values.endDate).format('YYYY-MM-DD HH:mm:ss')};
    if (id) {
      onUpdate({ ...data, _id: id });
      form.resetFields();
      onCancel();
    } else {
      onCreate(values);
      form.resetFields();
      onCancel();
    }
    console.log(data,'values')
  };

  useEffect(() => { 
    form.setFieldsValue({
        price:10000
      });
    if (costManagementById && id) {
      const { price} = costManagementById;

    
      setBackupForm([costManagementById]);
    }else{
      setBackupForm([form.getFieldsValue()])
    };
    
  }, [costManagementById, id, form]);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  const onValuesChange = (valueChange: any, values: any) => {
  
    // Recover Form
    const onSetRecoverForm = () => setBackupForm((pre:any[]) => [...pre,values]);
    const debounceSetRecover = debounce(onSetRecoverForm,0);
    debounceSetRecover();
  };

  const onChange1 = (value: any) => {
    console.log(value)
    // setTotalAmount(value);
  }
  const handLeBlur = (value: any) => {
    const values = totalRelated + parseFloat(value);
    setTotalRelated(values);
  }
  return (
    <div>
      <h5>Tạo mới chi phí</h5>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        scrollToFirstError={true}
        
        initialValues={{
          variants: [
            {
              exchangeValue: 1,
              variantIsDefault: true,
            },
          ],
        }}
        onValuesChange={onValuesChange}
      >
        {/* <Form.Item<any> name="medicalCode" hidden /> */}
        {/* <BaseBorderBox title={"Thông tin sản phẩm"}>
          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Mã sản phẩm"
                name={'code'}
              >
                {RenderLoading(isLoading, <Input readOnly />)}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item<any>
                label="Tên sản phẩm"
                name={'name'}
              >
                {RenderLoading(isLoading, <Input readOnly />)}
              </Form.Item>
            </Col>
          </Row>

          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Chi nhánh"
                name={'branch'}
              >
                {RenderLoading(isLoading, <Input readOnly />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox> */}
        <BaseBorderBox title={"Khoảng ngày"}>
          <Col style={{ paddingBottom: 10 }} span={12}>
          <Form.Item<any>
                label="Ngày bắt đầu"
                name={'startDate'}
              >
               <DatePicker onChange={onChange} />
              </Form.Item>
          </Col>
          <Col style={{ paddingBottom: 10 }} span={12}>
          <Form.Item<any>
                label="Ngày kết thúc"
                name={'endDate'}
              >
               <DatePicker onChange={onChange} />
          </Form.Item>
          </Col>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin sản phẩm"}>
          <Col style={{ paddingBottom: 10 }} span={12}>
          <Form.Item<any>
                label="Giá bán"
                name={'price'}
              >
                {RenderLoading(isLoading, <InputNumber  style={{width:'100%'}}/>)}
              </Form.Item>
          </Col>
          <Col style={{ paddingBottom: 10 }} span={12}>
          <Form.Item<any>
                label="Lợi nhuận mong đợi"
                name={'exchangeValue'}
              >
                {RenderLoading(isLoading, <InputNumber onChange={(e:any)=>{
                  onChange1(e);
                }}
                onBlur={(e:any)=>{ const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  //  handLeBlur(e.target.value)
                  ;}}  style={{width:'100%'}}/>)}
              </Form.Item>
          </Col>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin chi phí"}>
          
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí vận chuyển"
                name={'logistic'}
              >
                {RenderLoading(isLoading, <InputNumber  onBlur={(e:any)=>{ const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                  ;}}  style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí kênh phân phối"
                name={["productDetail", "distributionChannel"]}
              >
                {RenderLoading(isLoading, <InputNumber  onBlur={(e:any)=>{ const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                  ;}} style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí trình dược viên"
                name={["productDetail", "pharmaceutical"]}
              >
                {RenderLoading(isLoading, <InputNumber  onBlur={(e:any)=>{ const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                  ;}} style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí vận hành"
                name={["cost", "operations"]}
              >
                {RenderLoading(isLoading, <InputNumber  onBlur={(e:any)=>{ const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  handLeBlur(e.target.value)
                  ;}} style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
          </Row>

          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí maketing"
                name={["cost", "maketing"]}
              >
                {RenderLoading(isLoading, <InputNumber  onBlur={(e:any)=>{ const a = priceMemo - e.target.value
                  setPriceMemo(a);
                   handLeBlur(e.target.value)
                  ;}} style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí quản lý"
                name={["cost", "management"]}
              >
                {RenderLoading(isLoading, <InputNumber  onBlur={(e:any)=>{ const a = priceMemo - e.target.value
                  setPriceMemo(a);
                  ;}} style={{width:'100%'}}/>)}
              </Form.Item>
            </Col>
          </Row>
          <h4>{`Tổng số tiền liên quan: ${totalRelated}`}</h4>
        </BaseBorderBox>
        <BaseBorderBox title={"Thông tin chương trình khuyến mãi"}>
          <Row {...layoutRow}>
            <Col span={12}>
             
            </Col>
          </Row>
        </BaseBorderBox>
        <h2>Số tiền còn lại: {priceMemo}</h2>
        <Row justify={"end"} gutter={16}>
          <Col>
          <Button disabled={backupForm.length <= 1} onClick={() => onUndoForm()}>
            Hoàn tác
          </Button>
          </Col>
          <Col>
            <Button onClick={onCancel}>
              Huỷ
            </Button>
          </Col>
          <Col>
            <Button
             
              loading={isSubmitLoading}
              htmlType="submit"
              type="primary"
            >
              {id ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Col>
        </Row>
      </Form>
      
    </div>
  );
}
