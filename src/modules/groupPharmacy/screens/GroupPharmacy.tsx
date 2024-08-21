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
import { useChangeDocumentTitle } from "~/utils/hook";
import ExportExcelButton from "~/modules/export/component";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import ModalAnt from "~/components/Antd/ModalAnt";
import { GroupPharmacyForm } from "./GroupPharmacyForm";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import BtnAdd from "~/components/common/Layout/List/Header/BtnAdd";
import DropdownAction from "~/components/common/Layout/List/Header/DropdownAction";
import StatusAndSearch from "~/components/common/StatusAndSearch";
import ColumnAction from "~/components/common/ColumnAction";
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
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_CUSTOMER);
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
        title: "Mã",
        dataIndex: "code",
        key: "code",
        width: 50,
        fixed: 'left',
        align : 'center',
        render: (text: string, record: any) => <Link className='link_' to={PATH_APP.groupPharmacy.root + "/" + record?._id}>{text}</Link>
      },
      // {
      //   title: "Hệ số",
      //   dataIndex: "rateType",
      //   key: "rateType",
      //   width: 120,
      // },
      
      {
        title: "Tên nhóm khách hàng",
        dataIndex: "title",
        key: "title",
        width: 220,
      },
      {
        title: "Nhánh khách hàng",
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
              <Switch
                disabled={!canUpdate}
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
          );
        },
      },
      {
        title: "Thao tác",
        // dataIndex: "_id",
        key: "actions",
        width: 100,
        align: "center",
        fixed: 'right',
        render: (_, record) => {
          return (
            <ColumnAction
              onOpenForm={onOpenForm}
              onDelete={deleteGroupPharmacy}
              _id={record?._id}
              textName="nhóm khách hàng"
              permissionUpdate={POLICIES.UPDATE_CUSTOMER}
              permissionDelete={POLICIES.DELETE_CUSTOMER}
            />
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
      <Row gutter={16} justify={"space-between"}>
        <Col span={12}>
          <StatusAndSearch
            onParamChange={onParamChange}
            query={query}
            keyword={keyword}
            setKeyword={setKeyword}
          />
        </Col>
        <Col span={8}>
          <Row justify={"end"} gutter={16}>
            <WithPermission permission={POLICIES.WRITE_CUSTOMER}>
              <Col>
                <BtnAdd onClick={() => onOpenForm()} />
              </Col>
            </WithPermission>
            <WithPermission permission={POLICIES.DOWNLOAD_CUSTOMER}>
              <Col>
                <DropdownAction
                  items={[
                    <ExportExcelButton
                      fileName="DS nhóm khách hàng"
                      api="customer"
                      exportOption="customer"
                      query={query}
                      ids={arrCheckBox}
                      useLayout="v2"
                    />,
                  ]}
                />
              </Col>
            </WithPermission>
          </Row>
        </Col>
      </Row>
      <WhiteBox>
        <TableAnt
          dataSource={pharmacies}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          scroll={{ x: 1500 }}
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
        title={
          groupPharmacyId
            ? "Cập nhật nhóm khách hàng"
            : "Thêm mới nhóm bán hàng"
        }
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
          query={query}
        />
      </ModalAnt>
    </div>
  );
}
