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
export default function FormProduct({
  supplierId,
  id,
  onCancel,
}: any): React.JSX.Element {
  // const supplierInfo = useSupplierInfoRedux();
  const {onNotify} = useNotificationStore();
  const [form] = Form.useForm();
  const [backupForm,setBackupForm] = useState<any[]>([]);
  
  const [isSubmitLoading, onCreate] = useCreateCostManagement(onCancel);
  const [, onUpdate] = useUpdateCostManagement(onCancel);
  const [costManagement, isLoading] = useGetCostManagement(id);
  // const [dataNotificationUndo,setDataNotificationUndo] = useState({
  //   open : false,
  //   description : null
  // })
  useResetAction();
  
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
    
    const data:any ={...values,startDate:dayjs(values.startDate).format('YYYY-MM-DD HH:mm:ss'),endDate:dayjs(values.endDate).format('YYYY-MM-DD HH:mm:ss')}
    // const submitData = convertSubmitData({values,supplierId});
      
    if (id) {
      onUpdate({ ...data});
      form.resetFields();
      onCancel();
    } else {
      onCreate(values);
      form.resetFields();
      onCancel();
    }
    console.log(data,'values')
  };

  // useEffect(() => {
  //   if (costManagement && id) {
  //   // const costManagement = convertcostManagement(product);
    
  //     form.setFieldsValue(costManagement);
  //     setBackupForm([costManagement]);
  //   }else{
  //     setBackupForm([form.getFieldsValue()])
  //   };
    
  // }, [costManagement, id, form]);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };
  const onValuesChange = (valueChange: any, values: any) => {
  
    // Recover Form
    const onSetRecoverForm = () => setBackupForm((pre:any[]) => [...pre,values]);
    const debounceSetRecover = debounce(onSetRecoverForm,0);
    debounceSetRecover();
  };
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
        <BaseBorderBox title={"Thông tin chung"}>
          
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí vận chuyển"
                name={'logistic'}
              >
                {RenderLoading(isLoading, <InputNumber />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<any>
                label="Chi phí kênh phân phối"
                name={["productDetail", "distributionChannel"]}
              >
                {RenderLoading(isLoading, <InputNumber />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí trình dược viên"
                name={["productDetail", "pharmaceutical"]}
              >
                {RenderLoading(isLoading, <InputNumber />)}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí vận hành"
                name={["cost", "operations"]}
              >
                {RenderLoading(isLoading, <InputNumber />)}
              </Form.Item>
            </Col>
          </Row>

          <Row {...layoutRow}>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí maketing"
                name={["cost", "maketing"]}
              >
                {RenderLoading(isLoading, <InputNumber />)}
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item<any>
                label="Chi phí quản lý"
                name={["cost", "management"]}
              >
                {RenderLoading(isLoading, <InputNumber />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
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
