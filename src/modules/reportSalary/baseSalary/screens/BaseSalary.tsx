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

export default function BaseSalary() {
  const [form] = Form.useForm();

  // Hook
  const [query] = useBaseSalaryQueryParams();
  const [data, isLoading] = useGetBaseSalarys(query);
  const [isSubmitLoading, updateBaseSalary]: any = useUpdateBaseSalary();

  // Update Data
  const onFinish = useCallback((values: typeFormField) => {
    updateBaseSalary(values);
  }, []);

  useEffect(() => {
    // Initialized Data
    form.setFieldsValue({ ...data});
  }, [data]);

  return (
    <div>
      <Breadcrumb title={"Cấu hình vùng"} />
      <WhiteBox>
        {RenderLoading(
          isLoading,
          <Form onFinish={onFinish} form={form}>
            <Flex gap={10} align="center">
              <h6 style={{ width: "15%" }}>Lương cơ bản vùng: </h6>
              <FormItem
                className="mb-0"
                name={["baseSalary", AREA.V_I]}
                rules={requireRules}
              >
                <InputNumberAnt
                  style={{ width: 180 }}
                  addonAfter={<span>Vùng 1</span>}
                  min={0}
                />
              </FormItem>
              <FormItem
                className="mb-0"
                name={["baseSalary", AREA.V_II]}
                rules={requireRules}
              >
                <InputNumberAnt
                  style={{ width: 180 }}
                  addonAfter={<span>Vùng 2</span>}
                  min={0}
                />
              </FormItem>
              <FormItem
                className="mb-0"
                name={["baseSalary", AREA.V_III]}
                rules={requireRules}
                
              >
                <InputNumberAnt
                  style={{ width: 180 }}
                  addonAfter={<span>Vùng 3</span>}
                  min={0}
                />
              </FormItem>
              <FormItem
                className="mb-0"
                name={["baseSalary", AREA.V_IV]}
                rules={requireRules}
              >
                <InputNumberAnt
                  style={{ width: 180 }}
                  addonAfter={<span>Vùng 4</span>}
                  min={0}
                />
              </FormItem>
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
                <InputNumberAnt  min={0}/>
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
                <InputNumber min={0} max={100} addonAfter={"%"}/>
              </FormItem>
            </Flex>
            <Button loading={isSubmitLoading} htmlType="submit" type="primary">
              Cập nhật
            </Button>
          </Form>
        )}
      </WhiteBox>
    </div>
  );
}
