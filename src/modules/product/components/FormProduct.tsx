import { Button, Col, Form, Input, Row, Select } from "antd";
import { get, keys } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
import { MAX_LIMIT } from "~/constants/defaultValue";
import ManufacturerModule from "~/modules/manufacturer";
import ProductConfigModule from "~/modules/productGroup";
import { getActive } from "~/utils/helpers";
import { PRODUCT_TYPE, PRODUCT_TYPE_VI } from "../constants";
import {
  useCreateProduct,
  useGetProduct,
  useResetAction,
  useUpdateProduct
} from "../product.hook";
import { FieldTypeFormProduct, TypePropsFormProduct } from "../product.modal";
import MedicineName from "./MedicineName";
import SelectCountry from "./SelectCountry";
import SelectManufacturer from "./SelectManufacturer";
import SelectProductGroup from "./SelectProductGroup";
import Variants from "./Variants";
const CLONE_PRODUCT_TYPE_VI: any = PRODUCT_TYPE_VI;
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
    const submitData = {
      ...values,
      supplierId,
    };
    console.log(submitData, "submitData");

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

  const fetchOptionsManufacturer = useCallback(async (keyword?: string) => {
    const res = await ManufacturerModule.api.getAll({
      keyword,
      limit: MAX_LIMIT,
    });
    return getActive(get(res, "docs", []))?.map((item: any) => ({
      label: get(item, "name"),
      value: get(item, "_id"),
    }));
  }, []);

  const initManufacturer = useMemo(
    () =>
      product && [
        {
          label: get(product, "manufacturer.name"),
          value: get(product, "manufacturerId"),
        },
      ],
    [product]
  );

  const fetchOptionsProductConfig = useCallback(async (keyword?: string) => {
    const res = await ProductConfigModule.api.getAll({
      keyword,
      limit: MAX_LIMIT,
    });
    return getActive(get(res, "docs", []))?.map((item: any) => ({
      label: get(item, "name"),
      value: get(item, "_id"),
    }));
  }, []);

  console.log(product, "product");

  const initProductConfig = useMemo(
    () =>
      product && [
        {
          label: get(product, "productGroup.name"),
          value: get(product, "productGroupId"),
        },
      ],
    [product]
  );
  // const fetchOptionsCountry = useCallback(async () => {
  //   const res = await api.country.getAll();
  //   return res?.map((item: any) => ({
  //     label: get(item, "name", "")?.trim(),
  //     value: get(item, "_id"),
  //   }));
  // }, []);

  // const initCountry = useMemo(
  //   () =>
  //     product && [
  //       {
  //         label: get(product, "productDetail.country._id"),
  //         value: get(product, "productDetail.country.name"),
  //       },
  //     ],
  //   [product]
  // );
  useEffect(() => {
    if (product && id) {
      form.setFieldsValue(product);
    }
  }, [product, id, form]);

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
          type: PRODUCT_TYPE.exclusive,
          variants: [
            {
              exchangeValue: 1,
              variantIsDefault: true,
            },
          ],
        }}
      >
        <Form.Item<FieldTypeFormProduct> name="medicalCode" hidden />

        <BaseBorderBox title={"Thông tin thuốc"}>
          <Row {...layoutRow}>
            <Col span={12}>
              {RenderLoading(isLoading, <MedicineName form={form} />)}
            </Col>
            <Col span={12}>
              <Form.Item<FieldTypeFormProduct>
                label="Loại sản phẩm"
                name="type"
                rules={[
                  { required: true, message: "Vui lòng chọn loại sản phẩm!" },
                ]}
              >
                {RenderLoading(isLoading, <Select options={optionsType} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
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
                rules={[
                  { required: true, message: "Vui lòng nhập cách đóng gói!" },
                ]}
              >
                {RenderLoading(isLoading, <Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldTypeFormProduct>
                label="Hoạt chất"
                name={["productDetail", "element"]}
                rules={[
                  { required: true, message: "Vui lòng nhập hoạt chất!" },
                ]}
              >
                {RenderLoading(isLoading, <Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row {...layoutRow}>
            <Col span={12}>
            <SelectCountry isLoading={isLoading}/>
            </Col>
          </Row>

          <Row {...layoutRow}>
            <Col span={12}>
            <SelectManufacturer isLoading={isLoading} product={product}/>
            </Col>
            <Col span={12}>
              <SelectProductGroup product={product} isLoading={isLoading}/>
            </Col>
          </Row>
        </BaseBorderBox>

        <BaseBorderBox title={"Đơn vị"}>
          <Col span={24}>
            <Variants form={form} isLoading={isLoading} />
          </Col>
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
