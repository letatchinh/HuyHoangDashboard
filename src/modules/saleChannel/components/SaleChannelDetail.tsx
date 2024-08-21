import { Badge, Flex, Input, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import Header from "~/components/common/Layout/List/Detail/Header";
import Layout from "~/components/common/Layout/List/Detail/Layout";
import ListInDetailCommon from "~/components/common/Layout/List/Detail/ListInDetailCommon";
import { STATUS_COLOR, STATUS_NAMES } from "~/constants/defaultValue";
import { PATH_APP } from "~/routes/allPath";
import { useDeleteSaleChannel, useGetSaleChannel, useGetSaleChannel_onlyGet, useGetSaleChannels, useSaleChannelPaging, useSaleChannelQueryParams, useUpdateSaleChannel, useUpdateSaleChannelParams } from "../saleChannel.hook";
import SaleChannelForm from "../screens/SaleChannelForm";
import MainContentTab from "./MainContentTab";

const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;

type propsType = {};
export default function SaleChannelDetail(props: propsType): React.JSX.Element {
    const { id: saleChannelId }: any = useParams();
    useGetSaleChannel(saleChannelId);
    const [id, setId] = useState<any>();
    const [query] = useSaleChannelQueryParams();
    const [keyword, { setKeyword, onParamChange }] = useUpdateSaleChannelParams(query);
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
    const onSearch = () => {
      onParamChange({ keyword });
      onClose();
    };
    const [saleChannel]: any = useGetSaleChannel_onlyGet();
  
    const [isOpenForm, setIsOpenForm] = useState(false);
    const onCloseForm = useCallback(() => {
      setIsOpenForm(false);
      setId(null);
    }, []);
    const onOpenForm = useCallback((idd?: any) => {
      setIsOpenForm(true);
      idd && setId(idd);
    }, []);
    const [, handleUpdate] = useUpdateSaleChannel(onCloseForm);
    const [, handleDelete] = useDeleteSaleChannel();
  return (
    <>
      <Layout
        HeaderLeft={
          <Header.HeaderLeft
            onChangeStatus={(status) => onParamChange({ status })}
            onAdd={() => onOpenForm()}
            SearchProp={{
              openSearch: showDrawer,
              open,
              onClose,
              onSearch,
              SearchComponent: (
                <Input
                  placeholder="Nhập để tìm kiếm"
                  allowClear
                  onChange={(e) => setKeyword(e.target.value)}
                  value={keyword}
                />
              ),
              querySearch: ["keyword"],
            }}
          />
        }
        HeaderRight={
          <Header.HeaderRight
            path={PATH_APP.saleChannel.root}
            onDeleteClick={() => handleDelete(saleChannelId)}
            onEditClick={() => onOpenForm(saleChannelId)}
            name={
              <Flex gap={10} align="center">
                <h4>{get(saleChannel, "title", "")}</h4>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 14, width: 100 }}
                >
                  <Badge
                    style={{ marginRight: 2 }}
                    status={
                      CLONE_STATUS_COLOR[get(saleChannel, "status", "")]
                    }
                  />
                  {CLONE_STATUS_NAMES[get(saleChannel, "status", "")]}
                </Typography.Text>
              </Flex>
            }
          />
        }
        MainContent={<MainContentTab />}
        List={
          <ListInDetailCommon
            fieldName="title"
            path="/sale-channel"
            useGets={useGetSaleChannels}
            usePaging={useSaleChannelPaging}
            query={query}
            onParamChange={onParamChange}
            moduleName="saleChannel"
          />
        }
      />
      <ModalAnt
        title={"Thêm mới kênh bán hàng" } 
        width={700}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <SaleChannelForm
          onClose={onCloseForm}
          id={id}
          handleUpdate={handleUpdate}
        />
      </ModalAnt>
    </>
  );
}
