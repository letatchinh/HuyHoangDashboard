import { SelectProps } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import useNotificationStore from "~/store/NotificationContext";
import DebounceSelect from "~/components/common/DebounceSelect";
import apis from "../collaborator.api";
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
export default function SelectCollaboratorV2({
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
      const collaborators = await apis.getALLAuthenticated({
        keyword: keyword || "",
      });
      const newOptions = collaborators?.map((item: ItemSearch) => ({
        label: get(item, "fullName", "name"),
        value: get(item, "_id"),
      }));

      return newOptions;
    } catch (error: any) {
      onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra");
    }
  };

  useEffect(() => {
    const fetchInit = async () => {
      try {
        setLoading(true);
        const collaborators = await apis.getALLAuthenticated({
          id: form.getFieldValue("collaboratorId"),
          keyword: "",
        });

        const newOptions = collaborators?.map((item: ItemSearch) => ({
          label: get(item, "fullName"),
          value: get(item, "_id"),
        }));

        setInitOption(newOptions);
        setLoading(false);
        if (validateFirst) {
          await form.validateFields(["collaboratorId"]);
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
      placeholder="Cộng tác viên"
      fetchOptions={fetchOptions}
      style={{ width: "100%" }}
      initOptions={initOption}
      allowClear={allowClear}
      {...(onChange && { onChange: (value: any) => onChange(value) })}
      {...props}
    />
  );
}
