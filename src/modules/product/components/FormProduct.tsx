import { Button, Col, Form, Input, Row, Select } from "antd";
import { get, keys } from "lodash";
import React, { useEffect, useMemo } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
import { PRODUCT_TYPE, PRODUCT_TYPE_VI, SALE_LEVEL, SALE_LEVEL_VI } from "../constants";
import {
  useCreateProduct,
  useGetProduct,
  useResetAction,
  useUpdateProduct
} from "../product.hook";
import { cumulativeDiscountType, FieldTypeFormProduct, TypePropsFormProduct } from "../product.modal";
import MedicineName from "./MedicineName";
import SelectCountry from "./SelectCountry";
import SelectManufacturer from "./SelectManufacturer";
import SelectProductGroup from "./SelectProductGroup";
import Variants from "./Variants";
import DiscountList from "./DiscountList";
import { GiftTwoTone } from "@ant-design/icons";
import dayjs from "dayjs";
const CLONE_PRODUCT_TYPE_VI: any = PRODUCT_TYPE_VI;
const CLONE_SALE_LEVEL_VI: any = SALE_LEVEL_VI;
const layoutRow = {
  gutter: 16,
};
export default function FormProduct({
  supplierId,
  id,
  onCancel,
}: TypePropsFormProduct): React.JSX.Element {
  const [form] = Form.useForm();

  const [isSubmitLoading, onCreate] = useCreateProduct(onCancel);
  const [, onUpdate] = useUpdateProduct(onCancel);
  const [product, isLoading] = useGetProduct(id);
  useResetAction();
  const onFinish = (values: FieldTypeFormProduct) => {
    const cumulativeDiscount = values?.cumulativeDiscount?.map((item : cumulativeDiscountType) => {
      const applyTimeSheet = get(item,'applyTimeSheet');
      return {
        ...item,
        applyTimeSheet : {
          ...applyTimeSheet,
          gte : dayjs.isDayjs(get(applyTimeSheet,'gte')) ? dayjs(get(applyTimeSheet,'gte')).format("YYYY-MM-DD") : null,
          lte : dayjs.isDayjs(get(applyTimeSheet,'lte')) ? dayjs(get(applyTimeSheet,'lte')).format("YYYY-MM-DD") : null,
        }
      }
    });
    const submitData = {
      ...values,
      cumulativeDiscount,
      supplierId,
    };
    console.log(submitData, "submitData");
    // if (id) {
    //   onUpdate({ ...submitData, _id: id });
    // } else {
    //   onCreate(submitData);
    // }
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
      form.setFieldsValue(product);
    }
  }, [product, id, form]);

  const onValuesChange = (value : any,values : FieldTypeFormProduct) => {
    const key = Object.keys(value)[0];
    switch (key) {
      case 'cumulativeDiscount':
        const newCumulativeDiscount = values[key]?.map((item : any) => {
          const condition = get(item,'condition');
          return {
            ...item,
            condition : {...condition,isRanger : get(condition,'lte') > 0},
          }
        });
        form.setFieldsValue({
          cumulativeDiscount : newCumulativeDiscount
        })
        break;
    
      default:
        break;
    }
    
    
  }
  return (
    <div>
      <h5>Tạo mới thuốc</h5>
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
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
              <Form.Item<FieldTypeFormProduct>
                label="Hình thức"
                name="type"
              >
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
                {RenderLoading(isLoading, <Select options={optionsSaleLevel} />)}
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
            <SelectCountry isLoading={isLoading}/>
            </Col>
            <Col span={12}>
            <SelectManufacturer isLoading={isLoading} product={product}/>
            </Col>
          </Row>

          <Row {...layoutRow}>
          
            <Col span={12}>
              <SelectProductGroup product={product} isLoading={isLoading}/>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox title={"Đơn vị"}>
          <Col style={{paddingBottom : 10}} span={24}>
            <Variants form={form} isLoading={isLoading} />
          </Col>
        </BaseBorderBox>

        <BaseBorderBox title={<span>Chiết khấu <GiftTwoTone /></span>}>
            <DiscountList product={product} loading={isLoading} form={form}/>

        </BaseBorderBox>

        <Row justify={"end"} gutter={16}>
          <Col>
            <Button size="large" onClick={onCancel}>
              Huỷ
            </Button>
          </Col>
          <Col>
            <Button
              size="large"
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
