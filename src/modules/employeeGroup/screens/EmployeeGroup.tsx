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
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import { get } from "lodash";
import {
  onSearchPermissions,
  useCreateEmployeeGroup,
  useDeleteEmployeeGroup,
  useEmployeeGroupQueryParams,
  useGetEmployeeGroup,
  useGetEmployeeGroups,
  useResetEmployeeGroups,
  useResourceColumns,
  useUpdateEmployeeGroup,
} from "../employeeGroup.hook";
import {
  useMatchPolicy,
  useResourcesEmployee,
  useUpdateEmployeePolicy,
} from "~/modules/policy/policy.hook";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import POLICIES from "~/modules/policy/policy.auth";
import WithOrPermission from "~/components/common/WithOrPermission";
import { useDispatch } from "react-redux";
import { employeeGroupActions } from "../redux/reducer";
import useNotificationStore from "~/store/NotificationContext";
import EmployeeGroupForm from "../components/EmployeeForm";

const styleButton = {
  alignContent: "center",
  display: "flex",
  alignItems: "center",
};
interface EmployeeGroupProps {
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

const EmployeeGroup = ({ currentTab }: EmployeeGroupProps) => {
  const refRight = useRef<any>()
  useResetEmployeeGroups();
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(employeeGroupActions.resetAction());
  };
  const { branchId, groupId }: any = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [reFetch, setReFetch] = useState(false);
  const branchIdParam = useMemo(
    () => ( branchId ? branchId : DEFAULT_BRANCH_ID),
    [branchId, reFetch]
  );
  const [query] = useEmployeeGroupQueryParams(branchIdParam);
  const [groups, isLoading] = useGetEmployeeGroups(query);
  const param = useMemo(() => (groupId), [groupId, reFetch]);
  const [group, isLoadingGroup, updateGroup] = useGetEmployeeGroup(param);
  const [, deleteGroup] = useDeleteEmployeeGroup();
  const [reFetchId, setReFetchId] = useState<any>(false);
  const reFetchGroup = () => {
    return dispatch(employeeGroupActions.getByIdRequest(param));
  };
  const {onNotify} = useNotificationStore();
  //State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<any>(null);
  const [dataShow, setDataShow] = useState(null);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_EMPLOYEEGROUP);
  // Action
  const onOpenForm = (id?: any) => {
    setId(id);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setId(null);
  };

  //Handle Form
  const [, handleUpdateEmployee] = useUpdateEmployeeGroup(() => {
    onClose();
    resetAction();
    setReFetchId(true);
  });
  const [isSubmitLoading, handleCreate] = useCreateEmployeeGroup(() => {
    onClose();
    resetAction();
  });

  // Permission
  const [, handleUpdate] = useUpdateEmployeePolicy();
  const [resources, isResourcesLoading] = useResourcesEmployee();
  useEffect(() => {
    if (!groupId && groups.length && currentTab === 'employee/group') {
      navigate(`/employee/group/${groups[0]._id}`);
    };
  }, [groups, pathname, groupId]);

  const onSelectGroup = ({ key }: any) => {
    const nextPath = `/employee/group/${key}`;
    navigate(nextPath);
  };

  const onPermisionChange = ({
    isAssgined,
    resource,
    action,
  }: onPermissionChangeProps) => {
    try {
      if (!canUpdate) return;
      handleUpdate({ isAssgined, resource, action, groupId });
      updateGroup({ isAssgined, resource, action }); // update Group in store redux
    } catch (error: any) {
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
    <>
     <Row gutter={10} className="group_permission" >
        <Col span={6} className="group_permission__list">
          <h6 className="group_permission__list-title">Nhóm người dùng</h6>
          <div className="group_permission__list__menu">
            <Menu
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

        <Col span={18} ref={refRight} className="group_permission__content">
            <div className="group_permission__content__header">
              <h5 className="group_permission__list-title ">Thiết lập quyền</h5>
              {!isLoading && (
                <Flex
                  gap="small"
                  wrap="wrap"
                  style={{
                    alignContent: "center",
                  }}
                >
                  <WithOrPermission permission={[POLICIES.DELETE_EMPLOYEEGROUP]}>
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
                  <WithOrPermission permission={[POLICIES.UPDATE_EMPLOYEEGROUP]}>
                    <Button
                      size="small"
                      onClick={() => onOpenForm(groupId)}
                      type="primary"
                      style={styleButton}
                    >
                      <EditOutlined /> Cập nhật
                    </Button>
                  </WithOrPermission>
                  <WithOrPermission permission={[POLICIES.WRITE_EMPLOYEEGROUP]}>
                    <Button
                      style={styleButton}
                      size="small"
                      onClick={() => onOpenForm(null)}
                      type="primary"
                    >
                      <PlusOutlined /> Tạo mới
                    </Button>
                  </WithOrPermission>
                </Flex>
              )}
            </div>
            <SelectSearch
            style={{marginBottom:10}}
              showSelect={false}
              placeholder="tên quyền"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchPermissions(e.target.value, resources, setDataShow)
              }
              permissionKey={[POLICIES.WRITE_USER]}
            />
            <Table
              sticky={{
                offsetHeader:0,
                getContainer:()=> refRight.current as any}}
              columns={columns}
              dataSource={dataShow ?? resources}
              className="employee-group__table"
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `Tổng cộng: ${total} `,
                size: "small",
                
              }}
              style={{
                marginBottom:10
              }}
            />
        </Col>
      </Row>
        <Modal
            open={isOpen}
            footer={[]}
            onCancel={onClose}
            className="form-modal__user-group"
            afterClose={() => {
                if (reFetchId) {
                  reFetchGroup();
              };
              setReFetchId(false);
            }}
      >
        <EmployeeGroupForm
          isOpen={isOpen} 
          onClose={onClose}
          id={id} 
          setReFetch={setReFetch} 
          reFetch={reFetch}
          handleCreate={handleCreate}
          handleUpdateEmployee={handleUpdateEmployee}
          setReFetchId={setReFetchId}
        />
        </Modal>
    </>
  );
};

export default EmployeeGroup;
