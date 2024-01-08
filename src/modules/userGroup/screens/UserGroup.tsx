import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Flex, Menu, Popconfirm, Row, Skeleton, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import SelectSearch from "~/components/common/SelectSearch";
import UserGroupForm from "../components/UserGroupForm";
import { get } from "lodash";
import {  onSearchPermissions, useGetUserGroup, useGetUserGroups, useResourceColumns } from "../userGroup.hook";
import { getNewPolicies, useResources, useUpdatePolicy } from "~/modules/policy/policy.hook";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import toastr from "toastr";
import { useProfile } from "~/modules/auth/auth.hook";
import POLICIES from "~/modules/policy/policy.auth";

const styleButton = {
  alignContent: "center",
};
interface UserGroupProps { 
  activeTab: string;
};

interface PermissionProps {
  isActive?: boolean;
  onChange?: any;
  disabled?: boolean;
};

interface onPermissionChangeProps {
  resource?: any;
  action?: any;
  isAssgined?: boolean;
};
const Permission = ({ isActive, onChange,disabled }: PermissionProps) => {
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

const UserGroup = () => {
  const {branchId, groupId }: any = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const branchIdParam = useMemo(() => ({ branchId : branchId ? branchId : DEFAULT_BRANCH_ID }), [branchId]);
  const [groups, isLoading] = useGetUserGroups(branchIdParam);
  const params = useMemo(() => {
    return groupId ? { groupId, branchId } : null;
  }, [groupId, branchId]);
  const [group, isLoadingGroup, updateGroup] = useGetUserGroup(params);
  const [, handleUpdate] = useUpdatePolicy();
  
  //State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<any>(null);
  const [dataShow,setDataShow] = useState(null)
  const canUpdate = true;
  // Action

  const profile = useProfile();
  console.log(profile,'profile')

  const [resources, isResourcesLoading] = useResources();

  useEffect(() => {
    if (!groupId && groups.length) {
      navigate(`${pathname}/${groups[0]._id}`);
    };
  }, [groups, pathname, groupId]);

  const onOpenForm = (id?: any) => {
    setId(id);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setId(null);
  };
  const onSelectGroup = ({ key }: any) => {
    const nextPath = `${pathname}/${key}`;
    navigate(nextPath);
  };

  const onPermisionChange = ({ isAssgined, resource, action }: onPermissionChangeProps) => {
    try {
      if (!canUpdate) return;
      updateGroup({isAssgined, resource, action }) // update Group in store redux
      handleUpdate({ isAssgined, resource, action, groupId });
    } catch (error) {
      toastr.error(get(error,'message','Some error'))
    }
  };
  const renderPermission = (key: string) => (action: any, rc: any) => {
    const admin = group?.policies?.[rc.key]?.includes('admin');
    return (
      <Permission
        isActive={group?.policies?.[rc.key]?.includes(key)}
        onChange={(event: any) =>{
          onPermisionChange({ isAssgined: event.target.checked, resource: rc.key, action: key })}
        }
        disabled={(!canUpdate || admin) && key !== 'admin'}
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
                : groups.map(({ name, _id } : any) => (
                    <Menu.Item key={_id}>{name} </Menu.Item>
                  ))}
            </Menu>
          </div>
        </Col>
        
        <Col span={17}>
      <div className="employee-group__content">

          <div className="employee-group__header">
            <h5 className="employee-group__list-title ">Thiết lập quyền</h5>
            <Flex
              gap="small"
              wrap="wrap"
              style={{
                alignContent: "center",
              }}
            >
              {/* <WithPermission permission={POLICY.DELETE_USERGROUP}> */}
              <Popconfirm
                title="Bạn muốn xoá chi nhánh này?"
                // onConfirm={() => deleteGroup(group._id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button size="small" type="primary" danger style={styleButton}>
                  <DeleteOutlined /> Xoá
                </Button>
              </Popconfirm>{" "}
              {/* </WithPermission> */}
              {/* <WithPermission permission={POLICY.UPDATE_USERGROUP}> */}
              <Button
                size="small"
                // onClick={() => onOpenForm(group)}
                type="primary"
              >
                <EditOutlined /> Cập nhật
              </Button>
              {/* </WithPermission> */}
              {/* <WithPermission permission={POLICY.WRITE_USERGROUP}> */}
              <Button
                size="small"
                onClick={() => onOpenForm({})}
                type="primary"
              >
                <PlusOutlined /> Tạo mới
              </Button>
              {/* </WithPermission> */}
            </Flex>
          </div>
            <SelectSearch
              showSelect={false}
              placeholder="tên quyền"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchPermissions(e.target.value, resources, setDataShow)}
              permissionKey={POLICIES.WRITE_USER}
            />
          <Table
            columns={columns}
              dataSource={resources}
              className="employee-group__table"
            />
            </div>
        </Col>
      </Row>
      <UserGroupForm
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default UserGroup;
