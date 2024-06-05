import { SelectProps } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import apis from "../employee.api";
import useNotificationStore from "~/store/NotificationContext";
import DebounceSelect from "~/components/common/DebounceSelect";
interface TypeProps extends SelectProps {
  form?: any;
  onChange?: (p: any) => void;
  allowClear?: boolean;
  showIcon?: boolean;
  validateFirst?: boolean;
  label?: string;
}
type ItemSearch = {
  name: string;
  value: string;
};
export default function SelectEmployeeV2({
  form,
  onChange = () => {},
  allowClear = true,
  showIcon = true,
  validateFirst = true,
  label = "",
  ...props
}: TypeProps): React.JSX.Element {
  const { onNotify } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [initOption, setInitOption] = useState([]);
  const fetchOptions: any = async (keyword: string) => {
    try {
      const employees = await apis.search({
        keyword: keyword || "",
      });
      const newOptions = employees?.map(
        (item: ItemSearch) => ({
          label: get(item, "fullName"),
          value: get(item, "_id"),
        })
      );

      return newOptions;
    } catch (error: any) {
      onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra");
    }
  };

  useEffect(() => {
    const fetchInit = async () => {
      try {
        setLoading(true);
        const employees = await apis.search({
          id: form.getFieldValue("employeeId"),
          keyword: "",
        });

        const newOptions = employees?.map(
          (item: ItemSearch) => ({
            label: get(item, "fullName"),
            value: get(item, "_id"),
          })
        );

        setInitOption(newOptions);
        setLoading(false);
        if (validateFirst) {
          await form.validateFields(["employeeId"]);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchInit();
  }, []);

  return (
    <DebounceSelect
      size="large"
      loading={loading}
      placeholder="Trình dược viên"
      fetchOptions={fetchOptions}
      style={{ width: "100%" }}
      initOptions={initOption}
      allowClear={allowClear}
      {...(onChange && { onChange: (value: any) => onChange(value) })}
      {...props}
    />
  );
}
