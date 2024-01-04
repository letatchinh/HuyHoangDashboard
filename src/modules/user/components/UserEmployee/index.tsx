import { Button, Col, Modal, Popconfirm, Row, Select, Tag } from "antd";
import { useDeleteUser, useGetUseres, useUpdateUserParams, useUserPaging, useUserQueryParams } from "../../user.hook";
import { useState } from "react";
import UserForm from "../UserForm";
import { ColumnsType } from "antd/es/table";
import Search from "antd/es/input/Search";
import SelectSearch from "~/components/common/SelectSearch";
import TableAnt from "~/components/Antd/TableAnt";

interface UserEmployeeProps {
  setId: any,
  id?: string | null,
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

const UserEmployee = ({setId, id}: UserEmployeeProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [query] = useUserQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
  useUpdateUserParams(query);
  const [data, isLoading] = useGetUseres();
  const paging = useUserPaging();
  const [, deleteUser] = useDeleteUser();
  
  const handleOpenModal = (id?: string) => {
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
      dataIndex: 'username',
      key: 'username',
      render: (username) => <p>{username}</p>
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
        {groups.map((group : any, index: number) => {
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


  return (
    <div>
      <Row gutter={10} align="middle" style={{marginBottom: 10}}>
        <Col span={21}>
          <SelectSearch
            showSelect = {false}
            options={[]}
            onSearch={onSearch}
          />
        </Col>
        <Col span={3}>
          <Button type="primary" onClick={() => handleOpenModal()}>
            Thêm mới
          </Button>
        </Col>
      </Row>
      <TableAnt
        dataSource={[]}
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
