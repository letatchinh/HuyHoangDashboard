import { Button, Form, Input, Row } from "antd";
import React, { useEffect, useMemo } from "react";
import SelectWarehouse from "./SelectWarehouse";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import SelectArea from "./SelectArea";
import { PlusOutlined } from "@ant-design/icons";
import "../warehouse.style.scss";
import {
  convertDataByManagementArea,
  useGetWarehouse,
  useGetWarehouseByBranchLinked,
  useInitWarehouse,
  useResetAction,
  useUpdateManagementWarehouse,
} from "../warehouse.hook";
import { useGetProfile } from "~/modules/auth/auth.hook";
import { get } from "lodash";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
type propsType = {};

export default function SelectDefaultWarehouse(
  props: propsType
): React.JSX.Element {
  const [form] = Form.useForm();
  const profile = useGetProfile();
  useResetAction();
  const [isLoadingSubmit, updateManagementWarehouse] = useUpdateManagementWarehouse();
  const [warehouseDefault, isLoading] = useGetWarehouse();
  const InitValue = useInitWarehouse(warehouseDefault);

  const [listWarehouse, isLoadingWarehouse]= useGetWarehouseByBranchLinked();
  const options = useMemo(
    () =>
      listWarehouse ?  (listWarehouse || [])?.map((item: any) => ({
        label: get(item, "name.vi") || get(item, "name"),
        value: get(item, "_id"),
      })): [],
    [listWarehouse]
  );

  useEffect(() => {
    if (InitValue) form.setFieldsValue(InitValue);
  }, [InitValue]);
  const onFinish = (values: any) => {
    const submitData = convertDataByManagementArea(values);
    updateManagementWarehouse({
      warehouses: [
        ...submitData,
      ],
      branchId: profile?.profile?.branchId,
    }
    );
    try {
    } catch (error) {
      console.log(error);
    }
  };
  const onValueChange = (changedValues: any, allValues: any) => { };
  
  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={onValueChange}
        style={{ width: "100%" }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        autoComplete="off"
      >
        <Breadcrumb title={"Cấu hình kho mặc định theo khu vực"} />
        <WhiteBox style={{ overflowY: "hidden" }}>
          <Form.List name={"warehouses"}>
            {(fields, { add, remove }) => (
              <div className="warehouse-wrapper">
                {fields.map(({ name, key }: any, index) => {
                  return (
                    <BaseBorderBox title={`Khu vực ${index + 1}`} key={key}>
                      <WithPermission permission={POLICIES.UPDATE_CONFIGWAREHOUSE}>
                      <Row className="mb-1" justify={"end"}>
                        <Button
                          type="primary"
                          danger
                          loading={isLoadingSubmit}
                          onClick={() => remove(index)}
                        >
                          Xoá
                        </Button>
                      </Row>
                      </WithPermission>
                      <SelectArea form={form} index={index} name={name} isLoading={isLoading} />
                      <SelectWarehouse options={options || []} index={index} name={name}  isLoading={isLoading} isLoadingWarehouse={isLoadingWarehouse}/>
                    </BaseBorderBox>
                  );
                })}
                <WithPermission permission={POLICIES.UPDATE_CONFIGWAREHOUSE}>
                <Form.Item>
                  <Row>
                    <Button
                      type="dashed"
                      onClick={() => add({})}
                      style={{
                        width: "100%",
                        margin: "auto",
                      }}
                      icon={<PlusOutlined />}
                    >
                      Thêm khu vực
                    </Button>
                  </Row>
                </Form.Item>
              </WithPermission>
              </div>
            )}
          </Form.List>
          <WithPermission permission={POLICIES.UPDATE_CONFIGWAREHOUSE}>
          <Row justify={"end"} className="mt-3">
            <Button loading={ isLoading || (warehouseDefault?.length > 0 && isLoadingSubmit)} type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Row>
          </WithPermission>
        </WhiteBox>
      </Form>
    </>
  );
}
