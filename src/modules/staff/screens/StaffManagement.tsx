import { ColumnsType } from "antd/es/table";
import React, { useRef } from "react";
import { UserInterface } from "../staff.modal";
import TableAnt from "~/components/common/Antd/TableAnt";
import { Button, Modal, Row, Spin, Switch } from "antd";
import {
  useCreateStaff,
  useDeleteStaff,
  useGetStaffs,
  useResetStaffAction,
  useStaffQueryParams,
  useUpdateStaff,
  useUpdateStaffParams,
} from "../staff.hook";
import { PlusOutlined } from "@ant-design/icons";
import StaffForm from "../components/StaffForm";
import ColumnsActions from "../components/ColumnsActions";
import { useDispatch } from "react-redux";
import { staffActions } from "../redux/reducer";
import AddStaffGroup from "../components/AddStaffGroup";
type propsType = {};
export default function StaffManagement(props: propsType): React.JSX.Element {
  useResetStaffAction();
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(staffActions.resetAction());
  };
  const [queryParams] = useStaffQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateStaffParams(queryParams);
  const [data, isLoading] = useGetStaffs(queryParams);

  const callback = () => {
    onCloseModal();
    resetAction();
  };
  const [, updateStaff] = useUpdateStaff(() => {resetAction()});
  const [, deleteStaff] = useDeleteStaff(() => {callback()});
  const [, createStaff] = useCreateStaff(() => {resetAction()});

  const [modal, contextHolder] = Modal.useModal();
  const refModalNow = useRef<any>();
  const onCloseModal = () => {
    refModalNow.current.destroy();
  };
  const onOpenModal = (id?: string | null, isUpdate: boolean = true ) => {
    refModalNow.current = modal.info({
      content: isUpdate ? <StaffForm onClose={onCloseModal} id={id} onCreate={createStaff} onUpdate={updateStaff} /> : <AddStaffGroup id={id} />,
      onCancel: onCloseModal,
      footer: null,
      closable: true,
      maskClosable: true,
      width:  isUpdate ? "90vw" : "30rem",
      title: isUpdate ? 'Cập nhật nhân viên' : 'Cập nhật nhóm quyền nhân viên',
    });
  };

  const columns: any = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "left",
      render: (fullName: any, record: any) => {
        return (
          <Button type="link" onClick={() => onOpenModal(record?._id)}>{fullName}</Button>
        );
      }
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "left",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status: any, record: any) => {
        return (
          <Switch
            // disabled={!isCanUpdate || record?.adapter?.user?.isSuperAdmin}
            checked={status === "ACTIVE"}
            onChange={() =>
              updateStaff({
                status: status === "INACTIVE" ? "ACTIVE" : "INACTIVE",
                id: record?._id,
                userId: record?.adapter?.userId,
              })
            }
          />
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      width: 150,
      render: (record: any) => {
        return (
          <ColumnsActions
            {...record}
            delete={deleteStaff}
            // shouldShowDevider={shouldShowDevider}
            onOpenForm={onOpenModal}
            adapter={record?.adapter}
          />
        );
      },
    },
  ];
  return (
    <>
      {contextHolder}
      {isLoading ? (
        <Spin />
      ) : (
        <>
            <Row style={{ width: "100%", position: 'relative'}} align={"middle"}>
              <Button icon ={<PlusOutlined/>} onClick={() => onOpenModal(null)}>Thêm mới</Button>
          </Row>
          <TableAnt dataSource={data} columns={columns} loading={isLoading} />
        </>
      )}
    </>
  );
}
