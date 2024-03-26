import { Button, Flex, Form, InputNumber } from "antd";
import FormItem from "antd/es/form/FormItem/index";
import { useCallback, useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import RenderLoading from "~/components/common/RenderLoading";
import WhiteBox from "~/components/common/WhiteBox";
import { AREA, requireRules } from "~/constants/defaultValue";
import {
  useBaseSalaryQueryParams,
  useGetBaseSalarys,
  useUpdateBaseSalary,
} from "../baseSalary.hook";
import { typeFormField } from "../baseSalary.modal";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";

export default function BaseSalary() {
  const [form] = Form.useForm();

  // Hook
  const [query] = useBaseSalaryQueryParams();
  const [data, isLoading] = useGetBaseSalarys(query);
  const [isSubmitLoading, updateBaseSalary]: any = useUpdateBaseSalary();
  //permission
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_CONFIGBASESALARY);

  // Update Data
  const onFinish = useCallback((values: typeFormField) => {
    updateBaseSalary(values);
  }, []);

  useEffect(() => {
    // Initialized Data
    form.setFieldsValue({ ...data});
  }, [data]);

  const isCheckRender = (component: any, key: any) => {
    const objectKey = Object.keys(data?.baseSalary)?.includes(key);
    return objectKey ? component : null
  }

  return (
    <div>
      <Breadcrumb title={"Cấu hình vùng"} />
      <WhiteBox>
        {RenderLoading(
          isLoading,
          <Form onFinish={onFinish} form={form}>
            <Flex gap={10} align="center">
              <h6 style={{ width: "15%" }}>Lương cơ bản vùng: </h6>
              {
                isCheckRender(
                  <FormItem
                  className="mb-0"
                  name={["baseSalary", AREA.V_I]}
                  rules={requireRules}
                >
                  <InputNumberAnt
                    style={{ width: 180 }}
                    addonAfter={<span>Vùng 1</span>}
                    min={0}
                    readOnly = {!canUpdate}
                  />
                  </FormItem>,
                  AREA.V_I
                )
              }
              {
                isCheckRender(
                  <FormItem
                  className="mb-0"
                  name={["baseSalary", AREA.V_II]}
                  rules={requireRules}
                >
                  <InputNumberAnt
                    style={{ width: 180 }}
                    addonAfter={<span>Vùng 2</span>}
                    min={0}
                    readOnly = {!canUpdate}
                  />
                  </FormItem>,
                  AREA.V_II
                )
              }
              {
                isCheckRender(
                  <FormItem
                  className="mb-0"
                  name={["baseSalary", AREA.V_III]}
                  rules={requireRules}
                >
                  <InputNumberAnt
                    style={{ width: 180 }}
                    addonAfter={<span>Vùng 3</span>}
                    min={0}
                    readOnly = {!canUpdate}
                  />
                  </FormItem>,
                  AREA.V_III
                )
              }
              {
                isCheckRender(
                  <FormItem
                  className="mb-0"
                  name={["baseSalary", AREA.V_IV]}
                  rules={requireRules}
                >
                  <InputNumberAnt
                    style={{ width: 180 }}
                    addonAfter={<span>Vùng 4</span>}
                    min={0}
                    readOnly = {!canUpdate}
                  />
                  </FormItem>,
                  AREA.V_IV
                )
              }
            </Flex>
            <Flex align={"center"} gap={10} className="mt-1">
              <h6 style={{ width: "15%" }} className="mt-2">
                Lương quản lý vùng:{" "}
              </h6>
              <FormItem
                className="mb-0"
                name={"baseSalaryASM"}
                rules={requireRules}
              >
                <InputNumberAnt
                  min={0}
                  readOnly = {!canUpdate}
                  />
              </FormItem>
            </Flex>
            <Flex align={"center"} gap={10} className="mt-1">
              <h6 style={{ width: "15%" }} className="mt-2">
              Điều kiện hưởng lương cơ bản ASM:{" "}
              </h6>
              <FormItem
                className="mb-0"
                name={"baseConditionSalaryASM"}
                rules={requireRules}
              >
                <InputNumber min={0} max={100} addonAfter={"%"} readOnly = {!canUpdate}/>
              </FormItem>
            </Flex>
            {canUpdate &&
              <Button loading={isSubmitLoading} htmlType="submit" type="primary">
              Cập nhật
              </Button>
            }
          </Form>
        )}
      </WhiteBox>
    </div>
  );
}
