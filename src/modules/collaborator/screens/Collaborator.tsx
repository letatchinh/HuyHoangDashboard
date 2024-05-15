import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { collaboratorActions } from "../redux/reducer";
import {
  useAddProductCollaborator,
  useCollaboratorPaging,
  useCollaboratorQueryParams,
  useConvertCollaborator,
  useCreateCollaborator,
  useDeleteCollaborator,
  useGetCollaborator,
  useGetCollaborators,
  useRemoveProductCollaborator,
  useResetCollaboratorAction,
  useUpdateCollaborator,
  useUpdateCollaboratorParams,
  useUpdateProductCollaborator,
} from "../collaborator.hook";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import useCheckBoxExport from "~/modules/export/export.hook";
import POLICIES from "~/modules/policy/policy.auth";
import { ColumnsType } from "antd/es/table";
import {
  Button,
  Checkbox,
  Col,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography,
} from "antd";
import WithOrPermission from "~/components/common/WithOrPermission";
import { useChangeDocumentTitle } from "~/utils/hook";
import WhiteBox from "~/components/common/WhiteBox";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import ExportExcelButton from "~/modules/export/component";
import TableAnt from "~/components/Antd/TableAnt";
import { get } from "lodash";
import {
  PROCESS_STATUS,
  PROCESS_STATUS_VI,
  STATUS,
} from "~/constants/defaultValue";
import CollaboratorForm from "../components/CollaboratorForm";
import moment from "moment";
import Breadcrumb from "~/components/common/Breadcrumb";
import CollaboratorProduct from "../components/CollaboratorProduct";
import CollaboratorAddress from "../components/CollaboratorAddress";
import apis from "~/modules/collaborator/collaborator.api";
import RequestGroup from "~/modules/requestGroup/components";

interface ColumnActionProps {
  _id: string;
  deleteCollaborator?: any;
  shouldShowDevider?: any;
  onOpenForm?: any;
  status: string;
  isLoading: boolean;
  currentTab?: any;
}
const ColumnActions = ({
  _id,
  deleteCollaborator,
  shouldShowDevider,
  onOpenForm,
}: ColumnActionProps) => {
  return (
    <div className="custom-table__actions">
      <WithOrPermission permission={[POLICIES.UPDATE_PARTNER]}>
        <p onClick={() => onOpenForm(_id)}>Sửa</p>
      </WithOrPermission>
      {shouldShowDevider && <p>|</p>}
      <WithOrPermission permission={[POLICIES.DELETE_PARTNER]}>
        <Popconfirm
          title="Bạn muốn xoá CTV này?"
          onConfirm={() => deleteCollaborator(_id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <p>Xóa</p>
        </Popconfirm>{" "}
      </WithOrPermission>
    </div>
  );
};

type propsType = {
  currentTab?: any;
};
export default function Collaborator({
  currentTab,
}: propsType): React.JSX.Element {
  useResetCollaboratorAction();
  //State
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [destroy,setDestroy] = useState(false);
  //Fetch
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(collaboratorActions.resetAction());
  };

  const [query] = useCollaboratorQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateCollaboratorParams(query);
  const [data, isLoading] = useGetCollaborators(query);
  const paging = useCollaboratorPaging();
  
  const isCanDelete = useMatchPolicy(POLICIES.DELETE_PARTNER);
  const isCanUpdate = useMatchPolicy(POLICIES.UPDATE_PARTNER);
  const shouldShowDevider = useMemo(
    () => isCanDelete && isCanUpdate,
    [isCanDelete, isCanUpdate]
  );
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_PARTNER);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();

  //Handle
  const handleOpenModal = (id?: any) => {
    setIsOpenModal(true);
    setId(id);
    if(id){
      setDestroy(true);
    }
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setId(null);
  };

  const [, handleUpdate] = useUpdateCollaborator(() => {
    handleCloseModal();
    resetAction();
  });
  const [, convertCollaborator] = useConvertCollaborator(() => {
    handleCloseModal();
    resetAction();
  });
  const [, handleDelete] = useDeleteCollaborator(resetAction);
  const [isSubmitLoading, handleCreate] = useCreateCollaborator(() => {
    handleCloseModal();
    resetAction();
    setDestroy(true);
  });

  const onChangeStatus = (
    _id: any,
    status: any,
    // isSubmitLoading: any,
    // record: any,
  ) => {
    handleUpdate({
      _id,
      status,
      // isSubmitLoading,
      // ...omit(record, ["_id", "referralCode"]),
    });
  };

  const onConfirmProcess = (_id: any, processStatus: any) => {
    convertCollaborator({
      _id,
      processStatus:
        processStatus === PROCESS_STATUS.NEW
          ? PROCESS_STATUS.APPROVED
          : PROCESS_STATUS.NEW,
    });
  };
  const columns: ColumnsType = [
    {
      title: "Mã cộng tác viên",
      dataIndex: "partnerNumber",
      key: "partnerNumber",
      // render: (value: any, record: any) => (
      //   <Button type="link" onClick={() => handleOpenModal(record._id)}>
      //     {value}
      //   </Button>
      // ),
    },
    {
      title: "Tên cộng tác viên",
      dataIndex: "fullName",
      key: "fullName",
      render : (value: any, record: any) => <Typography.Link onClick={() => handleOpenModal(get(record,'_id'))}>{value}</Typography.Link>
    },
    ...(isCanUpdate
      ? [
          {
            title: "Xét duyệt",
            key: "processStatus",
            dataIndex: "processStatus",
            width: 90,
            align : 'center',
            render: (processStatus: any, record: any) => {             
              return (
                <WithOrPermission permission={[POLICIES.UPDATE_PARTNER]}>
                  {processStatus === "NEW" ? (
                      <Popconfirm
                        title="Bạn muốn duyệt CTV này?"
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
        ] as ColumnsType
      : []),
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      render: (record) => {
        return moment(record).format("DD/MM/YYYY");
      },
    },
    {
      title: "Người mời ",
      dataIndex: "parent",
      key: "parent",
      render: (record) => {
        return record?.fullName;
      },
    },
    ...(isCanUpdate
      ? [
          {
            title: "Trạng thái",
            key: "status",
            dataIndex: "status",
            width: 100,
            render: (status: any, record: any) => {
              return (
                <WithOrPermission permission={[POLICIES.UPDATE_PARTNER]}>
                  {record?.processStatus === "APPROVED" ? (
                    <Switch
                      checked={status === "ACTIVE"}
                      onChange={(value) =>
                        onChangeStatus(
                          get(record, "_id"),
                          value ? STATUS["ACTIVE"] : STATUS["INACTIVE"],
                          // isSubmitLoading,
                          // record
                        )
                      }
                    />
                  ) : (
                    <></>
                  )}
                </WithOrPermission>
              );
            },
          },
        ]
      : []),
    ...(isCanUpdate || isCanDelete
      ? [
          {
            title: "Thao tác",
            key: "action",
            render: (record: any) => {
              return (
                <ColumnActions
                  {...record}
                  deleteCollaborator={handleDelete}
                  shouldShowDevider={shouldShowDevider}
                  onOpenForm={() => handleOpenModal(record?._id)}
                  status={record?.status}
                  isLoading={isLoading}
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

  useChangeDocumentTitle("Danh sách cộng tác viên");

  const onChange = (e: any) => {
    onParamChange({ ...query, processStatus: e.target.value});
  };
  return (
    <>
        <Row className="mb-3" justify={"space-between"}>
          <SelectSearch
            showSelect={false}
            isShowButtonAdd
            handleOnClickButton={() => handleOpenModal()}
            onChange={(e: any) => setKeyword(e.target.value)}
            keyword={keyword}
            onSearch={(e: any) => onParamChange({ keyword: e })}
            permissionKey={[POLICIES.WRITE_PARTNER]}
            addComponent={
              canDownload ? (
                <Col>
                  <ExportExcelButton
                    api="partner"
                    exportOption="partner"
                    query={query}
                    fileName="Danh sách cộng tác viên"
                    ids={arrCheckBox}
                  />
                </Col>
              ) : null
            }
          />
        </Row>
        <WithOrPermission permission={[POLICIES.UPDATE_PARTNER]}>
          <Space style={{ marginBottom: 20, marginTop: 20 }}>
            <Typography style={{ fontSize: 14, marginRight: 20 }}>
              Phân loại trạng thái theo :
            </Typography>
            <Row gutter={14}>
              <Radio.Group
                onChange={onChange}
                optionType="button"
                buttonStyle="solid"
                defaultValue={query?.processStatus || null}
              >
                <Radio.Button value={null}>Tất cả</Radio.Button>
                <Radio.Button value={"NEW"}>
                  {PROCESS_STATUS_VI["NEW"]}
                </Radio.Button>
                <Radio.Button value={"APPROVED"}>
                  {PROCESS_STATUS_VI["APPROVED"]}
                </Radio.Button>
              </Radio.Group>
            </Row>
          </Space>
        </WithOrPermission>
        <TableAnt
          dataSource={data?.length ? data : []}
          loading={isLoading}
          columns={columns}
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
        />
      <Modal
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        onOk={() => setIsOpenModal(false)}
        className="form-modal modalScroll"
        footer={null}
        width={1020}
        centered
        // style={{ top: 50 }}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}
      >
        <h4>{`${!id ? "Tạo mới " : "Cập nhật"}`} cộng tác viên</h4>
        <Tabs
          destroyInactiveTabPane
          items={[
            {
              key: "1",
              label: "Hồ sơ",
              children: (
                <CollaboratorForm
                  id={id}
                  handleCloseModal={handleCloseModal}
                  handleUpdate={handleUpdate}
                  handleCreate={handleCreate}
                  isSubmitLoading={isSubmitLoading}
                />
              ),
            },
            {
              key: "2",
              label: "Sản phẩm đảm nhiệm",
              children: (
                <CollaboratorProduct
                  id={id}
                  useGetUser={useGetCollaborator}
                  apiSearchProduct={apis.searchProduct}
                  target='partner'
                />
              ),
              disabled: !id,
            },
            {
              key: "3",
              label: "Sổ địa chỉ",
              children: <CollaboratorAddress id={id} />,
              disabled: !id,
            },
            {
              key: "4",
              label: "Yêu cầu",
              children: <RequestGroup.CreateAndView id={id} mode="one" />,
              disabled: !id,
            },
          ]}
        ></Tabs>
      </Modal>
    </>
  );
}
