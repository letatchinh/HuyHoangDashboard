import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Flex,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Skeleton,
  Table,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import UserGroupForm from "../components/UserGroupForm";
import { get } from "lodash";
import {
  onSearchPermissions,
  useCreateUserGroup,
  useDeleteUserGroup,
  useGetUserGroup,
  useGetUserGroups,
  useResetUserGroups,
  useResourceColumns,
  useUpdateUserGroup,
} from "../userGroup.hook";
import {
  useResources,
  useUpdatePolicy,
} from "~/modules/policy/policy.hook";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import POLICIES from "~/modules/policy/policy.auth";
import { userGroupSliceAction } from "../redux/reducer";
import WithOrPermission from "~/components/common/WithOrPermission";
import { useDispatch } from "react-redux";
import useNotificationStore from "~/store/NotificationContext";

const styleButton = {
  alignContent: "center",
  display: "flex",
  alignItems: "center",
};
interface UserGroupProps {
  currentTab?: string;
};

interface PermissionProps {
  isActive?: boolean;
  onChange?: any;
  disabled?: boolean;
}

interface onPermissionChangeProps {
  resource?: any;
  action?: any;
  isAssgined?: boolean;
}
const Permission = ({ isActive, onChange, disabled }: PermissionProps) => {
  return (
    <Checkbox
      checked={isActive}
      onChange={onChange}
      disabled={disabled}
    ></Checkbox>
  );
};

const getNextPath = (url: string) => {
  const paths = url.split("/");
  const nextPath = paths
    .filter((x, index) => !!x && index !== paths.length - 1)
    .join("/");

  return `/${nextPath}`;
};

const UserGroup = ({ currentTab }: UserGroupProps) => {
  useResetUserGroups();
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(userGroupSliceAction.resetAction());
  };
  const { branchId, groupId }: any = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [reFetch, setReFetch] = useState(false);
  const branchIdParam = useMemo(
    () => ({ branchId: branchId ? branchId : DEFAULT_BRANCH_ID }),
    [branchId, reFetch]
  );
  const [groups, isLoading] = useGetUserGroups(branchIdParam);
  const param = useMemo(() => (groupId), [groupId, reFetch]);
  const [group, isLoadingGroup, updateGroup] = useGetUserGroup(param);
  const [, handleUpdate] = useUpdatePolicy();
  const [, deleteGroup] = useDeleteUserGroup();
  const reFeatchGroup = () => {
    return dispatch(userGroupSliceAction.getByIdRequest(param));
  };

  const {onNotify} = useNotificationStore();

  //State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<any>(null);
  const [dataShow, setDataShow] = useState(null);
  const canUpdate = true;
  // Action
  const onOpenForm = (id?: any) => {
    setId(id);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setId(null);
  };
  const [, handleUpdateUser] = useUpdateUserGroup(() => {
    onClose();
    resetAction();
  });
  const [isSubmitLoading, handleCreate] = useCreateUserGroup(() => {
    onClose();
    resetAction();
  });
  const [resources, isResourcesLoading] = useResources();

  useEffect(() => {
    if (!groupId && groups.length && currentTab === 'user/group') {
      navigate(`/user/group/${groups[0]._id}`);
    };
  }, [groups, pathname, groupId]);

  const onSelectGroup = ({ key }: any) => {
    const nextPath = `/user/group/${key}`;
    navigate(nextPath);
  };

  const onPermisionChange = ({
    isAssgined,
    resource,
    action,
  }: onPermissionChangeProps) => {
    try {
      if (!canUpdate) return;
      updateGroup({ isAssgined, resource, action }); // update Group in store redux
      handleUpdate({ isAssgined, resource, action, groupId });
    } catch (error) {
      onNotify?.error(get(error, "message", "Some error"));
    }
  };
  const renderPermission = (key: string) => (action: any, rc: any) => {
    const admin = group?.policies?.[rc.key]?.includes("admin");
    return (
      <Permission
        isActive={group?.policies?.[rc.key]?.includes(key)}
        onChange={(event: any) => {
          onPermisionChange({
            isAssgined: event.target.checked,
            resource: rc.key,
            action: key,
          });
        }}
        disabled={(!canUpdate || admin) && key !== "admin"}
      />
    );
  };
  const columns = useResourceColumns(renderPermission);
  
  return (
    <div className="employee-group">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={7}>
          <div className="employee-group__list">
            <h6 className="employee-group__list-title">Nhóm người dùng</h6>
            <Menu
              className="employee-group__list__menu"
              defaultSelectedKeys={["1"]}
              selectedKeys={[groupId]}
              mode="inline"
              theme="light"
              onSelect={onSelectGroup}
            >
              {isLoading
                ? [1, 2, 3, 4].map((index) => (
                    <Skeleton.Input
                      active
                      key={index}
                      style={{ marginBottom: 10 }}
                    />
                  ))
                : groups.map(({ name, _id }: any) => (
                    <Menu.Item key={_id}>{name} </Menu.Item>
                  ))}
            </Menu>
          </div>
        </Col>

        <Col span={17}>
          <div className="employee-group__content">
            <div className="employee-group__header">
              <h5 className="employee-group__list-title ">Thiết lập quyền</h5>
            { !isLoading && <Flex
                gap="small"
                wrap="wrap"
                style={{
                  alignContent: "center",
                }}
              >
                <WithOrPermission permission={[POLICIES.DELETE_USERGROUP]}>
                <Popconfirm
                  title="Bạn muốn xoá chi nhánh này?"
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
                <WithOrPermission permission={[POLICIES.UPDATE_USERGROUP]}>
                <Button
                  size="small"
                  onClick={() => onOpenForm(groupId)}
                  type="primary"
                  style={styleButton}
                >
                  <EditOutlined /> Cập nhật
                </Button>
                </WithOrPermission>
                <WithOrPermission permission={[POLICIES.WRITE_USERGROUP]}>
                <Button
                  style={styleButton}
                  size="small"
                  onClick={() => onOpenForm(null)}
                  type="primary"
                >
                  <PlusOutlined /> Tạo mới
                </Button>
                </WithOrPermission>
              </Flex>}
            </div>
            <SelectSearch
              showSelect={false}
              placeholder="tên quyền"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchPermissions(e.target.value, resources, setDataShow)
              }
              permissionKey={[POLICIES.WRITE_USER]}
            />
            <Table
              columns={columns}
              dataSource={dataShow ?? resources}
              className="employee-group__table"
              pagination={{
                showSizeChanger : true,
                showTotal: (total) => `Tổng cộng: ${total} `,
                size:"small"
              }}
            />
          </div>
        </Col>
      </Row>
        <Modal
            open={isOpen}
            footer={[]}
            onCancel={onClose}
            className="form-modal__user-group"
            afterClose={() => {
              setReFetch(!reFetch);
              reFeatchGroup();
              }}
        // destroyOnClose
      >
        <UserGroupForm
          isOpen={isOpen} 
          onClose={onClose} id={id} 
          setReFetch={setReFetch} 
          reFetch={reFetch}
          handleCreate={handleCreate}
          handleUpdateUser={handleUpdateUser}
        />
        </Modal>
    </div>
  );
};

export default UserGroup;
