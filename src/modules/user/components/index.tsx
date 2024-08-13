import { Button, Col, Modal, Popconfirm, Row, Select, Switch, Tag } from "antd";
import {
  useDeleteUser,
  useGetUsers,
  useResetGroups,
  useUpdateUser,
  useUpdateUserParams,
  useUserPaging,
  useUserQueryParams,
} from "../user.hook";
import { useEffect, useMemo, useState } from "react";
import UserForm from "./UserForm";
import { ColumnsType } from "antd/es/table";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import TableAnt from "~/components/Antd/TableAnt";
import { userSliceAction } from "../redux/reducer";
import { Link, useParams } from "react-router-dom";
import POLICIES, { CORE_ACTION, GROUP_POLICY } from "~/modules/policy/policy.auth";
import { DEFAULT_BRANCH_ID, } from "~/constants/defaultValue";
import { useGetUserGroups, } from "~/modules/userGroup/userGroup.hook";
import { get } from "lodash";
import { useDispatch } from "react-redux";
import WithOrPermission from "~/components/common/WithOrPermission";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { useChangeDocumentTitle } from "~/utils/hook";
import { pagingTable } from "~/utils/helpers";
interface UserProps {
  currentTab: string | undefined;
}
interface ColumnActionProps {
  _id?: any;
  deleteUserEmployee: any;
  shouldShowDevider: any;
  onOpenForm?: any;
  adapter?: any
}
const ColumnActions = ({
  _id,
  deleteUserEmployee,
  shouldShowDevider,
  onOpenForm,
  adapter
}: ColumnActionProps) => {
  return (
    <div className="custom-table__actions">
      <WithOrPermission permission={[POLICIES.UPDATE_USER]}>
      <p onClick={() => onOpenForm(_id)}>Sửa</p>
      </WithOrPermission>
      {  !adapter?.user?.isSuperAdmin && shouldShowDevider && <p>|</p>}
    {!adapter?.user?.isSuperAdmin &&   <WithOrPermission permission={[POLICIES.DELETE_USER]}>
        <Popconfirm
        title="Bạn muốn xoá người dùng này?"
          onConfirm={() =>{
            deleteUserEmployee(_id);
            console.log(1)
          }}
        okText="Xoá"
        cancelText="Huỷ"
      >
        <p>Xóa</p>
      </Popconfirm>{" "}
      </WithOrPermission>}
    </div>
  );
};

const UserEmployee = ({ currentTab }: UserProps) => {
  useResetGroups();
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(userSliceAction.resetAction());
  };
  const [id, setId] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [query, onTableChange] = useUserQueryParams();
  const [destroy,setDestroy] = useState(false);
  const [keyword, { setKeyword, onParamChange }] = useUpdateUserParams(query);
  const [data, isLoading] = useGetUsers(query);
  const paging = useUserPaging();
  const isCanUpdate = useMatchPolicy(POLICIES.UPDATE_USER);
  const isCanDelete = useMatchPolicy(POLICIES.DELETE_USER);
  const shouldShowDevider = useMemo(() => isCanDelete && isCanUpdate, [isCanDelete, isCanUpdate]);

  // groups
  const { branchId }: any = useParams();
  const branchIdParam = useMemo(
    () => ({ branchId: branchId ? branchId : DEFAULT_BRANCH_ID }),
    [branchId]
  );
  const [groups, isLoadingGroups] = useGetUserGroups(branchIdParam);
  const [options, setOptions] = useState([]);

  const handleOpenModal = (id?: any) => {
    setIsOpenModal(true);
    setId(id);
    id && setDestroy(true)
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setId(null);
    setDestroy(false)
  };

  const [, deleteUser] = useDeleteUser();
  const [, updateUser] = useUpdateUser(()=> {
    handleCloseModal();
    resetAction();
  });

  const onSearch = (e: any) => {
    setKeyword(e);
    onParamChange({ keyword: e });
  };

  useEffect(() => {
    setKeyword("");
  }, [currentTab]);
  useEffect(() => {
  setOptions(groups?.map((group: any) => ({ label: group?.name, value: group?._id }))); 
  }, [groups]);

  useChangeDocumentTitle("Quản lý người dùng")

  const columns: ColumnsType = [
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      render : (value,rc) => <Link className="link_" to={`/user-detail/${rc?._id}`}>
      {value}
    </Link>
    },
    {
      title: "Tên người dùng",
      dataIndex: "adapter",
      key: "username",
      render: (value) => <p>{value?.user?.username}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (value) => <p>{value}</p>,
    },
    {
      title: "Nhóm người dùng	",
      dataIndex: "adapter",
      key: "groups",
      render: (adapter, rc) => (
        <div className="speciality-tags">
          {adapter?.groups?.map((group: any, index: number) => {
            return (
              <Tag color="blue" key={index}>
                {group?.name}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 90,
      align: "center",
      render: (status, record: any) => {
        return(
          <Switch
          disabled={record?.adapter?.user?.isSuperAdmin}
          checked={status === "ACTIVE"}
          onChange={() =>
            updateUser({
              status: status === 'INACTIVE' ? "ACTIVE" : "INACTIVE",
              id: record?._id,
              userId: record?.adapter?.userId,
            })
          }
        />
      )},
    },
    ...(isCanUpdate || isCanDelete ?[{
      title: "Thao tác",
      key: "action",
      width: "110px",
      render: (record : any) => {
        return (
          <ColumnActions
            {...record}
            deleteUserEmployee={deleteUser}
            shouldShowDevider={shouldShowDevider}
            onOpenForm={() => handleOpenModal(record?._id)}
            adapter={record?.adapter}
          />
        );
      },
    }] : [])
  ];
  return (
    <div>
      <SelectSearch
        showSelect={true}
        onSearch={onSearch}
        isShowButtonAdd
        permissionKey={[POLICIES.WRITE_USER]}
        handleOnClickButton={() => handleOpenModal()}
        keyword={keyword}
        onChange={(e: any) => setKeyword(e.target.value)}
        options={options}
        onChangeSelect={(e: any) => onParamChange({ groupIds: e })}
        showSearchStatus
        onChangeStatus={(e: any) => onParamChange({ status: e})}
        valueStatus={get(query,"status",null)}
      />
      <TableAnt
        className="custom-table__shadow"
        dataSource={data?.length ? data : []}
        loading={isLoading}
        columns={columns}
        size="small"
        pagination={{
          ...paging,
          showTotal: (total) => `Tổng cộng: ${total}`,
          showSizeChanger: true
        }}
        onChange={({current, pageSize}: any)=> onTableChange({current, pageSize})}
        stickyTop
      />
      <Modal
        open={isOpenModal}
        onCancel={handleCloseModal}
        onOk={handleCloseModal}
        className="form-modal"
        footer={null}
        width={1020}
        style={{ top: 50 }}
        destroyOnClose={destroy}
        afterClose={() => setDestroy(false)}
        // title= {`${id ? "Cập nhật" : "Thêm mới"} nhân viên`}
      >
        <UserForm setDestroy={setDestroy} id={id} handleCloseModal={handleCloseModal} updateUser={updateUser} resetAction={resetAction} />
      </Modal>
    </div>
  );
};

export default UserEmployee;
