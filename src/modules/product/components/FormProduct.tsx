import { GiftTwoTone, UndoOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, notification, Row, Select } from "antd";
import { compact, concat, debounce, get, keys } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
import { 
  PRODUCT_TYPE, 
  PRODUCT_TYPE_VI,  
  SALE_LEVEL,
  SALE_LEVEL_VI 
} from "../constants";
import {
  useCreateProduct,
  useGetProduct,
  useResetAction,
  useUpdateProduct
} from "../product.hook";
import {
  FieldTypeFormProduct,
  TypePropsFormProduct
} from "../product.modal";
import { convertInitProduct, convertSubmitData } from "../product.service";
import MedicineName from "./MedicineName";
import SelectCountry from "./SelectCountry";
import SelectManufacturer from "./SelectManufacturer";
import SelectProductGroup from "./SelectProductGroup";
import Variants from "./Variants";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { useSupplierInfoRedux } from "~/modules/productsAll/productsAll.hook";
import { useDispatch } from "react-redux";
import { productActions } from "../redux/reducer";


const CLONE_PRODUCT_TYPE_VI: any = PRODUCT_TYPE_VI;
const CLONE_SALE_LEVEL_VI: any = SALE_LEVEL_VI;
const layoutRow = {
  gutter: 16,
};
export default function FormProduct({
  supplierId,
  id,
  onCancel,
  setSupplierId,
  setStep
}: TypePropsFormProduct): React.JSX.Element {
  const supplierInfo = useSupplierInfoRedux();
  const [form] = Form.useForm();
  const [backupForm, setBackupForm] = useState<FieldTypeFormProduct[]>([]);
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(productActions.resetAction());
  };
  const [isSubmitLoading, onCreate] = useCreateProduct(() => {
    onCancel();
    resetAction();
    setSupplierId(null);
    setStep(0)
  });
  const [, onUpdate] = useUpdateProduct(() => {
    onCancel();
    resetAction();
    setSupplierId(null);
    setStep(0);
  });
  const [product, isLoading] = useGetProduct(id);
  const [dataNotificationUndo,setDataNotificationUndo] = useState({
    open : false,
    description : null
  })
  // useResetAction();
  
  const onUndoForm = (isLast = false) => {
    
    // Action Back One step to set Form And Remove last Recover
    const stepUndo = ((backupForm.length === 1) || isLast) ? 1 : 2;
    
    const preForm = backupForm[backupForm.length - stepUndo];
    form.setFieldsValue(preForm);
    const newRecoverForm = [...backupForm];
    
    newRecoverForm.pop();
    setBackupForm(newRecoverForm);
  }


  const onFinish = (values: FieldTypeFormProduct) => {
    const submitData = convertSubmitData({values,supplierId});
    if (id) {
      onUpdate({ ...submitData, _id: id });
    } else {
      onCreate(submitData);
    }
  };

  const optionsType = useMemo(
    () =>
      keys(PRODUCT_TYPE).map((key) => ({
        label: CLONE_PRODUCT_TYPE_VI[key],
        value: key,
      })),
    []
  );
  const optionsSaleLevel = useMemo(
    () =>
      keys(SALE_LEVEL).map((key) => ({
        label: CLONE_SALE_LEVEL_VI[key],
        value: key,
      })),
    []
  );

  useEffect(() => {
    if (product && id) {
    const initProduct = convertInitProduct(product);
      form.setFieldsValue(initProduct);
      setBackupForm([initProduct]);
    }else{
      setBackupForm([form.getFieldsValue()])
    };
    
  }, [product, id, form]);

  const onValuesChange = (valueChange: any, values: FieldTypeFormProduct) => {
    const key: keyof FieldTypeFormProduct = Object.keys(valueChange)[0] as keyof FieldTypeFormProduct;
    switch (key) {
      case "cumulativeDiscount":
        const cumulativeDiscount = CumulativeDiscountModule.service.onDiscountChange(values[key])
        form.setFieldsValue({
          cumulativeDiscount,
        });
        break;
      default:
        break;
    };
    // Recover Form
    const onSetRecoverForm = () => setBackupForm((pre:FieldTypeFormProduct[]) => [...pre,values]);
    const debounceSetRecover = debounce(onSetRecoverForm,0);
    debounceSetRecover();
  };

  // useEffect(() => {
  //   if(dataNotificationUndo.open && !!dataNotificationUndo.description){
  //     notification.warning({
  //       message : `Hệ thống thông báo`,
  //       description : dataNotificationUndo.description,
  //       duration: 0, // Never Off
  //       btn : <Button size="small" onClick={() => onUndoForm(true)}>
  //         Hoàn tác
  //       </Button>
  //     });
  //     setDataNotificationUndo({
  //       open : false,
  //       description : null
  //     })
  //   }

  // },[dataNotificationUndo]);
  return (
    <div>
      <h5>Tạo mới thuốc</h5>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        scrollToFirstError

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
        <Form.Item<FieldTypeFormProduct> name="medicalCode" hidden />

        <BaseBorderBox title={"Thông tin thuốc"}>
          <Row {...layoutRow}>
            <Col span={12}>
              {RenderLoading(isLoading, <MedicineName form={form} />)}
            </Col>
            <Col span={12}>
              <Form.Item<FieldTypeFormProduct> label="Hình thức" name="type">
                {RenderLoading(isLoading, <Select options={optionsType} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<FieldTypeFormProduct>
                label="Mức độ đẩy hàng"
                name="saleLevel"
              >
                {RenderLoading(
                  isLoading,
                  <Select options={optionsSaleLevel} />
                )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item<FieldTypeFormProduct>
                label="Mã sản phẩm"
                name="codeBySupplier"
                tooltip="Mã dành cho nhà cung cấp"
                rules={[
                  { required: true, message: "Vui lòng nhập mã sản phẩm" },
                ]}
              >
                {RenderLoading(isLoading, <Input />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox title={"Thông tin chung"}>
          <Row {...layoutRow}>
            <Col span={12}>
              <Form.Item<FieldTypeFormProduct>
                label="Quy cách đóng gói"
                name={["productDetail", "package"]}
              >
                {RenderLoading(isLoading, <Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldTypeFormProduct>
                label="Hoạt chất"
                name={["productDetail", "element"]}
              >
                {RenderLoading(isLoading, <Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
              <SelectCountry isLoading={isLoading} />
            </Col>
            <Col span={12}>
              <SelectManufacturer isLoading={isLoading} product={product} />
            </Col>
          </Row>

          <Row {...layoutRow}>
            <Col span={12}>
              <SelectProductGroup product={product} isLoading={isLoading} />
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox title={"Đơn vị"}>
          <Col style={{ paddingBottom: 10 }} span={24}>
            <Variants form={form} isLoading={isLoading} setDataNotificationUndo={setDataNotificationUndo}/>
          </Col>
        </BaseBorderBox>

        <BaseBorderBox
          title={
            <span>
              Chiết khấu <GiftTwoTone />
            </span>
          }
        >
          <CumulativeDiscountModule.components.DiscountList target={CumulativeDiscountModule.constants.TARGET.product} loading={isLoading} form={form} />
        </BaseBorderBox>

        <Row justify={"end"} gutter={16}>
          <Col>
          {/* To preserve backup Keep one To undo to Init */}
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
