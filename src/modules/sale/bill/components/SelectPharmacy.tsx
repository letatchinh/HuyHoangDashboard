import { UserOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import { SelectProps } from "antd/lib/index";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import DebounceSelect from "~/components/common/DebounceSelect";
import PharmacyModule from "~/modules/pharmacy";
import useNotificationStore from "~/store/NotificationContext";
import { FormFieldCreateBill } from "../bill.modal";
interface propsType extends SelectProps {
  form?: any;
  onChange?: (p: any) => void;
  allowClear?: boolean;
  showIcon?: boolean;
  validateFirst?: boolean;
  label?: string;
  id? : string,
};
type ItemSearch = {
  name: string;
  value: string;
};
export default function SelectPharmacy({
  form,
  onChange = () => {},
  allowClear = true,
  showIcon = true,
  validateFirst = true,
  label = "",
  id,
  ...props
}: propsType): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const [loading,setLoading] = useState(false);
  const [initOption,setInitOption] = useState([]);
  const fetchOptions : any = async (keyword : string) => {
    try {
      const pharmacies = await PharmacyModule.api.search({
        keyword : keyword || "",
      });
      const newOptions = get(pharmacies,'docs',[])?.map((item: ItemSearch) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
      }));
      
      return newOptions;
    } catch (error: any) {
      onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra");
    }
  };
  
  useEffect(() => {
    const fetchInit = async() => {
      
    try {
      setLoading(true);
      const pharmacies = await PharmacyModule.api.search({
        ...id && {id},
        keyword : ''
      });
      
      const newOptions = get(pharmacies,'docs',[])?.map((item: ItemSearch) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
      }));
      
      setInitOption(newOptions);
      setLoading(false);
      if(validateFirst){
        await form.validateFields(['pharmacyId']);
      }
    
    } catch (error) {
      setLoading(false);
    }
    };
      fetchInit();

  },[]);
  
  return (
    <Row gutter={8}  >
      {showIcon && <UserOutlined />}
      <Col flex={1}>
        <Form.Item<FormFieldCreateBill>
          name={"pharmacyId"}
          label={label}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn nhà thuốc",
            },
          ]}
          colon={false}
          style={{ marginBottom: "unset" }}
          wrapperCol={{ sm: 24 }}
        >
          <DebounceSelect
            size="large"
            loading={loading}
            placeholder="Chọn nhà thuốc"
            fetchOptions={fetchOptions}
            style={{ width: "100%" }}
            initOptions={initOption}
            allowClear={allowClear}
            {...(onChange && { onChange: (value: any) => onChange(value) })}
            {...props}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
