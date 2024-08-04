import { Form, Select } from "antd";
import { debounce, get } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import PharmacyModule from "~/modules/pharmacy";
type propsType = {
  fieldName? : string | any[],
  value ? : any
};
export default function SelectPharmacy_V2({
  fieldName = "pharmacyId",
  value,
}: propsType): React.JSX.Element {
  const first = useRef(true);
  const [options,setOptions] = useState([]);
  
  const [loading, setLoading] = useState(false);

  const fetchOptions = async (keyword?: string) => {
    try {
      setLoading(true);
      let query : any = {
        keyword,
        limit: 20,
        approved : true
      }
      if(value){
        query.idsInitOptions = value;
      }
      const response = await PharmacyModule.api.getAll(query);
      setOptions(get(response, "options", []))
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
  };
  const debounceFetcher = debounce(fetchOptions, 500);
  useEffect(() => {
      debounceFetcher("");
  }, []);

  return (
    <Form.Item style={{marginBottom : 'unset'}} name={fieldName}>
      <Select
      style={{width : '100%'}} 
      options={options}
      onSearch={debounceFetcher}
      filterOption={() => true}
      showSearch
      popupMatchSelectWidth
      loading={loading}
      placeholder="Nhà thuốc"
      />
    </Form.Item>
  );
}
