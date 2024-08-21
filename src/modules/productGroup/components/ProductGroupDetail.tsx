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
import MainContentTab from "../components/MainContentTab";
import {
  useDeleteProductConfig,
  useGetlistProductConfig,
  useGetlistProductConfigById,
  useGetlistProductConfigById_onlyGet,
  useProductConfigPaging,
  useProductConfigQueryParams,
  useUpdateProductConfig,
  useUpdateProductConfigParams
} from "../productGroup.hook";
import ProductConfigForm from "../screens/ProductGroupForm";
const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;
export default function ProductGroupDetail(): React.JSX.Element {
  const { id: productConfigId }: any = useParams();
  useGetlistProductConfigById(productConfigId);
  const [id, setId] = useState<any>();
  const [query] = useProductConfigQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductConfigParams(query);
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
  const [productConfig]: any = useGetlistProductConfigById_onlyGet();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);
  const onOpenForm = useCallback((idd?: any) => {
    setIsOpenForm(true);
    idd && setId(idd);
  }, []);
  const [, updateProductConfig] = useUpdateProductConfig(onCloseForm);
  const [, deleteProductConfig] = useDeleteProductConfig();

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
            path={PATH_APP.worldPharma.productGroup}
            onDeleteClick={() => deleteProductConfig(productConfigId)}
            onEditClick={() => onOpenForm(productConfigId)}
            name={
              <Flex gap={10} align="center">
                <h4>
                  {get(productConfig, "name", "") +
                    " - " +
                    get(productConfig, "code", "")}
                </h4>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
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
            path="/productGroup"
            useGets={useGetlistProductConfig}
            usePaging={useProductConfigPaging}
            query={query}
            onParamChange={onParamChange}
            fieldCode="code"
            moduleName="productGroup"
          />
        }
      />
      <ModalAnt
        // title="Thêm mới nhóm sản phẩm"
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <ProductConfigForm
          id={id}
          callBack={onCloseForm}
          updateProductConfig={updateProductConfig}
        />
      </ModalAnt>
    </>
  );
}
