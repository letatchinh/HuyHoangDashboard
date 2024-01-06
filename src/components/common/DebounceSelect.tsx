import React, { useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { Empty, Select, Spin } from "antd";
import type { SelectProps } from "antd/es/select";

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
    
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        // For fetch Have Options
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : <Empty />}
      {...props}
      options={options}
      showSearch
      style={{ width: 300 }}
    />
  );
}
export default DebounceSelect;
// --------EXAMPLE---------
// const [value, setValue] = useState([]);

// const fetchOptions = async (keyword: string) => {
//     const res = await apis.getAll({ keyword });
//     const options = get(res,'docs',[])?.map((item:any) => ({label : get(item,'name.vi'),value : get(item,'_id')}))
//     return options;
//   };
//  <DebounceSelect
// showSearch
// value={value}
// placeholder="Select users"
// fetchOptions={fetchOptions}
// onChange={(newValue) => {
//   setValue(newValue);
// }}
// style={{ width: "100%" }}
// /> 