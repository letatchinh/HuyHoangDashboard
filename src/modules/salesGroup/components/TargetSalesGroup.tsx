import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form, Modal, Row,
  Select,
  Tooltip
} from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo } from "react";
import EmptyData from "~/components/Antd/EmptyData";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import { requireRules } from "~/constants/defaultValue";
import apis from "~/modules/supplier/supplier.api";
import { useFetchState } from "~/utils/helpers";
import { useGetSalesGroup } from "../salesGroup.hook";
import useSalesGroupStore from "../salesGroupContext";
import { HookAPI } from "antd/es/modal/useModal";
type propsType = {
  _id: string;
};
type FormFieldType = {
  _id: string;
};
export default function TargetSalesGroup({
  _id,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { isSubmitLoading, updateSalesGroup, canUpdate } = useSalesGroupStore();
  const [salesGroup, loading] = useGetSalesGroup(_id);
  const [suppliers, isLoading] = useFetchState({
    api: apis.getAllPublic,
    useDocs: false,
  });
  const targetSupplier = Form.useWatch("targetSupplier", form);

  const options = useMemo(
    () =>
      suppliers?.map((item: any) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
        disabled: targetSupplier?.some(
          (target: any) => get(target, "supplierId") === get(item, "_id")
        ),
      })),
    [suppliers, targetSupplier]
  );

  const onFinish = (values: FormFieldType) => {
    Object.assign(values, {
      callback() {
      Modal.destroyAll()
    }})
    updateSalesGroup(values);
  };

  useEffect(() => {
    form.setFieldsValue({
      _id,
      targetSupplier: get(salesGroup, "targetSupplier", []),
    });
  }, [_id, form, salesGroup]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Divider>Chỉ tiêu</Divider>
      {!targetSupplier?.length ? (
        <EmptyData
          type="secondary"
          mess="Chưa có chỉ tiêu hãy thêm mới một nhà cung cấp"
        />
      ) : null}
      <Form
        onFinish={onFinish}
        form={form}
        labelAlign="left"
        className="form-custom"
        labelCol={{span : 8}}
      >
        <Form.Item hidden name={"_id"} />
        <Form.List name={"targetSupplier"}>
          {(fields, { add, remove }) => (
            <Flex vertical align={"center"} gap={20}>
              <Flex className="scrollList" vertical align={"center"}>
                {fields.map(({ name, ...field }) => (
                  <BaseBorderBox style={{ width: "100%" }} title={<Form.Item
                    {...field}
                    label="Nhà cung cấp"
                    name={[name, "supplierId"]}
                    rules={requireRules}
                    style={{width : 500}}
                  >
                    <Select
                      popupMatchSelectWidth={false}
                      loading={isLoading}
                      options={options}
                      style={{width : '100%'}}
                    />
                  </Form.Item>}>
                    <Row style={{ width: "100%" }} gutter={8}>
                      <Col span={7}>
                        <Form.Item
                          {...field}
                          label="Chỉ tiêu tối thiểu"
                          name={[name, "minSale"]}
                          tooltip="Doanh số tối thiểu của từng nhân viên trong nhóm"
                          // rules={requireRules}
                        >
                          <InputNumberAnt
                            step={500000}
                            min={0}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item
                          {...field}
                          label="Khoán cá nhân"
                          name={[name, "mineralSale"]}
                          tooltip="Khoán cá nhân của từng nhân viên trong nhóm"
                          // rules={requireRules}
                        >
                          <InputNumberAnt
                            step={500000}
                            min={0}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                          <Form.Item
                            {...field}
                            label="Chỉ tiêu nhóm"
                            name={[name, "targetTeam"]}
                            tooltip="Doanh số khoán của trưởng nhóm, dùng để tính thưởng đội nhóm"
                            // rules={requireRules}
                          >
                            <InputNumberAnt
                              step={500000}
                              min={0}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                      </Col>
                      <Col span={1}>
                        <Tooltip title="Xoá">
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Tooltip>
                      </Col>
                      <Col span={7}>
                          <Form.Item
                            {...field}
                            label="Chỉ tiêu quý"
                            name={[name, "targetQuarter"]}
                            tooltip="Chỉ tiêu quý của tửng nhân viên trong nhóm"
                            // rules={requireRules}
                          >
                            <InputNumberAnt
                              step={500000}
                              min={0}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                      </Col>
                      <Col span={7}>
                          <Form.Item
                            {...field}
                            label="Chỉ tiêu năm"
                            name={[name, "targetYear"]}
                            tooltip="Chỉ tiêu năm của tửng nhân viên trong nhóm"
                            // rules={requireRules}
                          >
                            <InputNumberAnt
                              step={500000}
                              min={0}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                      </Col>
                    </Row>
                    <Divider />
                  </BaseBorderBox>
                ))}
              </Flex>
            {canUpdate &&  <Button
                style={{ width: 200 }}
                icon={<PlusCircleOutlined />}
                onClick={() => add()}
              >
                Thêm nhà cung cấp
              </Button>}
            </Flex>
          )}
        </Form.List>
      {canUpdate &&  <Flex justify={"end"}>
          <Button loading={isSubmitLoading} type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Flex>}
      </Form>
    </div>
  );
}
