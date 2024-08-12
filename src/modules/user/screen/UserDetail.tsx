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
  useDeleteUser,
  useGetUser,
  useGetUser_onlyGet,
  useUserQueryParams,
  useUpdateUser,
  useUpdateUserParams,
} from "../user.hook";
import UserForm from "../components/UserForm";
import ListInDetail from "../components/ListInDetail";
import MainContentTab from "../components/MainContentTab";
const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;
export default function UserDetail(): React.JSX.Element {
  const { id: userId }: any = useParams();
  useGetUser(userId);
  const [id, setId] = useState<any>();
  const [query] = useUserQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateUserParams(query);
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
  const [user]: any = useGetUser_onlyGet();

  const [isOpenForm, setIsOpenForm] = useState(false);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);
  const onOpenForm = useCallback((idd?: any) => {
    setIsOpenForm(true);
    idd && setId(idd);
  }, []);
  const [, updateUser] = useUpdateUser(onCloseForm);
  const [, deleteUser] = useDeleteUser();

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
            path={PATH_APP.user.root}
            onDeleteClick={() => deleteUser(userId)}
            onEditClick={() => onOpenForm(userId)}
            name={
              <Flex gap={10} align="center">
                <h4>
                  {get(user, "fullName", "")}
                </h4>
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  <Badge
                    style={{ marginRight: 2 }}
                    status={CLONE_STATUS_COLOR[get(user, "status", "")]}
                  />
                  {CLONE_STATUS_NAMES[get(user, "status", "")]}
                </Typography.Text>
              </Flex>
            }
          />
        }
        MainContent={<MainContentTab />}
        List={<ListInDetail />}
      />
      <ModalAnt
        width={1100}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <UserForm
          id={id}
          handleCloseModal={onCloseForm}
          updateUser={updateUser}
        />
      </ModalAnt>
    </>
  );
}
