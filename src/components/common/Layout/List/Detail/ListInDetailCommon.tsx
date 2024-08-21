import { Flex, Pagination, Spin, Typography } from "antd";
import { get } from "lodash";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EmptyData from "~/components/Antd/EmptyData";
import Loading from "~/components/common/Loading/index";
import { RootState } from "~/redux/store";
import { convertQueryString } from "~/utils/helpers";
type propsType = {
  useGets : (p?:any) => void,
  usePaging : () => void,
  fieldName : string,
  path : string,
  fieldCode? : string,
  moduleName : string,
  query : any,
  onParamChange : (p?: any) => void
};

const getSelectorDeleteSuccess = (moduleName : string) => (state:any) => state[moduleName]['deleteSuccess'];
export default function ListInDetailCommon({useGets,usePaging,fieldName,fieldCode,path,query,onParamChange,moduleName}: propsType): React.JSX.Element {
  const deleteSuccess = useSelector(getSelectorDeleteSuccess(moduleName));
  const { id } = useParams();
  const [data, isLoading] : any = useGets(query);
  const paging : any = usePaging();
  const navigate = useNavigate();

  useEffect(() => {
    if(deleteSuccess){
      if(!data?.some((item:any) => get(item,'_id') === id)){ // Check Id is a Id have just been deleted
        const nextDataId = get(data,[0,'_id']);
        navigate(path + "/" + nextDataId)
      }
    }
  },[deleteSuccess,data]);

  return <>
  <Loading loading={isLoading}/>
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
}
