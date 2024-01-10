import { Button, Col, Modal, Popconfirm, Row, Select, Switch, Tag } from "antd";
import { useDeleteUser, useGetUsers, useUpdateUser, useUpdateUserParams, useUserPaging, useUserQueryParams } from "../../user.hook";
import { useState } from "react";
import UserForm from "../UserForm";
import { ColumnsType } from "antd/es/table";
import Search from "antd/es/input/Search";
import SelectSearch from "~/components/common/SelectSearch";
import TableAnt from "~/components/Antd/TableAnt";
import { useResetState } from "~/utils/hook";
import { userSliceAction } from "../../redux/reducer";
import { Link } from "react-router-dom";
import POLICIES from "~/modules/policy/policy.auth";

interface UserProps {
  activeTab: string,
};
interface ColumnActionProps {
  _id : any,
  deleteUserEmployee : any,
  shouldShowDevider : any,
  onOpenForm : any
};
const ColumnActions = ({
  _id,
  deleteUserEmployee,
  shouldShowDevider,
  onOpenForm
}: ColumnActionProps) => {
  return (
    <div className="custom-table__actions">
      {/* <WithPermission permission={POLICY.UPDATE_USER}> */}
        <p onClick={() => onOpenForm(_id)}>Sửa</p>
      {/* </WithPermission> */}
      {/* {shouldShowDevider && <p>|</p>} */}
      {/* <WithPermission permission={POLICY.DELETE_USER}> */}
        <Popconfirm
          title="Bạn muốn xoá người dùng này?"
          onConfirm={() => deleteUserEmployee(_id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <p>Xóa</p>
        </Popconfirm>{' '}
      {/* </WithPermission> */}
    </div>
  );
};

const UserEmployee = ({activeTab}: UserProps) => {
  useResetState(userSliceAction.resetAction);
  const [id, setId] = useState(null)
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [query] = useUserQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateUserParams(query);
  const [data, isLoading] = useGetUsers(query);
  const paging = useUserPaging();
  const [, deleteUser] = useDeleteUser();
  const [, updateUser] = useUpdateUser();
  const handleOpenModal = (id?: any) => {
    setIsOpenModal(true);
    setId(id);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setId(null);
  };

  const onSearch = (e: any) => {
    console.log(e)
  };

  const columns: ColumnsType = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      key: 'fullName'
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'adapater',
      key: 'username',
      render: (value) => <p>{value?.user?.username}</p>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (value) => <p>{value}</p>
    },
    {
      title: 'Nhóm người dùng	',
      dataIndex: 'employeeGroup',
      key: 'employeeGroup',
      render: (groups) => (
        <div className="speciality-tags">
        {groups?.map((group : any, index: number) => {
          return (
            <Tag color="blue" key={index}>
              {group?.name}
            </Tag>
          );
        })}
      </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      align: 'center',
      render: (status, record: any) => (
        <Switch
            checked={status === 'ACTIVE'}
            onChange={(value) =>
              updateUser({ status: value ? 'ACTIVE' : 'INACTIVE', id: record?._id, userId: record?.adapater?.userId})
            }
          />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '110px',
      render: (record) => {
        return (
          <ColumnActions
            {...record}
            deleteUserEmployee={deleteUser}
            // shouldShowDevider={shouldShowDevider}
            onOpenForm={()=> handleOpenModal(record?._id)}
          />
        );
      }
    }
  ];
console.log(POLICIES,'POLICIES.WRITE_USER')

  return (
    <div>
      <Row gutter={10} align="middle" style={{marginBottom: 10}}>
        <Col span={21}>
          <SelectSearch
            showSelect = {false}
            options={[]}
            onSearch={onSearch}
            isShowButtonAdd
            permissionKey={POLICIES.WRITE_USER}
          />
        </Col>
      </Row>
      <TableAnt
        dataSource={data?.length ? data : []}
        loading={isLoading}
        columns={columns}
        size="small"
        pagination={{
          ...paging,
          onChange(page, pageSize) {
            // onParamChange({ page, limit: pageSize });
          },
        }}
      />
        <Modal
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => setIsOpenModal(false)}
        className="form-modal"
        footer={null}
        width={1020}
        style={{ top: 50 }}
        destroyOnClose
        // title= {`${id ? "Cập nhật" : "Thêm mới"} nhân viên`}
      >
        <UserForm
          id={id}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default UserEmployee;
