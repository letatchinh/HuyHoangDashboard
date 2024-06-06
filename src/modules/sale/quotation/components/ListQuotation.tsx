import React, { useCallback, useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useCopyQuotation,
  useDeleteQuotation,
  useGetQuotations,
  useQuotationPaging,
  useQuotationQueryParams,
  useUpdateQuotationParams,
} from "../quotation.hook";

import {
  Button,
  Checkbox,
  Col,
  Popconfirm,
  Row,
  Space,
  Typography,
  Form,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link, useLocation} from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import BillModule from "~/modules/sale/bill";
import { ItemDataSource } from "~/pages/Dashboard/Bill/CreateBill";
import { PATH_APP } from "~/routes/allPath";
import { DeviceDetector, pagingTable, permissionConvert} from "~/utils/helpers";
import SelectPharmacy from "../../bill/components/SelectPharmacy";
import { STATUS_QUOTATION, STATUS_QUOTATION_VI } from "../constants";
import { PlusCircleTwoTone } from "@ant-design/icons";
import WithPermission from "~/components/common/WithPermission";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import useCheckBoxExport from "~/modules/export/export.hook";
import ExportExcelButton from "~/modules/export/component";
import SelectPharmacyInDevice from "../../bill/components/SelectPharmacyInDevice";
import "../quotation.style.scss";
import ConfigTable from "~/components/common/ConfigTable";
import DateTimeTable from "~/components/common/DateTimeTable";
import SelectEmployee from "~/modules/employee/components/SelectSearch";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import { REF_COLLECTION } from "~/constants/defaultValue";
import { useIsAdapterSystem } from "~/utils/hook";
import { redirectRouterBillCreate, redirectRouterBillId } from "../../bill/bill.hook";
import SelectEmployeeV2 from "~/modules/employee/components/SelectEmployeeV2";
type propsType = {
  status?: string;
};

const CLONE_STATUS_QUOTATION_VI: any = STATUS_QUOTATION_VI;
export default function ListQuotation({
  status,
}: propsType): React.JSX.Element {
  const { pathname } = useLocation(); 
  const [form] = Form.useForm();
  const [query] = useQuotationQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateQuotationParams(query);
  const [quotations, isLoading] = useGetQuotations(query);
  const [isSubmitLoading, onCopyQuotation] = useCopyQuotation();
  const paging = useQuotationPaging();
  const [, onDelete] = useDeleteQuotation();
  const onUpdateQuotation = (data: Omit<ItemDataSource, "typeTab">) => {
    BillModule.service.addDataToSaleScreen({
      typeTab: "updateQuotation",
      ...data,
    });
    window.open(redirectRouterBillCreate(pathname));
  };
  const onConvertQuotation = (data: Omit<ItemDataSource, "typeTab">) => {
    BillModule.service.addDataToSaleScreen({
      typeTab: "convertQuotation",
      ...data,
    });
    window.open(redirectRouterBillCreate(pathname));
  };
  //Download
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const isSystem = useIsAdapterSystem();

  const onPermissionCovert = useCallback(permissionConvert(query),[query])
  const canDownload = useMatchPolicy(onPermissionCovert('DOWNLOAD', 'QUOTATION'));

  const columns: ColumnsType = [
    {
      title: "Mã đơn hàng tạm",
      dataIndex: "codeSequence",
      key: "codeSequence",
      align: "center",
      width: 100,
      // render(code, record, index) {
      //   return (
      //     <Link
      //       className="link_"
      //       to={PATH_APP.quotation.root + "/" + get(record, "_id")}
      //     >
      //       {code}
      //     </Link>
      //   );
      // },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "bill",
      key: "bill",
      align: "center",
      width: 100,
      render(bill, record, index) {
        return (
          <Link
            className="link_"
            to={PATH_APP.bill.root + "/" + get(record, "bill._id")}
            target="_blank"
          >
            {get(record, "bill.codeSequence")}
          </Link>
        );
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "bill",
      key: "bill",
      align: "center",
      width: 100,
      render(bill, record, index) {
        return (
          <Link
            className="link_"
            to={redirectRouterBillId(pathname) + "/" + get(record, "bill._id")}
            target="_blank"
          >
            {get(record, "bill.codeSequence")}
          </Link>
        );
      },
    },
    {
      title: "Ngày tạo đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      align: "center",
      render(createdAt, record, index) {
        return (
          <div>
            {/* <Typography.Text strong>
                {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
              </Typography.Text> */}
            <DateTimeTable data={createdAt} />
            <p>-</p>
            Bởi:{" "}
            <Typography.Text strong>
              {get(record, "createBy.fullName")}
            </Typography.Text>
          </div>
        );
      },
    },
    {
      title: "Ngày chuyển đổi",
      dataIndex: "historyStatus",
      key: "historyStatus",
      width: 100,
      align: "center",
      render(historyStatus, record, index) {
        return (
          historyStatus?.[STATUS_QUOTATION.CONFIRMED] && (
            <div>
              <Typography.Text strong>
                {dayjs(historyStatus?.[STATUS_QUOTATION.CONFIRMED]).format(
                  "DD/MM/YYYY HH:mm"
                )}
              </Typography.Text>
              <p>-</p>
              Bởi:{" "}
              <Typography.Text strong>
                {get(record, "confirmBy.fullName")}
              </Typography.Text>
            </div>
          )
        );
      },
    },
    {
      title: "Tên nhà thuốc",
      dataIndex: "pharmacy",
      key: "pharmacy",
      width: 100,
      align: "center",
      // width: "30%",
      render(pharmacy, record, index) {
        const refCollection = get(record, "refCollection", "pharma_profile");
        return (
          <>
            <Tooltip
              className="mx-1"
              title={
                refCollection === "partner" ? "Cộng tác viên" : "Nhà thuốc"
              }
            >
              {refCollection === "partner" ? (
                <i className="fa-solid fa-user-tie"></i>
              ) : (
                <i className="fa-solid fa-house-medical"></i>
              )}
            </Tooltip>
            <Typography.Text>{get(pharmacy, "name", "")}</Typography.Text>
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render(status, record, index) {
        return (
          <Status
            status={status}
            statusVi={CLONE_STATUS_QUOTATION_VI[status]}
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
              const id = record?._id;
              return (
                <Checkbox
                  checked={arrCheckBox?.includes(id)}
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
      key: "action",
      width: 100,
      align: "center" as any,
      render(_id: any, record: any, index: number) {
        return (
          <Space direction="vertical">
            <WithPermission permission={onPermissionCovert("WRITE", "BILL")}>
              <Button
                disabled={get(record, "status") !== STATUS_QUOTATION.NEW}
                block
                onClick={() => {
                  onConvertQuotation({
                    quotationItems: get(record, "quotationItems", []),
                    pharmacyId: get(record, "pharmacyId"),
                    dataUpdateQuotation: {
                      id: _id,
                      code: get(record, "code"),
                    },
                    pair: get(record, "pair", 0),
                    debtType: get(record, "debtType"),
                    fee: get(record, "fee"),
                    deliveryAddress: get(record, "deliveryAddress"),
                  });
                }}
                type="primary"
                size="small"
              >
                Chuyển đổi
              </Button>
            </WithPermission>
            <WithPermission
              permission={onPermissionCovert("UPDATE", "QUOTATION")}
            >
              <Button
                block
                disabled={get(record, "status") !== STATUS_QUOTATION.NEW}
                onClick={() => {
                  onUpdateQuotation({
                    quotationItems: get(record, "quotationItems", []),
                    pharmacyId: get(record, "pharmacyId"),
                    dataUpdateQuotation: {
                      id: _id,
                      code: get(record, "code"),
                    },
                    pair: get(record, "pair", 0),
                    debtType: get(record, "debtType"),
                    fee: get(record, "fee"),
                    deliveryAddress: get(record, "deliveryAddress"),
                  });
                }}
                size="small"
              >
                Cập nhật
              </Button>
            </WithPermission>
            <WithPermission
              permission={onPermissionCovert("WRITE", "QUOTATION")}
            >
              <Popconfirm
                title="Bạn muốn sao chép đơn hàng tạm này?"
                onConfirm={() => onCopyQuotation(_id)}
                okText="Sao chép"
                cancelText="Huỷ"
                okButtonProps={{
                  loading: isSubmitLoading,
                }}
              >
                <Button
                  block
                  ghost
                  type="primary"
                  size="small"
                  // disabled={get(record,'status') !== STATUS_QUOTATION.NEW}
                >
                  Sao chép
                </Button>
              </Popconfirm>
            </WithPermission>
            <WithPermission
              permission={onPermissionCovert("DELETE", "QUOTATION")}
            >
              <Popconfirm
                title="Bạn muốn xoá đơn hàng tạm này?"
                onConfirm={() => onDelete(_id)}
                okText="Xoá"
                cancelText="Huỷ"
                okButtonProps={{
                  loading: isSubmitLoading,
                }}
              >
                <Button
                  block
                  danger
                  size="small"
                  // disabled={get(record,'status') !== STATUS_QUOTATION.NEW}
                >
                  Xoá
                </Button>
              </Popconfirm>
            </WithPermission>
          </Space>
        );
      },
    },
  ];
  // [arrCheckBox, canDownload,onPermissionCovert, query]);
  const { isMobile } = DeviceDetector();
  return (
    <div className="quotation-page">
      <Row
        className="quotation-page__wrap"
        align="middle"
        justify={"space-between"}
      >
        <Col>
          <Space className="quotation-page__wrap--search">
            <Form form={form} initialValues={{ pharmacyId: query?.pharmacyId }}>
              {!isMobile ? (
                <SelectPharmacy
                  validateFirst={false}
                  form={form}
                  style={{ width: 250 }}
                  showIcon={false}
                  required={true}
                  size={"middle"}
                  onChange={(value) => onParamChange({ pharmacyId: value })}
                />
              ) : (
                <SelectPharmacyInDevice
                  validateFirst={false}
                  form={form}
                  showIcon={false}
                  size={"middle"}
                  onChange={(value) => onParamChange({ pharmacyId: value })}
                />
              )}
            </Form>
            {isSystem &&
              query.refCollection !== REF_COLLECTION.PHARMA_PROFILE &&
              query.refCollection &&
              (query.refCollection === REF_COLLECTION.EMPLOYEE ? (
                <Form
                  form={form}
                  initialValues={{ employeeId: query?.employeeIds }}
                >
                  <SelectEmployeeV2
                    validateFirst={false}
                    form={form}
                    style={{ width: 200 }}
                    showIcon={false}
                    size={"middle"}
                    defaultValue={query?.employeeIds || null}
                    onChange={(value) => onParamChange({ employeeIds: value })}
                    mode="multiple"
                  />
                </Form>
              ) : (
                <SelectCollaborator
                  value={query?.partnerIds ? query?.partnerIds?.split(",") : []}
                  onChange={(value) =>
                    onParamChange({ partnerIds: value?.length ? value : null })
                  }
                  mode="multiple"
                  style={{ width: 200 }}
                />
              ))}
            <SearchAnt
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onParamChange={onParamChange}
              style={{ width: 200 }}
            />
          </Space>
        </Col>
        <Col>
          <Space>
            <WithPermission
              permission={onPermissionCovert("DOWNLOAD", "QUOTATION")}
            >
              <Col>
                <ExportExcelButton
                  api="billQuotation"
                  exportOption="billQuotation"
                  query={query}
                  fileName="Danh sách đơn hàng tạm"
                  ids={arrCheckBox}
                />
              </Col>
            </WithPermission>
            <WithPermission permission={onPermissionCovert('WRITE', 'QUOTATION')}>
            <Button style={{marginLeft : 'auto'}} onClick={() => window.open(redirectRouterBillCreate(pathname))} type="primary" icon={<PlusCircleTwoTone />}>
              Tạo đơn hàng tạm
            </Button>
            </WithPermission>
          </Space>
        </Col>
      </Row>
      <ConfigTable>
        <TableAnt
          className="table-striped-rows-custom"
          bordered
          stickyTop
          columns={columns}
          dataSource={quotations}
          loading={isLoading}
          pagination={pagingTable(paging, onParamChange)}
          size="small"
          scroll={{ y: "60vh", x: "max-content" }}
        />
      </ConfigTable>
    </div>
  );
}
