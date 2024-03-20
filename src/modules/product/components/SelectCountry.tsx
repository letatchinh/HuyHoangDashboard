import { Form, Select, Space, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import apis from "~/api";
import api from "~/api";
import RenderLoading from "~/components/common/RenderLoading";
import { filterSelectWithLabel } from "~/utils/helpers";
type propsType = {
    isLoading : boolean,
};
type ItemCountry = {
  internationalName : string,
  name : string,
  _id : number,
  code : string,

}
export default function SelectCountry({isLoading}: propsType): React.JSX.Element {
  const [option, setOption] = useState<{ label: string; value: number,code : string }[] | undefined>();
  const fetchOptionsCountry = useCallback(async () => {
        try {
          let countries : ItemCountry[] = await api.country.getAll();
        for (let i = 0; i < countries.length; i++) {
          if(get(countries[i],'code')==='VN'){ 
            countries.unshift(countries.splice(i, 1)[0]) ;
            break;
          };
        }
        
        setOption(countries?.map((item: ItemCountry) => ({
            label: get(item, "name", ""),
            value: get(item, "_id"),
            code : get(item, "code"),
          })));
        } catch (error) {
          console.log(error,'Error');
          
        }
      }, []);
    useEffect(() => {
        fetchOptionsCountry();
    },[fetchOptionsCountry]);
  return (
    <Form.Item
      label="Nước sản xuất"
      name={["productDetail", "country"]}
      rules={[{ required: true, message: "Vui lòng nhập nước sản xuất!" }]}
    >
      {RenderLoading(
        isLoading,
        <Select
          placeholder="Nước sản xuất"
          options={option}
          style={{ width: "100%" }}
          showSearch
          allowClear
          filterOption={filterSelectWithLabel}
          optionRender={({data} : any) => <Space><span className={"fi fi-"+ data.code.toLowerCase()}/> <Typography.Text>{data.label}</Typography.Text></Space>
          }
        />
        
      )}
    </Form.Item>
  );
}
