import { Badge, Flex, Input, Typography } from "antd";
import Search from "antd/lib/input/Search";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import Header from "~/components/common/Layout/List/Detail/Header";
import Layout from "~/components/common/Layout/List/Detail/Layout";
import { STATUS_COLOR, STATUS_NAMES } from "~/constants/defaultValue";
import { PATH_APP } from "~/routes/allPath";
import {
  useDeleteManufacturer,
  useManufacturerPaging,
  useManufacturerQueryParams,
  useUpdateManufacturer,
  useManufacturerParams,
  useGetManufacturerById,
  useGetManufacturerById_onlyGet,
  useGetManufacturerList,
} from "../manufacturer.hook";
import MainContentTab from "./MainContentTab";
import ListInDetailCommon from "~/components/common/Layout/List/Detail/ListInDetailCommon";
import ManufacturerForm from "../screens/ManufacturerForm";
const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;
export default function ManufacturerDetail(): React.JSX.Element {
  const { id: productConfigId }: any = useParams();
  useGetManufacturerById(productConfigId);
  const [id, setId] = useState<any>();
  const [query] = useManufacturerQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useManufacturerParams(query);
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
  const [productConfig]: any = useGetManufacturerById_onlyGet();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);
  const onOpenForm = useCallback((idd?: any) => {
    setIsOpenForm(true);
    idd && setId(idd);
  }, []);
  const [, updateManufacturer] = useUpdateManufacturer(onCloseForm);
  const [, deleteManufacturer] = useDeleteManufacturer();

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
              querySearch : ['keyword']
            }}
          />
        }
        HeaderRight={
          <Header.HeaderRight
            path={PATH_APP.worldPharma.manufacturer}
            onDeleteClick={() => deleteManufacturer(productConfigId)}
            onEditClick={() => onOpenForm(productConfigId)}
            name={
              <Flex gap={10} align="center">
                <h4>
                  {get(productConfig, "name", "")}
                </h4>
                <Typography.Text type="secondary" style={{ fontSize: 14, width : 100  }}>
                  <Badge
                    style={{ marginRight: 2 }}
                    status={CLONE_STATUS_COLOR[get(productConfig, "status", "")]}
                  />
                  {CLONE_STATUS_NAMES[get(productConfig, "status", "")]}
                </Typography.Text>
              </Flex>
            }
          />
        }
        MainContent={<MainContentTab />}
        List={<ListInDetailCommon fieldName="name" path="/manufacturer" useGets={useGetManufacturerList} usePaging={useManufacturerPaging} useQueryParams={useManufacturerQueryParams} useUpdateParams={useManufacturerParams}/>}
      />
      <ModalAnt
        title="Cập nhật nhóm sản phẩm"
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <ManufacturerForm
          id={id}
          updateManufacturer={updateManufacturer}
          callBack={onCloseForm}
        />
      </ModalAnt>
    </>
  );
}
