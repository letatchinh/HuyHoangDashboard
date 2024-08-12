import { Select, SelectProps, Skeleton } from "antd";
import { DefaultOptionType } from "antd/es/select/index";
import { get } from "lodash";
import React, { useMemo } from "react";
import { filterSelectWithLabel, useFetchState } from "~/utils/helpers";
import apis from "../collaborator.api";

interface TypeProps extends SelectProps {
  defaultCollaborator?: any[];
  keywordSearchCollaborator?: string;
  mergeOption : DefaultOptionType[],
}

export default function SelectCollaborator({
  defaultCollaborator,
  keywordSearchCollaborator,
  disabled = false,
  mergeOption = [],
  ...props
}: Partial<TypeProps>): React.JSX.Element {
  // const query = useMemo(() => ({
  //   page: 1,
  //   limit: 200,
  // }), []);
  const [collaborator, isLoading] = useFetchState({
    api: apis.getALLAuthenticated,
    useDocs: false,
    shouldRun: !defaultCollaborator,
  });
  const options = useMemo(
    () => {
      const options_ = (defaultCollaborator ?? collaborator)?.map((item: any) => ({
        label: get(item, "fullName", "name"),
        value: get(item, "_id"),
      }));
      return [...mergeOption,...options_]
    },
    [collaborator, defaultCollaborator,mergeOption]
  );
  return (
    options?.length ?
    <Select
      options={options}
      loading={isLoading}
      allowClear
      style={{ minWidth: 200 }}
      placeholder="Khách hàng B2C"
      popupMatchSelectWidth={false}
      filterOption={filterSelectWithLabel}
        showSearch
      disabled = {disabled}
      {...props}
      />
      : <Skeleton.Input active />
  );
}
