import { PhoneFilled } from "@ant-design/icons";
import { Flex, Pagination, Spin, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import { useGetUsers, useUserPaging, useUserQueryParams, useUpdateUserParams } from "../user.hook";
type propsType = {};
export default function ListInDetail(props: propsType): React.JSX.Element {
  const [query] = useUserQueryParams(20);
  const { id } = useParams();
  const [keyword, { setKeyword, onParamChange }] =
  useUpdateUserParams(query);
  const [data, isLoading] = useGetUsers(query);
  const paging = useUserPaging();
  const navigate = useNavigate();
  return isLoading ? (
    <Flex style={{ height: 200 }} justify={"center"} align="center">
      <Spin spinning />
    </Flex>
  ) : (
    <>
    {data?.map((item: any) => (
      <div
        onClick={() =>
          navigate("/user-detail/" + get(item, "_id"))
        }
        className={`layoutDetail--left__list__item  ${
          id === get(item, "_id") ? "active" : ""
        }`}
      >
        <Typography.Link className="layoutDetail--left__list__item__LeftText">
          {get(item, "fullName", "")}
        </Typography.Link>
        <Flex justify={'space-between'} gap={10}>
        <Typography.Text type="secondary">{get(item, "partnerNumber", "")}</Typography.Text>
        </Flex>
      </div>
    ))}
    <Flex style={{marginTop : 10}} justify={'center'}>
    <Pagination showSizeChanger onChange={(page,pageSize) => onParamChange({page,limit : pageSize})} size="small" {...paging}/>
    </Flex>
    </>
  );
}
