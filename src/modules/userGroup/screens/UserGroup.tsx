import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Flex, Menu, Popconfirm, Row, Skeleton, Table } from "antd";
import { useState } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import SelectSearch from "~/components/common/SelectSearch";
import UserGroupForm from "../components/UserGroupForm";
import { get } from "lodash";

const styleButton = {
  alignContent: "center",
};
interface UserGroupProps {}

interface PermissionProps {
  isActive: boolean;
  onChange: any;
  disabled: boolean;
};

interface onPermisionChangeProps {
  resource: any;
  action: any;
  isAssgined: boolean;
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
const UserGroup = ({ }: UserGroupProps) => {
  const { groupId }: any = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  //State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [id, setId] = useState<any>(null);
  const [dataShow,setDataShow] = useState(null)

  // Action

  // const [resources, isResourcesLoading] = useResources();

  const onOpenForm = (id?: any) => {
    setId(id);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setId(null);
  };
  const onSelectGroup = ({ key }: any) => {
    const nextPath = `${getNextPath(pathname)}/${key}`;
    navigate(nextPath);
  };

  // const onPermisionChange = ({isAssgined, resource, action}: onPermisionChangeProps) => {
  //   try {
  //     // if(!canUpdate) return
  //     const newPolicies = getNewPolicies(group,isAssgined, resource, action)
  //     // updateGroup({...group,policies :newPolicies }) // update Group in store redux
  //     // handleUpdate({ isAssgined, resource, action, groupId });
  //   } catch (error) {
  //     toastr.error(get(error,'message','Some error'))
  //   }
  // };

  // const renderPermission = (action : any, rc:any) => {
  //   const admin = group?.policies?.[rc.resource.key]?.['admin'];
  //   return (
  //     <Permission
  //       isActive={group?.policies?.[rc.resource.key]?.[action.key]}
  //       onChange={(event :any ) =>
  //         onPermisionChange(event.target.checked, rc.resource.key, action.key)
  //       }
  //       // disabled={(!canUpdate || admin) && action.key !== 'admin'}
  //     />
  //   );
  // };

  // const columns = useResourceColumns(renderPermission);


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
              {/* {isLoading
                ? [1, 2, 3, 4].map((index) => (
                    <Skeleton.Input
                      active
                      key={index}
                      style={{ marginBottom: 10 }}
                    />
                  ))
                : groups.map(({ name, _id } : any) => (
                    <Menu.Item key={_id}>{name} </Menu.Item>
                  ))} */}
            </Menu>
          </div>
        </Col>

        <Col span={17}>
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
          <SelectSearch showSelect={false} placeholder="tên quyền"/>
        </Col>
      </Row>
      <Table
      columns={[]}
      />
      <UserGroupForm
        isOpen={isOpen}
        onClose={onClose}
      />
    </div>
  );
};

export default UserGroup;
