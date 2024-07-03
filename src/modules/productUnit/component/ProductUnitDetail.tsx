import { LoadingOutlined } from "@ant-design/icons";
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
import {
  useDeleteProductUnit,
  useGetlistProductUnit,
  useGetlistProductUnitById,
  useProductUnitPaging,
  useProductUnitQueryParams,
  useUpdateProductUnit,
  useUpdateProductUnitParams,
} from "../productUnit.hook";
import ProductUnitForm from "../screens/ProductUnitForm";
import MainContentTab from "./MainContentTab";

const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;
type propsType = {};
export default function ProductUnitDetail(props: propsType): React.JSX.Element {
  const { id: productConfigId }: any = useParams();
  const [productConfig, isLoading] = useGetlistProductUnitById(productConfigId);
  const [id, setId] = useState<any>();
  const [query] = useProductUnitQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateProductUnitParams(query);
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

  const [isOpenForm, setIsOpenForm] = useState(false);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);
  const onOpenForm = useCallback((idd?: any) => {
    setIsOpenForm(true);
    idd && setId(idd);
  }, []);
  const [, deleteProductUnit] = useDeleteProductUnit();
  const [, updateProductUnit] = useUpdateProductUnit(onCloseForm);

  return (
    <>
      <Layout
        HeaderLeft={
          <Header.HeaderLeft
            filterStatus={false}
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
            path={PATH_APP.worldPharma.unit}
            onDeleteClick={() => deleteProductUnit(productConfigId)}
            onEditClick={() => onOpenForm(productConfigId)}
            name={
              <Flex gap={10} align="center">
                {isLoading ? (
                  <LoadingOutlined spin />
                ) : (
                  <h4>{get(productConfig, "name", "")}</h4>
                )}
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 14, width: 100 }}
                >
                  <Badge
                    style={{ marginRight: 2 }}
                    status={
                      CLONE_STATUS_COLOR[get(productConfig, "status", "")]
                    }
                  />
                  {CLONE_STATUS_NAMES[get(productConfig, "status", "")]}
                </Typography.Text>
              </Flex>
            }
          />
        }
        MainContent={<MainContentTab />}
        List={
          <ListInDetailCommon
            fieldName="name"
            path="/unit"
            useGets={useGetlistProductUnit}
            usePaging={useProductUnitPaging}
            useQueryParams={useProductUnitQueryParams}
            useUpdateParams={useUpdateProductUnitParams}
          />
        }
      />
      <ModalAnt
        title="Cập nhật nhóm sản phẩm"
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <ProductUnitForm
          id={id}
          updateProductUnit={updateProductUnit}
          callBack={onCloseForm}
        />
      </ModalAnt>
    </>
  );
}
