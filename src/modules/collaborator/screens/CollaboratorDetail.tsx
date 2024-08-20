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
import {
  useCollaboratorPaging, useCollaboratorQueryParams, useDeleteCollaborator,
  useGetCollaborator, useGetCollaborators, useGetCollaborator_onlyGet, useUpdateCollaborator,
  useUpdateCollaboratorParams
} from "../collaborator.hook";
import CollaboratorForm from "../components/CollaboratorForm";
import MainContentTab from "../components/MainContentTab";
const CLONE_STATUS_NAMES: any = STATUS_NAMES;
const CLONE_STATUS_COLOR: any = STATUS_COLOR;
export default function CollaboratorDetail(): React.JSX.Element {
  const { id: collaboratorId }: any = useParams();
  useGetCollaborator(collaboratorId);
  const [id, setId] = useState<any>();
  const [query] = useCollaboratorQueryParams(20);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateCollaboratorParams(query);
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
    const onSearch = () => {
        onParamChange({keyword});
        onClose();
    }
  const [collaborator]: any = useGetCollaborator_onlyGet();
  
  const [isOpenForm, setIsOpenForm] = useState(false);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);
  const onOpenForm = useCallback((idd?: any) => {
    setIsOpenForm(true);
    idd && setId(idd);
  }, []);
  const [, updateCollaborator] = useUpdateCollaborator(onCloseForm);
  const [, deleteCollaborator] = useDeleteCollaborator();

  return (
    <>
      <Layout
        HeaderLeft={
          <Header.HeaderLeft
            PERMISSION_WRITE={POLICIES.WRITE_PARTNER}
            onChangeStatus={(status) => onParamChange({ status })}
            onAdd={() => onOpenForm()}
            SearchProp={{
                openSearch : showDrawer,
                open,
                onClose,
                onSearch,
                querySearch : ['keyword'],
                SearchComponent : <Input
                placeholder="Nhập để tìm kiếm"
                allowClear
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
              />
            }}
          />
        }
        HeaderRight={
          <Header.HeaderRight
            PERMISSION_UPDATE={POLICIES.UPDATE_PARTNER}
            PERMISSION_DELETE={POLICIES.DELETE_PARTNER}
            path={PATH_APP.collaborator.root}
            onDeleteClick={() => deleteCollaborator(collaboratorId)}
            onEditClick={() => onOpenForm(collaboratorId)}
            name={
              <Flex gap={10} align="center">
                <h4>
                  {get(collaborator, "fullName", "") +
                    " - " +
                    get(collaborator, "partnerNumber", "")}
                </h4>
                <Typography.Text type="secondary"  style={{ fontSize: 14 , width : 100 }}>
                  <Badge
                    style={{ marginRight: 2 }}
                    status={CLONE_STATUS_COLOR[get(collaborator, "status", "")]}
                  />
                  {CLONE_STATUS_NAMES[get(collaborator, "status", "")]}
                </Typography.Text>
              </Flex>
            }
          />
        }
        MainContent={<MainContentTab />}
        List={
          <ListInDetailCommon
            fieldName="fullName"
            path={"/collaborator-detail"}
            useGets={useGetCollaborators}
            usePaging={useCollaboratorPaging}
            query={query}
            onParamChange={onParamChange}
            fieldCode="partnerNumber"
            moduleName="collaborator"
          />
        }
      />
      <ModalAnt
        width={1100}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        destroyOnClose
      >
        <CollaboratorForm
          handleCloseModal={onCloseForm}
          id={id}
          handleUpdate={updateCollaborator}
        />
      </ModalAnt>
    </>
  );
}
