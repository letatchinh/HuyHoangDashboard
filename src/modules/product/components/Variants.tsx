import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Row, Select } from "antd";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import RenderLoading from "~/components/common/RenderLoading";
import { TypePropVariants } from "../product.modal";
import UnitModule from "~/modules/productUnit";
export default function Variants({
  form,
  isLoading : loading,
}: TypePropVariants): React.JSX.Element {
  const [reFetch,setReFetch] = useState(false);
  const [units, isLoading] = UnitModule.hook.useGetListProductUnitNoParam(reFetch);
  const variants = Form.useWatch("variants", form);
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onCreateSuccess = useCallback(() => {
    setReFetch(!reFetch);
    onClose();
  },[reFetch]);
  const isUsed = (cur : string,unitId:String) => (unitId !== cur) && (variants?.some((variant:any) => get(variant,'productUnit') === unitId))
  return (
  <>
    <Form.List name={"variants"}>
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }: any, index) =>
              index === 0 ? (
                <Row className="mb-2" gutter={48} key={key} align="middle">
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Đơn vị cơ bản"}
                      name={[name, "productUnit"]}
                    >
                      {RenderLoading(loading,<Select
                        options={units?.filter((item:any) => !isUsed(form.getFieldValue(['variants',name,'productUnit']),get(item,'_id')))?.map((item: any) => ({
                          label: get(item, "name"),
                          value: get(item, "_id"),
                        }))}
                      />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Giá bán"}
                      name={[name, "price"]}
                    >
                      {RenderLoading(loading,<InputNumberAnt min={0} />)}
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <Row className="mb-2" gutter={48} key={key} align="middle">
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Đơn vị"}
                      name={[name, "productUnit"]}
                    >
                        {RenderLoading(loading,<Select
                        options={units?.filter((item:any) => !isUsed(form.getFieldValue(['variants',name,'productUnit']),get(item,'_id')))?.map((item: any) => ({
                          label: get(item, "name"),
                          value: get(item, "_id"),
                        }))}
                      />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Giá bán"}
                      name={[name, "price"]}
                    >
                      {RenderLoading(loading,<InputNumberAnt min={0} />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Giá trị quy đổi"}
                      name={[name, "exchangeValue"]}
                    >
                      {RenderLoading(loading,<InputNumberAnt min={0} />)}
                    </Form.Item>
                  </Col>

                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              )
            )}
            <Button
              onClick={() =>
                add({
                  variantIsDefault: false,
                })
              }
              icon={<PlusCircleOutlined />}
            >
              Thêm đơn vị
            </Button>
            <Button onClick={onOpen}>
              +
            </Button>
          </>
        );
      }}
    </Form.List>
    <Modal destroyOnClose open={open} onCancel={onClose} footer={null}>
        <UnitModule.page.form callBack={onCreateSuccess} updateProductUnit={() => {}}/>
      </Modal>
  </>
  );
}
