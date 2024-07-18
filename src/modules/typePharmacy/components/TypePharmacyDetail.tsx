import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { STATUS_COLOR, STATUS_NAMES } from "~/constants/defaultValue";
import { useDeleteTypePharmacy, useGetTypePharmacies, useGetTypePharmacy, useGetTypePharmacy_onlyGet, useTypePharmacyPaging, useTypePharmacyQueryParams, useUpdateTypePharmacy, useUpdateTypePharmacyParams } from "../typePharmacy.hook";
import Layout from "~/components/common/Layout/List/Detail/Layout";
import Header from "~/components/common/Layout/List/Detail/Header";
import { Badge, Flex, Input, Typography } from "antd";
import { PATH_APP } from "~/routes/allPath";
import { get } from "lodash";
import MainContentTab from "./MainContentTab";
import ListInDetailCommon from "~/components/common/Layout/List/Detail/ListInDetailCommon";
import ModalAnt from "~/components/Antd/ModalAnt";
import TypePharmacyForm from "../screens/TypePharmacyForm";
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
  const [saleChannel]: any = useGetTypePharmacy_onlyGet();

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
                <h4>{get(saleChannel, "title", "")}</h4>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 14, width: 100 }}
                >
                  <Badge
                    style={{ marginRight: 2 }}
                    status={CLONE_STATUS_COLOR[get(saleChannel, "status", "")]}
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
            path="/type-pharmacy"
            useGets={useGetTypePharmacies}
            usePaging={useTypePharmacyPaging}
            useQueryParams={useTypePharmacyQueryParams}
            useUpdateParams={useUpdateTypePharmacyParams}
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
