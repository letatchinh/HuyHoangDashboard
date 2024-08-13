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
import TypePharmacyForm from "../screens/TypePharmacyForm";
import { useDeleteTypePharmacy, useGetTypePharmacies, useGetTypePharmacy, useGetTypePharmacy_onlyGet, useTypePharmacyPaging, useTypePharmacyQueryParams, useUpdateTypePharmacy, useUpdateTypePharmacyParams } from "../typePharmacy.hook";
import MainContentTab from "./MainContentTab";
type propsType = {};

const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;

export default function TypePharmacyDetail(
  props: propsType
): React.JSX.Element {
  const { id: typePharmacyId }: any = useParams();
  useGetTypePharmacy(typePharmacyId);
  const [id, setId] = useState<any>();
  const [query] = useTypePharmacyQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateTypePharmacyParams(query);
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
  const [typePharmacy]: any = useGetTypePharmacy_onlyGet();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);
  const onOpenForm = useCallback((idd?: any) => {
    setIsOpenForm(true);
    idd && setId(idd);
  }, []);
  const [, handleUpdate] = useUpdateTypePharmacy(onCloseForm);
  const [, handleDelete] = useDeleteTypePharmacy();
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
            path={PATH_APP.typePharmacy.root}
            onDeleteClick={() => handleDelete(typePharmacyId)}
            onEditClick={() => onOpenForm(typePharmacyId)}
            name={
              <Flex gap={10} align="center">
                <h4>{get(typePharmacy, "title", "")}</h4>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 14, width: 100 }}
                >
                  <Badge
                    style={{ marginRight: 2 }}
                    status={CLONE_STATUS_COLOR[get(typePharmacy, "status", "")]}
                  />
                  {CLONE_STATUS_NAMES[get(typePharmacy, "status", "")]}
                </Typography.Text>
              </Flex>
            }
          />
        }
        MainContent={<MainContentTab />}
        List={
          <ListInDetailCommon
            fieldName="title"
            path="/type-pharmacy"
            useGets={useGetTypePharmacies}
            usePaging={useTypePharmacyPaging}
            query={query}
            onParamChange={onParamChange}
          />
        }
      />
      <ModalAnt
        title={"Thêm mới nhánh bán hàng"}
        width={700}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <TypePharmacyForm
          onClose={onCloseForm}
          id={id}
          handleUpdate={handleUpdate}
        />
      </ModalAnt>
    </>
  );
}
