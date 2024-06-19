import { ColumnsType } from "antd/es/table/InternalTable";
import WhiteBox from "~/components/common/WhiteBox";
import {
  useConvertEmployee,
  useAddProductEmployee,
  useCreateEmployee,
  useDeleteEmployee,
  useEmployeePaging,
  useEmployeeQueryParams,
  useGetEmployee,
  useGetEmployees,
  useRemoveProductEmployee,
  useResetStateEmployee,
  useUpdateEmployee,
  useUpdateEmployeeParams,
  useUpdateProductEmployee,
} from "../employee.hook";
import { Button, Checkbox, Col, Modal, Popconfirm, Row, Switch, Tag , Tabs } from "antd";
import { useMemo, useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import TableAnt from "~/components/Antd/TableAnt";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WithOrPermission from "~/components/common/WithOrPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { useDispatch } from "react-redux";
import { employeeSliceAction } from "../redux/reducer";
import ExportExcelButton from "~/modules/export/component";
import useCheckBoxExport from "~/modules/export/export.hook";
import { useChangeDocumentTitle } from "~/utils/hook";
import { PROCESS_STATUS, PROCESS_STATUS_VI } from "~/constants/defaultValue";
import ExpandRowEmployee from "../components/ExpandRowEmployee";

import CollaboratorProduct from "~/modules/collaborator/components/CollaboratorProduct";
import apis from '../employee.api';
import WithPermission from "~/components/common/WithPermission";
import { Link } from "react-router-dom";
interface Props {
  currentTab: any;
};
interface ColumnActionProps {
  _id: string;
  deleteEmpolyee?: any;
  updateEmployee?: any;
  shouldShowDevider?: any;
  onOpenForm?: any;
  status: string
  processStatus?: any,
};
const ColumnActions = ({
  _id,
  deleteEmpolyee,
  updateEmployee,
  shouldShowDevider,
  onOpenForm,
  status,
  processStatus,
}: ColumnActionProps) => {
  return (
    <div className="custom-table__actions">
      <WithOrPermission permission={[POLICIES.UPDATE_EMPLOYEE]}>
        {processStatus === "APPROVED" ? (
          <Switch
            style={{ marginRight: 10 }}
            checked={status === "ACTIVE"}
            onChange={(e) =>
              updateEmployee({
                _id,
                status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
              })
            }
          />
        ) : (
          <></>
        )}
        {/* <Switch
          style={{marginRight: 10}}
          checked={status === 'ACTIVE'}
          onChange={(e)=> updateEmployee({_id, status: status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'})}
        /> */}
      </WithOrPermission>
      {shouldShowDevider && <p>|</p>}
      <WithOrPermission permission={[POLICIES.DELETE_EMPLOYEE]}>
      <Popconfirm
        title="Bạn muốn xoá người dùng này?"
        onConfirm={() => deleteEmpolyee(_id)}
        okText="Xoá"
        cancelText="Huỷ"
      >
        <p>Xóa</p>
      </Popconfirm>{" "}
      </WithOrPermission>
    </div>
  );
};

export default function Employee({ currentTab }: Props) {
  useResetStateEmployee();
  const [destroy,setDestroy] = useState(false);
  //State
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [id, setId] = useState(null);
  //Fetch
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(employeeSliceAction.resetAction());
  };

  const [query] = useEmployeeQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateEmployeeParams(query);
  const [data, isLoading] = useGetEmployees(query);
  const paging = useEmployeePaging();
  const isCanDelete = useMatchPolicy(POLICIES.DELETE_EMPLOYEE);
  const isCanUpdate = useMatchPolicy(POLICIES.UPDATE_EMPLOYEE);
  const shouldShowDevider = useMemo(() => isCanDelete && isCanUpdate, [isCanDelete, isCanUpdate]);
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_UNIT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const [itemActive, setItemActive] = useState<any>();

  //Handle
  const handleOpenModal = (id?: any) => {
    setIsOpenModal(true);
    setId(id);
    id && setDestroy(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setId(null);
    setDestroy(false);
  };

  const [, handleUpdate] = useUpdateEmployee(() => {
    handleCloseModal();
    resetAction();
  });
  const [, handleDelete] = useDeleteEmployee(resetAction);
  const [isSubmitLoading, handleCreate] = useCreateEmployee(() => {
    handleCloseModal();
    resetAction();
    setDestroy(true);
  });
  const [, convertEmployee] = useConvertEmployee(() => {
    handleCloseModal();
    resetAction();
  });
  const onConfirmProcess = (_id: any, processStatus: any) => {
    convertEmployee({
      _id,
      processStatus:
        processStatus === PROCESS_STATUS.NEW
          ? PROCESS_STATUS.APPROVED
          : PROCESS_STATUS.NEW,
    });
  };

  const columns: ColumnsType = [
    {
      title: 'Mã trình dược viên',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      align : 'center',
      render: (employeeNumber: any, record: any) => {
        return (
          <WithPermission permission={POLICIES.READ_EMPLOYEE}>
            <Link
              className="link_"
              to={`/employee/${record?._id}`}
            >
              {record?.employeeNumber}
            </Link>
          </WithPermission>
        );
      },
    },
    {
      title: 'Tên trình dược viên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (value: any, record: any) => (
        <Button type="link" onClick={() => handleOpenModal(record._id)}>{value}</Button>
      ),
    },
    ...(isCanUpdate
      ? [
          {
            title: "Xét duyệt",
            key: "processStatus",
            dataIndex: "processStatus",
            width: 200,
            render: (processStatus: any, record: any) => {             
              return (
                <WithOrPermission permission={[POLICIES.UPDATE_EMPLOYEE]}>
                  {processStatus === "NEW" ? (
                      <Popconfirm
                        title="Bạn muốn duyệt TDV này?"
                        onConfirm={() =>
                          onConfirmProcess(record?._id, processStatus)
                        }
                        okText="Duyệt"
                        cancelText="Huỷ"
                      >
                        <Button size="small" color="green">
                          {PROCESS_STATUS_VI["NEW"]}
                        </Button>
                      </Popconfirm>
                  ) : (
                    <Tag color="blue">{PROCESS_STATUS_VI["APPROVED"]}</Tag>
                  )}
                </WithOrPermission>
              );
            },
          },
        ]
      : []),

    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align : 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: "Được tạo bởi",
      dataIndex: "historyStatus",
      key: "historyStatus",
      render: (record) => {
        return record.NEW ? record.NEW.createdBy : record.APPROVED.createdBy;
      },
    },
    ...(isCanUpdate || isCanDelete
      ? [
          {
            title: "Thao tác",
            key: "action",
            render: (record: any) => {
              return (
                <ColumnActions
                  {...record}
                  // deleteUserEmployee={deleteUser}
                  shouldShowDevider={shouldShowDevider}
                  onOpenForm={() => handleOpenModal(record?._id)}
                  status={record?.status}
                  deleteEmpolyee={handleDelete}
                  updateEmployee={handleUpdate}
                  processStatus={record?.processStatus}
                />
              );
            },
          },
        ]
      : []),
    ...(canDownload
      ? [
          {
            title: "Lựa chọn",
            key: "_id",
            width: 80,
            align: "center" as any,
            render: (item: any, record: any) => {
              const id = record._id;
              return (
                <Checkbox
                  checked={arrCheckBox.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />
              );
            },
          },
        ]
      : []),
  ];

  useChangeDocumentTitle("Danh sách trình dược viên");
  return (
    <div>
      {/* <Breadcrumb title={t("Quản lý trình dược viên")} /> */}
      <WhiteBox>
        <SelectSearch
          showSelect={false}
          isShowButtonAdd
          handleOnClickButton={() => handleOpenModal()}
          onChange={setKeyword}
          onSearch={(e: any) => onParamChange({ keyword: e })}
          permissionKey={[POLICIES.WRITE_EMPLOYEE]}
          addComponent={
            canDownload ? (
              <Col>
                <ExportExcelButton
                  api="employee"
                  exportOption="employee"
                  query={query}
                  fileName="Danh sách trình dược viên"
                  ids={arrCheckBox}
                />
              </Col>
            ) : null
          }
        />
        <TableAnt
          dataSource={data?.length ? data : []}
          loading={isLoading}
          columns={columns}
          rowKey={(rc) => rc._id}
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
          expandable={{
            expandedRowRender: (record: any) => (
              <ExpandRowEmployee _id={record._id} />
            ),
            expandedRowKeys: [itemActive],
          }}
          onExpand={(expanded, record) => {
            expanded ? setItemActive(record._id) : setItemActive(null);
          }}
        />
      </WhiteBox>
      <Modal
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => setIsOpenModal(false)}
        className="form-modal"
        footer={null}
        width={1020}
        style={{ top: 50 }}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <Tabs
          destroyInactiveTabPane
          items={[
            {
              key: "1",
              label: "Hồ sơ",
              children: (
                <EmployeeForm
                  id={id}
                  handleCloseModal={handleCloseModal}
                  handleUpdate={handleUpdate}
                  resetAction={resetAction}
                  handleCreate={handleCreate}
                  isSubmitLoading={isSubmitLoading}
                />
              ),
            },
            {
              key: "2",
              label: "Sản phẩm giới thiệu",
              children: (
                <CollaboratorProduct
                  id={id}
                  useGetUser={useGetEmployee}
                  apiSearchProduct={apis.searchProduct}
                  config={{
                    discount : {
                      discountType : "PERCENT",
                      value : 45
                    }
                  }}
                  target='employee'
                />
              ),
              disabled: !id,
            },
          ]}
        ></Tabs>
      </Modal>
    </div>
  );
}
