import { PhoneFilled } from "@ant-design/icons";
import { Flex, Pagination, Spin, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import { useGetPharmacies, usePharmacyPaging, usePharmacyQueryParams, useUpdatePharmacyParams } from "../pharmacy.hook";
type propsType = {};
export default function ListInDetail(props: propsType): React.JSX.Element {
  const [query] = usePharmacyQueryParams(true, 20);
  const { id } = useParams();
  const [keyword, { setKeyword, onParamChange }] =
  useUpdatePharmacyParams(query);
  const [pharmacies, isLoading] = useGetPharmacies(query);
  const paging = usePharmacyPaging();
  const navigate = useNavigate();
  return isLoading ? (
    <Flex style={{ height: 200 }} justify={"center"} align="center">
      <Spin spinning />
    </Flex>
  ) : (
    <>
    {pharmacies?.map((item: any) => (
      <div
        onClick={() =>
          navigate(PATH_APP.pharmacy.root + "/" + get(item, "_id"))
        }
        className={`layoutDetail--left__list__item  ${
          id === get(item, "_id") ? "active" : ""
        }`}
      >
        <Typography.Link className="layoutDetail--left__list__item__LeftText">
          {get(item, "name", "")}
        </Typography.Link>
        <Flex justify={'space-between'} gap={10}>
        <Typography.Text type="secondary">{get(item, "code", "")}</Typography.Text>
        </Flex>
      </div>
    ))}
    <Flex style={{marginTop : 10}} justify={'center'}>
    <Pagination showSizeChanger onChange={(page,pageSize) => onParamChange({page,limit : pageSize})} size="small" {...paging}/>
    </Flex>
    </>
  );
}
