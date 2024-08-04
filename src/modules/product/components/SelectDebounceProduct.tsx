import { Form, Select } from "antd";
import { debounce, get } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import ProductModule from "~/modules/product";
type propsType = {
  fieldName? : string | any[],
  value ? : any
};
export default function SelectDebounceProduct({
  fieldName = "productId",
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
        isSupplierMaster: true,
      }
      if(value){
        query.idsInitOptions = value;
      }
      const products = await ProductModule.api.getAll(query);
      setOptions(get(products, "options", []))
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
      placeholder="mặt hàng"
      />
    </Form.Item>
  );
}
