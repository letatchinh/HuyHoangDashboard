import { Button, Flex, Form, InputNumber } from "antd";
import FormItem from "antd/es/form/FormItem/index";
import { useCallback, useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import RenderLoading from "~/components/common/RenderLoading";
import WhiteBox from "~/components/common/WhiteBox";
import { AREA, requireRules } from "~/constants/defaultValue";
import { CRONJOB_REPORT_SALARY } from "../constants";
import {
  useCronSalaryQueryParams,
  useGetCronSalarys,
  useResetAction,
  useUpdateCronSalary,
} from "../cronSalary.hook";
import { FormField } from "../cronSalary.modal";

export default function CronSalary() {
  const [form] = Form.useForm();
  useResetAction();
  // Hook
  const [query] = useCronSalaryQueryParams();
  const [data, isLoading] = useGetCronSalarys(query);
  
  const [isSubmitLoading, updateCronSalary]: any = useUpdateCronSalary();

  // Update Data
  const onFinish = useCallback((values: FormField) => {
    updateCronSalary(values);
  }, []);

  useEffect(() => {
    // Initialized Data
    form.setFieldsValue({ ...data});
  }, [data]);

  return (
    <div>
      <Breadcrumb title={"Cấu hình thời gian thực thi báo cáo lương"} />
      <WhiteBox>
        {RenderLoading(
          isLoading,
          <Form labelCol={{span : 5}} labelAlign='left' onFinish={onFinish} form={form} initialValues={{key : CRONJOB_REPORT_SALARY}}>
            <Form.Item<FormField> hidden name={'key'}/>
            <Flex vertical gap={10} >
              <FormItem<FormField>
                label='Ngày thực thi'
                className="mb-0"
                name={["cronTimeReportSalary", 'startTime']}
                rules={requireRules}
              >
                <InputNumberAnt
                  style={{ width: 180 }}
                  min={1}
                  max={31}
                />
              </FormItem>
              <FormItem<FormField>
                className="mb-0"
                name={["cronTimeReportSalary", 'sizeAction']}
                rules={requireRules}
                tooltip="Số lượng báo cáo tạo ra đồng thời, Số lượng báo cáo còn lại sẽ chạy vào 1 giờ sau"
                label="Số lượng thực thi đồng thời"
              >
                <InputNumberAnt
                  style={{ width: 180 }}
                  min={1}
                />
              </FormItem>
              <Button style={{width : 150}} loading={isSubmitLoading} htmlType="submit" type="primary">
              Cập nhật
            </Button>
            </Flex>
            
          </Form>
        )}
      </WhiteBox>
    </div>
  );
}
