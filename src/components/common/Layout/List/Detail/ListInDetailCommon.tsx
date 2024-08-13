import { Flex, Pagination, Spin, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyData from "~/components/Antd/EmptyData";
import { convertQueryString } from "~/utils/helpers";
type propsType = {
  useGets : (p?:any) => void,
  usePaging : () => void,
  fieldName : string,
  path : string,
  fieldCode? : string,
  query : any,
  onParamChange : (p?: any) => void
};
export default function ListInDetailCommon({useGets,usePaging,fieldName,fieldCode,path,query,onParamChange}: propsType): React.JSX.Element {
  const { id } = useParams();
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
          navigate({
            pathname : path + "/" + get(item, "_id"),
            search : convertQueryString(query),
          })
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
    <Pagination showSizeChanger onChange={(page,pageSize) => onParamChange({page,limit : pageSize})} size="small" {...paging}  showTotal = {(total) => `Tổng cộng: ${total} `}/>
    </Flex> : <EmptyData />}
    </>
  );
}
