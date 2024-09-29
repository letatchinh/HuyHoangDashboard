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
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useGetPermissionByStaffGroup, useUpdatePolicy, useUpdateResourceRedux } from "~/modules/policy/policy.hook";
import {
  permissionResources,
} from "~/modules/policy/policy.modal";
import useNotificationStore from "~/store/NotificationContext";
import StaffGroupsForm from "../components/StaffGroupsForm";
import {
  onSearchPermissions,
  useCreateStaffGroup,
  useDeleteStaffGroup,
  useGetStaffGroups,
  useResetStaffGroupsAction,
  useStaffGroupsQueryParams,
  useUpdateStaffGroup,
  useUpdateStaffGroupsParams,
} from "../staffGroups.hook";
import Search from "antd/es/transfer/search";
import { ColumnsType } from "antd/es/table";
type propsType = {};
const styleButton = {
  alignContent: "center",
  display: "flex",
  alignItems: "center",
};

export default function StaffGroups(props: propsType): React.JSX.Element {
  useResetStaffGroupsAction();
  const [reFetch, setReFetch] = useState(false);
  const refRight = useRef<any>();
  const [dataShow, setDataShow] = useState<any>(null);
  const { onNotify } = useNotificationStore();
  const [groupId, setGroupId] = useState<any>(null);
  const [groups, isLoadingGroup] = useGetStaffGroups();
  const [query] = useStaffGroupsQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateStaffGroupsParams(query);
  const param = useMemo(() => groupId, [groupId]);
  const [permission] = useGetPermissionByStaffGroup(param);
  const [,updateResourceRedux] = useUpdateResourceRedux()
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

  const onChangePermission = (isActive: boolean, action: string, resource: string) => {
    const handleUpdatePolicyColumns = (e: any) => {
      const isChecked = e.target.checked;
      try {
        if (!canUpdate) return;
        const submitData: permissionResources = {
          resource,
          action,
          roleId: param,
          isAssigned: isChecked,
        };
        updateResourceRedux(submitData); // update Group in store redux
        handleUpdatePolicy(submitData);
      } catch (error) {
        console.log(error,'error')
        onNotify?.error(get(error, "message", "Some error"));
      };
    };
    return (
      <Checkbox checked={isActive} onChange={handleUpdatePolicyColumns}/>
    )
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


  const columns : ColumnsType = [
    {
      title: "Đọc",
      dataIndex: "read",
      key: "read",
      align: "center",
      render: (value: boolean, record: any)=>{
        return onChangePermission(value, "read", record?.key);
      }
    },
    {
      title: "Thêm mới",
      dataIndex: "write",
      key: "write",
      align: "center",
      render: (value: boolean, record: any)=>{
        return  onChangePermission(value, "write", record?.key);
      }
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "update",
      key: "update",
      align: "center",
      render: (value: boolean, record: any)=>{
        return  onChangePermission(value, "update", record?.key);
      }
    },
    {
      title: "Xoá",
      dataIndex: "delete",
      key: "delete",
      align: "center",
      render: (value: boolean, record: any)=>{
        return  onChangePermission(value, "delete", record?.key);
      }
    },
    {
      title: "Quản trị",
      dataIndex: "admin",
      key: "admin",
      align: "center",
      render: (value: boolean, record: any)=>{
        return  onChangePermission(value, "admin", record?.key);
      }
    },
  ];

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSearchPermissions(e.target.value, permission, setDataShow)
            }
          />
          <Table
            sticky={{
              offsetHeader: 0,
              getContainer: () => refRight.current as any,
            }}
            columns={columns}
            dataSource={(dataShow || permission || [])}
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
