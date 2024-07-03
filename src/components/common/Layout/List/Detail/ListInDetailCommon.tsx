import { Flex, Pagination, Spin, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyData from "~/components/Antd/EmptyData";
type propsType = {
  useQueryParams : (p?:any) => void,
  useUpdateParams : (p?:any) => void,
  useGets : (p?:any) => void,
  usePaging : () => void,
  fieldName : string,
  path : string,
  fieldCode? : string,
};
export default function ListInDetailCommon({useQueryParams,useUpdateParams,useGets,usePaging,fieldName,fieldCode,path}: propsType): React.JSX.Element {
  const [query] : any = useQueryParams(20);
  const { id } = useParams();
  const [keyword, { setKeyword, onParamChange }] : any =
  useUpdateParams(query);
  const [data, isLoading] : any = useGets(query);
  const paging : any = usePaging();
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
          navigate(path + "/" + get(item, "_id"))
        }
        className={`layoutDetail--left__list__item  ${
          id === get(item, "_id") ? "active" : ""
        }`}
      >
        <Typography.Link className="layoutDetail--left__list__item__LeftText">
          {get(item, fieldName, "")}
        </Typography.Link>
        {fieldCode && <Flex justify={'space-between'} gap={10}>
        <Typography.Text type="secondary">{get(item, fieldCode, "")}</Typography.Text>
        </Flex>}
      </div>
    ))}
    {data?.length ? <Flex style={{marginTop : 10}} justify={'center'}>
    <Pagination showSizeChanger onChange={(page,pageSize) => onParamChange({page,limit : pageSize})} size="small" {...paging}/>
    </Flex> : <EmptyData />}
    </>
  );
}
