import React, { useCallback, useMemo, useState } from "react";
import {
  useDeleteGroupPharmacy,
  useGetGroupsPharmacy,
  useGroupPharmacyPaging,
  useGroupPharmacyQueryParams,
  useUpdateGroupPharmacy,
  useUpdateGroupPharmacyParams,
} from "../groupPharmacy.hook";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import useCheckBoxExport from "~/modules/export/export.hook";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import WithPermission from "~/components/common/WithPermission";
import {
  Button,
  Checkbox,
  Col,
  Popconfirm,
  Radio,
  Row,
  Space,
  Switch,
  Typography,
} from "antd";
import { get, omit } from "lodash";
import { STATUS, STATUS_NAMES } from "~/constants/defaultValue";
import Breadcrumb from "~/components/common/Breadcrumb";
import Search from "antd/es/input/Search";
import { useChangeDocumentTitle } from "~/utils/hook";
import { PlusCircleOutlined } from "@ant-design/icons";
import ExportExcelButton from "~/modules/export/component";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import ModalAnt from "~/components/Antd/ModalAnt";
import { GroupPharmacyForm } from "./GroupPharmacyForm";
type propsType = {};
export default function GroupPharmacy(props: propsType): React.JSX.Element {
  const [query] = useGroupPharmacyQueryParams();
  const [destroy,setDestroy] = useState(false);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateGroupPharmacyParams(query);
  const [pharmacies, isLoading] = useGetGroupsPharmacy(query);

  const onCloseForm = useCallback(() => {
    setGroupPharmacyId(null);
    setIsOpenForm(false);
  }, []);

  const [, updateGroupPharmacy] = useUpdateGroupPharmacy(onCloseForm);
  const [isSubmitLoading, deleteGroupPharmacy] = useDeleteGroupPharmacy();
  const [groupPharmacyId, setGroupPharmacyId] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const paging = useGroupPharmacyPaging();
  const canWriteVoucher = useMatchPolicy(POLICIES.WRITE_CUSTOMER);
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_CUSTOMER);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();

  const onOpenForm = useCallback(
    (id?: any) => {
      if (id) {
        setGroupPharmacyId(id);
        setDestroy(true);
      }
      setIsOpenForm(true);
    },
    [setGroupPharmacyId, setIsOpenForm]
  );

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã nhóm khách hàng",
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: "Hệ số",
        dataIndex: "rateType",
        key: "rateType",
        width: 120,
      },
      
      {
        title: "Tên nhóm khách hàng",
        dataIndex: "title",
        key: "title",
        width: 220,
      },
      {
        title: "Loại khách hàng",
        dataIndex: "customerGroup",
        key: 'title',
        width: 220,
        render(value, record) {
          return <Typography.Text>{value?.title}</Typography.Text>;
        },
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 120,
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      {
        title: "Mô tả",
        dataIndex: "desc",
        key: "desc",
        width: 300,
      },
      {
        title: "Trạng thái",
        key: "status",
        dataIndex: "status",
        width: 100,
        align: "center",
        render: (status, record) => {
          return (
            <WithPermission permission={POLICIES.UPDATE_CUSTOMER}>
              <Switch
                checked={status === "ACTIVE"}
                onChange={(value) =>
                  onChangeStatus(
                    get(record, "_id"),
                    value ? STATUS["ACTIVE"] : STATUS["INACTIVE"],
                    isLoading,
                    record
                  )
                }
              />
            </WithPermission>
          );
        },
      },
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
      {
        title: "Thao tác",
        dataIndex: "_id",
        // key: "actions",
        width: 100,
        align: "center",
        fixed: 'right',
        render: (record) => {
          return (
            <div className="custom-table__actions">
              <WithPermission permission={POLICIES.UPDATE_CUSTOMER}>
                <p onClick={() => onOpenForm(record)}>Sửa</p>
              </WithPermission>
              <WithPermission permission={POLICIES.DELETE_CUSTOMER}>
                <p>|</p>
                <Popconfirm
                  title={`Bạn muốn xoá nhóm khách hàng này?`}
                  onConfirm={() => deleteGroupPharmacy(record)}
                  okText="Xoá"
                  cancelText="Huỷ"
                >
                  <p>Xóa</p>
                </Popconfirm>{" "}
              </WithPermission>
            </div>
          );
        },
      },
      
    ],
    [canDownload,arrCheckBox,pharmacies]
  );

  const onChangeStatus = (
    _id: any,
    status: any,
    isSubmitLoading: any,
    record: any
  ) => {
    updateGroupPharmacy({
      _id,
      status,
      isSubmitLoading,
      ...omit(record, ["_id", "status"]),
    });
  };

  const onChange = ({ target }: any) => {
    switch (target.value) {
      case 2:
        onParamChange({ ...query, status: STATUS["ACTIVE"] });
        break;
      case 3:
        onParamChange({ ...query, status: STATUS["INACTIVE"] });
        break;
      default:
        onParamChange({ ...query, status: "" });
        break;
    }
  };
  useChangeDocumentTitle("Danh sách nhóm khách hàng");
  return (
    <div>
      <Breadcrumb title={"Nhóm khách hàng"} />
      <Row className="mb-3" justify={"space-between"}>
        <Col span={8}>
          <Search
            enterButton="Tìm kiếm"
            placeholder="Nhập để tìm kiếm"
            allowClear
            onSearch={() => onParamChange({ keyword })}
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
        </Col>
        <Row>
          <WithPermission permission={POLICIES.WRITE_CUSTOMER}>
            <Col>
              <Button
                icon={<PlusCircleOutlined />}
                type="primary"
                onClick={() => onOpenForm()}
              >
                Thêm mới
              </Button>
            </Col>
          </WithPermission>
          <WithPermission permission={POLICIES.DOWNLOAD_CUSTOMER}>
            <Col>
              <ExportExcelButton
                fileName="Danh sách nhóm khách hàng"
                api="customer"
                exportOption="customer"
                query={query}
                ids={arrCheckBox}
              />
            </Col>
          </WithPermission>
        </Row>
      </Row>
      <WithPermission permission={POLICIES.UPDATE_CUSTOMER}>
        <Space style={{ marginBottom: 20 }}>
          <Typography style={{ fontSize: 14, marginRight: 20 }}>
            Phân loại trạng thái theo :
          </Typography>
          <Row gutter={14}>
            <Radio.Group
              onChange={onChange}
              optionType="button"
              buttonStyle="solid"
              defaultValue={(() => {
                switch (query?.status) {
                  case "ACTIVE":
                    return 2;
                  case "INACTIVE":
                    return 3;
                  default:
                    return 1;
                }
              })()}
            >
              <Radio.Button value={1}>Tất cả</Radio.Button>
              <Radio.Button value={2}>{STATUS_NAMES["ACTIVE"]}</Radio.Button>
              <Radio.Button value={3}>{STATUS_NAMES["INACTIVE"]}</Radio.Button>
            </Radio.Group>
          </Row>
        </Space>
      </WithPermission>
      <WhiteBox>
        <TableAnt
          dataSource={pharmacies}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          scroll={{x : 1500}}
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
          stickyTop
        />
      </WhiteBox>
      <ModalAnt
        width={700}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={[]}
        afterClose={() => {
          setDestroy(false);
        }}
        destroyOnClose={destroy}

      >
        <GroupPharmacyForm
          setDestroy={setDestroy}
          onClose={onCloseForm}
          id={groupPharmacyId}
          handleUpdate={updateGroupPharmacy}
        />
      </ModalAnt>
    </div>
  );
}
