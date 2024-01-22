import { CloseSquareOutlined, MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, Popconfirm, Row, Select } from "antd";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import RenderLoading from "~/components/common/RenderLoading";
import { TypePropVariants } from "../product.modal";
import UnitModule from "~/modules/productUnit";
import { useFetchState } from "~/utils/hook";
import { filterSelectWithLabel } from "~/utils/helpers";
export default function Variants({
  form,
  isLoading : loading,
}: TypePropVariants): React.JSX.Element {
  const [reFetch,setReFetch] = useState(false);
  const [units, isLoading] = useFetchState({api : UnitModule.api.getAllPublic,useDocs : false,reFetch});
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
                <Row className="mb-2" gutter={8} key={key} align="middle">
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Đơn vị cơ bản"}
                      name={[name, "productUnit"]}
                      rules={[
                        {
                          required: true,
                          message: "Xin vui lòng chọn!",
                        },
                      ]}
                    >
                      {RenderLoading(loading,<Select
                        options={units?.filter((item:any) => !isUsed(form.getFieldValue(['variants',name,'productUnit']),get(item,'_id')))?.map((item: any) => ({
                          label: get(item, "name"),
                          value: get(item, "_id"),
                        }))}
                        showSearch
                        filterOption={filterSelectWithLabel}
                      />)}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Giá bán"}
                      name={[name, "price"]}
                      rules={[
                        {
                          required: true,
                          message: "Xin vui lòng nhập!",
                        },
                      ]}
                    >
                      {RenderLoading(loading,<InputNumberAnt min={0} />)}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Giá nhập"}
                      name={[name, "cost"]}
                    >
                      {RenderLoading(loading,<InputNumberAnt min={0} />)}
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <Row className="mb-2" gutter={8} key={key} align="middle">
                  <Col span={6}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Đơn vị"}
                      name={[name, "productUnit"]}
                      rules={[
                        {
                          required: true,
                          message: "Xin vui lòng chọn!",
                        },
                      ]}
                    >
                        {RenderLoading(loading,<Select
                        options={units?.filter((item:any) => !isUsed(form.getFieldValue(['variants',name,'productUnit']),get(item,'_id')))?.map((item: any) => ({
                          label: get(item, "name"),
                          value: get(item, "_id"),
                        }))}
                      />)}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Giá bán"}
                      name={[name, "price"]}
                      rules={[
                        {
                          required: true,
                          message: "Xin vui lòng nhập!",
                        },
                      ]}
                    >
                      {RenderLoading(loading,<InputNumberAnt min={0} />)}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Giá nhập"}
                      name={[name, "cost"]}
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
                      rules={[
                        {
                          required: true,
                          message: "Xin vui lòng nhập!",
                        },
                      ]}
                    >
                      {RenderLoading(loading,<InputNumberAnt min={0} />)}
                    </Form.Item>
                  </Col>

                  <Col span={1}>
                    <Popconfirm
                      title="Bạn muốn xoá đơn vị này?"
                      onConfirm={() => remove(name)}
                      okText="Xoá"
                      cancelText="Huỷ"
                    >
                      <CloseSquareOutlined
                        style={{ fontSize: 18, color: "red" }}
                      />
                    </Popconfirm>
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
