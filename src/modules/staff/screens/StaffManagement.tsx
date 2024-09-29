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
type propsType = {};
export default function StaffManagement(props: propsType): React.JSX.Element {
  useResetStaffAction();
  const [queryParams] = useStaffQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateStaffParams(queryParams);
  const [data, isLoading] = useGetStaffs(queryParams);

  const callback = () => {
    onCloseModal();
  };
  const [, updateStaff] = useUpdateStaff(() => {callback()});
  const [, deleteStaff] = useDeleteStaff(() => {callback()});
  const [, createStaff] = useCreateStaff(() => {callback()});

  const [modal, contextHolder] = Modal.useModal();
  const refModalNow = useRef<any>();
  const onCloseModal = () => {
    refModalNow.current.destroy();
  };
  const onOpenModal = (id?: string | null) => {
    refModalNow.current = modal.info({
      content: <StaffForm onClose={onCloseModal} id={id} onCreate={createStaff} onUpdate={updateStaff} />,
      onCancel: onCloseModal,
      footer: null,
      closable: true,
      maskClosable: true,
      width: "90vw",
      title: "",
    });
  };

  const columns: any = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "left",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
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
      width: "110px",
      align: "center",
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
