import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Skeleton,
  Table,
} from "antd";
import { get, head } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useGetPermissionByStaffGroup, useResources, useUpdatePolicy } from "~/modules/policy/policy.hook";
import {
  onPermissionChangeProps,
  PermissionProps,
} from "~/modules/policy/policy.modal";
import useNotificationStore from "~/store/NotificationContext";
import StaffGroupsForm from "../components/StaffGroupsForm";
import {
  onSearchPermissions,
  useCreateStaffGroup,
  useDeleteStaffGroup,
  useGetStaffGroups,
  useResetStaffGroupsAction,
  useResourceColumns,
  useStaffGroupsQueryParams,
  useUpdateStaffGroup,
  useUpdateStaffGroupsParams,
} from "../staffGroups.hook";
import Search from "antd/es/transfer/search";
type propsType = {};
const styleButton = {
  alignContent: "center",
  display: "flex",
  alignItems: "center",
};
const Permission = ({ isActive, onChange, disabled }: PermissionProps) => {
  return (
    <Checkbox
      checked={isActive}
      onChange={onChange}
      disabled={disabled}
    ></Checkbox>
  );
};

export default function StaffGroups(props: propsType): React.JSX.Element {
  useResetStaffGroupsAction();
  const { pathname } = useLocation();
  const [reFetch, setReFetch] = useState(false);
  const refRight = useRef<any>();
  const [dataShow, setDataShow] = useState<any>(null);
  const { onNotify } = useNotificationStore();
  const [groupId, setGroupId] = useState<any>(null);
  // const [resources, isResourcesLoading] = useResources();
  const [groups, isLoadingGroup] = useGetStaffGroups();
  const [query] = useStaffGroupsQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateStaffGroupsParams(query);
  const param = useMemo(() => groupId, [groupId]);
  const [permission, isLoadingPermission] = useGetPermissionByStaffGroup(param);
  useEffect(() => {
    if (groups) {
      const headItem = (head(groups)as any)?._id || groups[0]?.id;
      onParamChange({
        groupId: headItem,
      });
      setGroupId(headItem);
    };
  }, [groups]);


  const [, handleUpdatePolicy] = useUpdatePolicy();
  const [, deleteGroup] = useDeleteStaffGroup();
  const canUpdate = true;

  const dispatch = useDispatch();
  //   const reFetchGroup = () => {
  //     return dispatch(userGroupSliceAction.getByIdRequest(param));
  //   };

  const onPermisionChange = ({
    isAssign,
    resource,
    action,
  }: onPermissionChangeProps) => {
    try {
      if (!canUpdate) return;
      // updateGroup({ isAssign, resource, action }); // update Group in store redux
      handleUpdatePolicy({ isAssign, resource, action, groupId });
    } catch (error) {
      onNotify?.error(get(error, "message", "Some error"));
    }
  };
  const renderPermission = (key: string) => (action: any, rc: any) => {
    const resourceKey = rc?.key;
    const admin = groups?.policies?.[resourceKey]?.includes("admin");
    // const notAccess = !get(permissionAccessed,resourceKey,[])?.includes(key);

    return (
      <Permission
        isActive={groups?.policies?.[resourceKey]?.includes(key)}
        onChange={(event: any) => {
          onPermisionChange({
            isAssign: event.target.checked,
            resource: resourceKey,
            action: key,
          });
        }}
        disabled={(!canUpdate || admin) && key !== "admin"}
      />
    );
  };

  //Handle action create and update

  const callback = () => {
    onCloseModal();
  };
  const [, handleUpdate] = useUpdateStaffGroup(callback);
  const [isSubmitLoading, handleCreate] = useCreateStaffGroup(callback);

  const [modal, contextHolder] = Modal.useModal();
  const refModalNow = useRef<any>();
  const onCloseModal = () => {
    refModalNow.current.destroy();
  };
  const onOpenModal = (id?: string | null) => {
    refModalNow.current = modal.info({
      content: (
        <StaffGroupsForm
          onClose={onCloseModal}
          id={id}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          isSubmitLoading={isSubmitLoading}
        />
      ),
      onCancel: onCloseModal,
      footer: null,
      closable: true,
      maskClosable: true,
      width: "40rem",
      title: "",
    });
  };
  const columns = useResourceColumns(renderPermission);
  return (
    <>
      {contextHolder}
      <Row gutter={10} className="group_permission">
        <Col span={6} className="group_permission__list">
          <h6 className="group_permission__list-title">Nhóm người dùng</h6>
          <div className="group_permission__list__menu">
            <Menu
              defaultSelectedKeys={["1"]}
              selectedKeys={[groupId]}
              mode="inline"
              theme="light"
            >
              {isLoadingGroup
                ? [1, 2, 3, 4].map((index) => (
                    <Skeleton.Input
                      active
                      key={index}
                      style={{ marginBottom: 10 }}
                    />
                  ))
                : groups.map(({ name, _id }: any) => (
                    <Menu.Item onClick={() => setGroupId(_id)} key={_id}>{name} </Menu.Item>
                  ))}
            </Menu>
          </div>
        </Col>

        <Col span={18} ref={refRight} className="group_permission__content">
          <div className="group_permission__content__header">
            <h5 className="group_permission__list-title ">Thiết lập quyền</h5>
            {!isLoadingGroup && (
              <Flex
                gap="small"
                wrap="wrap"
                style={{
                  alignContent: "center",
                }}
              >
                <WithOrPermission permission={[POLICIES.DELETE_STAFFGROUP]}>
                  <Popconfirm
                    title="Bạn muốn xoá nhóm quyền này?"
                    onConfirm={() => deleteGroup(groupId)}
                    okText="Xoá"
                    cancelText="Huỷ"
                  >
                    <Button
                      size="small"
                      type="primary"
                      danger
                      style={styleButton}
                    >
                      <DeleteOutlined /> Xoá
                    </Button>
                  </Popconfirm>{" "}
                </WithOrPermission>
                <WithOrPermission permission={[POLICIES.UPDATE_STAFFGROUP]}>
                  <Button
                    size="small"
                    onClick={() => onOpenModal(groupId)}
                    type="primary"
                    style={styleButton}
                  >
                    <EditOutlined /> Cập nhật
                  </Button>
                </WithOrPermission>
                <WithOrPermission permission={[POLICIES.WRITE_STAFFGROUP]}>
                  <Button
                    style={styleButton}
                    size="small"
                    onClick={() => onOpenModal(null)}
                    type="primary"
                  >
                    <PlusOutlined /> Tạo mới
                  </Button>
                </WithOrPermission>
              </Flex>
            )}
          </div>
          <Input.Search
            style={{marginBottom:10}}
            placeholder="tên quyền"
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   onSearchPermissions(e.target.value, resources, setDataShow)
            // }
          />
          <Table
            sticky={{
              offsetHeader: 0,
              getContainer: () => refRight.current as any,
            }}
            columns={columns}
            dataSource={(dataShow || [])}
            className="employee-group__table"
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng: ${total} `,
              size: "small",
            }}
            style={{
              marginBottom: 10,
            }}
          />
        </Col>
      </Row>
    </>
  );
}
