import { useMemo } from "react";
import { get } from "lodash";
import { Form, Select } from "antd";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import RenderLoading from "~/components/common/RenderLoading";
import apis from "../employee.api";

type propsType = {
  isLoading: boolean;
  employeeSeller?: any;
};
export default function SelectEmployee({
  isLoading,
  employeeSeller,
}: propsType): React.JSX.Element {
  const [employees, isLoadingEmployees] = useFetchState({api: apis.search ,useDocs: false});
  const options = useMemo(
    () =>
      employees?.map((item: any) => ({
        label: get(item, "fullName"),
        value: get(item, "_id"),
      })),
    [employees]
  );

  return (
    <>
      <Form.Item
        label="Trình dược viên"
        name="employeeId"
        // rules={[{ required: true, message: "Vui lòng chọn nhóm khách hàng!" }]}
      >
        {RenderLoading(
          isLoading,
          <Select
            // className="right--parent"
            placeholder="Trình dược viên"
            options={options}
            showSearch
            filterOption={filterSelectWithLabel}
            loading={isLoadingEmployees}
          />
        )}
      </Form.Item>
    </>
  );
}
