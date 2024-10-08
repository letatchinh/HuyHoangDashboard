import { Select } from "antd";
import { SelectProps } from "antd/lib/index";
import React, { useMemo } from "react";
import { useFetchState } from "~/utils/helpers";
import apis from "../teacher.api";
import { TeacherBase } from "../teacher.modal";

export default function TeacherSelect(props: SelectProps): React.JSX.Element {
  const query = useMemo(() => ({ limit: 200 }), []);
  const [data, loading] = useFetchState({
    api: apis.getAll,
    query,
  });
  const options = useMemo(
    () =>
      data?.map((item: TeacherBase) => ({
        label: item?.fullName,
        value: item?._id,
      })),
    [data]
  );
  return <Select options={options} loading={loading} {...props} />;
}
