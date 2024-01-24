import { Col, Flex, Form, Row, Select } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import PharmacyModule from "~/modules/pharmacy";
import useNotificationStore from "~/store/NotificationContext";
import { FormFieldCreateBill } from "../bill.modal";
import DebounceSelect from "~/components/common/DebounceSelect";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
type propsType = {
  form? : any,
  onChange? : (p:any) => void,
  allowClear? : boolean
};
type ItemSearch = {
  name: string;
  value: string;
};
export default function SelectPharmacy({form,onChange = () => {},allowClear = true}: propsType): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const [loading,setLoading] = useState(false);
  const [initOption,setInitOption] = useState([]);
  const fetchOptions : any = async (keyword : string) => {
    try {
      const pharmacies = await PharmacyModule.api.search({
        keyword,
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
        id : form.getFieldValue("pharmacyId"),
        keyword : ''
      });
      const newOptions = get(pharmacies,'docs',[])?.map((item: ItemSearch) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
      }));
      setInitOption(newOptions);
      setLoading(false);
      await form.validateFields(['pharmacyId']);
    
    } catch (error) {
      setLoading(false);
    }
    };
    fetchInit();

  },[]);
  return (
    <Row gutter={8}>
      <UserOutlined />
      <Col flex={1}>
      <Form.Item<FormFieldCreateBill>
      name={"pharmacyId"}
      rules={[
        {
          required: true,
          message: "Vui lòng chọn nhà thuốc",
        },
      ]}
      colon={false}
      style={{marginBottom: 'unset'}}
    >
      <DebounceSelect
      size="large"
        loading={loading}
        placeholder="Chọn nhà thuốc"
        fetchOptions={fetchOptions}
        style={{ width: "100%" }}
        initOptions={initOption}
        allowClear={allowClear}
        {...onChange && {onChange : (value : any) => onChange(value)}}

      />
    </Form.Item>
      </Col>
    </Row>
  );
}
