import { Badge, Flex, Input, Typography } from "antd";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import Header from "~/components/common/Layout/List/Detail/Header";
import Layout from "~/components/common/Layout/List/Detail/Layout";
import ListInDetailCommon from "~/components/common/Layout/List/Detail/ListInDetailCommon";
import { STATUS_COLOR, STATUS_NAMES } from "~/constants/defaultValue";
import POLICIES from "~/modules/policy/policy.auth";
import { PATH_APP } from "~/routes/allPath";
import { useDeleteGroupPharmacy, useGetGroupPharmacy, useGetGroupPharmacy_onlyGet, useGetGroupsPharmacy, useGroupPharmacyPaging, useGroupPharmacyQueryParams, useUpdateGroupPharmacy, useUpdateGroupPharmacyParams } from "../groupPharmacy.hook";
import { GroupPharmacyForm } from "../screens/GroupPharmacyForm";
import MainContentTab from "./MainContentTab";
type propsType = {};

const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;

export default function GroupPharmacyDetail(props: propsType): React.JSX.Element {
    const { id: groupPharmacyId }: any = useParams();
    useGetGroupPharmacy(groupPharmacyId);
    const [id, setId] = useState<any>();
    const [query] = useGroupPharmacyQueryParams();
    const [keyword, { setKeyword, onParamChange }] =
      useUpdateGroupPharmacyParams(query);
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
    const [groupPharmacy]: any = useGetGroupPharmacy_onlyGet();
  
    const [isOpenForm, setIsOpenForm] = useState(false);
    const onCloseForm = useCallback(() => {
      setIsOpenForm(false);
      setId(null);
    }, []);
    const onOpenForm = useCallback((idd?: any) => {
      setIsOpenForm(true);
      idd && setId(idd);
    }, []);
    const [, handleUpdate] = useUpdateGroupPharmacy(onCloseForm);
    const [, handleDelete] = useDeleteGroupPharmacy();
    return (
      <>
        <Layout
          HeaderLeft={
            <Header.HeaderLeft
              PERMISSION_WRITE={POLICIES.WRITE_CUSTOMER}
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
              PERMISSION_UPDATE={POLICIES.UPDATE_CUSTOMER}
              PERMISSION_DELETE={POLICIES.DELETE_CUSTOMER}
              path={PATH_APP.groupPharmacy.root}
              onDeleteClick={() => handleDelete(groupPharmacyId)}
              onEditClick={() => onOpenForm(groupPharmacyId)}
              name={
                <Flex gap={10} align="center">
                  <h4>{get(groupPharmacy, "title", "")}</h4>
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 14, width: 100 }}
                  >
                    <Badge
                      style={{ marginRight: 2 }}
                      status={CLONE_STATUS_COLOR[get(groupPharmacy, "status", "")]}
                    />
                    {CLONE_STATUS_NAMES[get(groupPharmacy, "status", "")]}
                  </Typography.Text>
                </Flex>
              }
            />
          }
          MainContent={<MainContentTab />}
          List={
            <ListInDetailCommon
              fieldName="title"
              path="/group-pharmacy"
              useGets={useGetGroupsPharmacy}
              usePaging={useGroupPharmacyPaging}
              query={query}
              onParamChange={onParamChange}
              moduleName="groupPharmacy"
            />
          }
        />
        <ModalAnt
          title={"Thêm mới nhóm bán hàng"}
          width={700}
          open={isOpenForm}
          onCancel={onCloseForm}
          footer={[]}
          destroyOnClose
        >
          <GroupPharmacyForm
            onClose={onCloseForm}
            id={id}
            handleUpdate={handleUpdate}
          />
        </ModalAnt>
      </>
    );
  }
  