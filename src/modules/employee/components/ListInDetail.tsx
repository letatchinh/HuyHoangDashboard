import React from "react";
import {
  useEmployeePaging,
  useEmployeeQueryParams,
  useGetEmployees,
  useUpdateEmployeeParams,
} from "../employee.hook";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Pagination, Spin, Typography } from "antd";
import { PATH_APP } from "~/routes/allPath";
import { get } from "lodash";
type propsType = {};
export default function ListInDetail(props: propsType): React.JSX.Element {
  const [query] = useEmployeeQueryParams(20);
  const { id } = useParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateEmployeeParams(query);
  const [employees, isLoading] = useGetEmployees(query);
  const paging = useEmployeePaging();
  const navigate = useNavigate();
  return isLoading ? (
    <Flex style={{ height: 200 }} justify={"center"} align="center">
      <Spin spinning />
    </Flex>
  ) : (
    <>
      {employees?.map((item: any) => (
        <div
          onClick={() =>
            navigate(`/employee-detail/` + get(item, "_id"))
          }
          className={`layoutDetail--left__list__item  ${
            id === get(item, "_id") ? "active" : ""
          }`}
        >
          <Typography.Link className="layoutDetail--left__list__item__LeftText">
            {get(item, "fullName", "")}
          </Typography.Link>
          <Flex justify={"space-between"} gap={10}>
            <Typography.Text type="secondary">
              {get(item, "employeeNumber", "")}
            </Typography.Text>
          </Flex>
        </div>
      ))}
      <Flex style={{ marginTop: 10 }} justify={"center"}>
        <Pagination
          showSizeChanger
          onChange={(page, pageSize) =>
            onParamChange({ page, limit: pageSize })
          }
          size="small"
          {...paging}
        />
      </Flex>
    </>
  );
}
