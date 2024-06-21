import { UserOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import { SelectProps } from "antd/lib/index";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import DebounceSelect from "~/components/common/DebounceSelect";
import PharmacyModule from "~/modules/pharmacy";
import useNotificationStore from "~/store/NotificationContext";
import { FormFieldCreateBill } from "../bill.modal";
import { useLocation } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
interface propsType extends SelectProps {
  form?: any;
  allowClear?: boolean;
  showIcon?: boolean;
  validateFirst?: boolean;
  required?: boolean;
  label?: string;
  id? : string,
};
type ItemSearch = {
  name: string;
  value: string;
};
export default function SelectPharmacy({
  form,
  allowClear = true,
  showIcon = true,
  validateFirst = true,
  required = true,
  label = "",
  id,
  ...props
}: propsType): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const [loading,setLoading] = useState(false);
  const [initOption, setInitOption] = useState([]);
  const { pathname } = useLocation();
  
  const filterOption : any= (data: any[]) => {
    if (pathname === PATH_APP.bill.createCollaborator) {
      return data?.filter((item) => item?.type === 'ctv')
    };
    if (pathname === PATH_APP.bill.createEmployee || pathname === PATH_APP.bill.createPharmacy) {
      return data?.filter((item) => item?.type === "pharmacy")
    };
    return data
  };

  const typeData = useMemo(() => {
    if (pathname === PATH_APP.bill.createCollaborator) { 
      return "ctv"
    };
    if (pathname === PATH_APP.bill.createEmployee || pathname === PATH_APP.bill.createPharmacy) {
      return "pharmacy"
    };
    return null;
  }, [id, pathname]);
  
  const isSentOptionWith : boolean= useMemo(() => {
    if ((pathname === PATH_APP.bill.createCollaborator || pathname === PATH_APP.bill.createEmployee
      || pathname === PATH_APP.bill.createPharmacy || pathname === PATH_APP.bill.create ) && !id) {
      return false
    };
    return true;
  },[id,pathname]);

  const fetchOptions : any = async (keyword : string) => {
    try {
      const pharmacies = await PharmacyModule.api.search({
        ...id && !keyword && {id},
        ...isSentOptionWith && {optionWith: { id: [id] }},
        keyword: keyword || "",
        type: typeData
      });
      const newOptions = filterOption(get(pharmacies,'docs',[]))?.map((item: ItemSearch) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
        data : item
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
        // ...id && {id},
       ...isSentOptionWith && {optionWith: { id: [id] }},
        type:typeData
      });
      
      const newOptions = filterOption(get(pharmacies,'docs',[]))?.map((item: ItemSearch) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
        data : item
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

  },[pathname]);
  
  return (
    <Row gutter={8}  >
      {showIcon && <UserOutlined />}
      <Col flex={1}>
        <Form.Item<FormFieldCreateBill>
          name={"pharmacyId"}
          label={label}
          rules={[
            {
              required: required,
              message: typeData === "ctv" ? "Vui lòng chọn khách hàng B2C" : "Vui lòng chọn nhà thuốc",
            },
          ]}
          colon={false}
          style={{ marginBottom: "unset" }}
          wrapperCol={{ sm: 24 }}
        >
          <DebounceSelect
            size="large"
            loading={loading}
            placeholder= {typeData === "ctv" ? "Chọn khách hàng B2C" : "Chọn nhà thuốc"}
            fetchOptions={fetchOptions}
            style={{ width: "100%" }}
            initOptions={initOption}
            allowClear={allowClear}
            {...props}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
