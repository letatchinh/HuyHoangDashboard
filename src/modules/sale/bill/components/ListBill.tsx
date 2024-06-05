import React, { useCallback, useMemo, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  redirectRouterBillId,
  useBillPaging,
  useBillQueryParams,
  useGetBills,
  useUpdateBillParams,
} from "../bill.hook";

import { Checkbox, Col, ConfigProvider, Form, Row, Space, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { Link, useLocation } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { PATH_APP } from "~/routes/allPath";
import { formatter, pagingTable, permissionConvert } from "~/utils/helpers";
import { STATUS_BILL_VI } from "../constants";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import useCheckBoxExport from "~/modules/export/export.hook";
import WithPermission from "~/components/common/WithPermission";
import ExportExcelButton from "~/modules/export/component";
import { CalculateBill } from "../bill.service";
import DateTimeTable from "~/components/common/DateTimeTable";
import SelectEmployee from "~/modules/employee/components/SelectSearch";
import { REF_COLLECTION } from "~/constants/defaultValue";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import { useIsAdapterSystem } from "~/utils/hook";
import SelectPharmacy from "./SelectPharmacy";
const CalculateBillMethod = new CalculateBill();
type propsType = {
  status?: string;
};
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function ListBill({ status }: propsType): React.JSX.Element {
  const [query] = useBillQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] = useUpdateBillParams(query);
  const [bills, isLoading] = useGetBills(query);
  const paging = useBillPaging();
  const isSystem = useIsAdapterSystem();
  //Download
  const onPermissionCovert = useCallback(permissionConvert(query),[query])
  const canDownload = useMatchPolicy(onPermissionCovert('DOWNLOAD', 'BILL'));
  const { pathname } = useLocation();
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const [form] = Form.useForm();
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: <p style={{ color: "#333", fontWeight: "bold" }}>Mã đơn hàng</p>,
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        render(codeSequence, record, index) {
          return (
            <Link
              className="link_"
              to={redirectRouterBillId(pathname) + "/" + get(record, "_id")}
            >
              {codeSequence}
            </Link>
          );
        },
      },
      {
        title: "Ngày tạo đơn",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "left",
        render(createdAt, record, index) {
          return (
            // <Typography.Text strong>
            //   {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            // </Typography.Text>
            <DateTimeTable data={createdAt} />
          );
        },
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        align: "left",
        render(pharmacy, record, index) {
          return <Typography.Text>{get(pharmacy, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 150,
        render(status, record, index) {
          return (
            <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
          );
        },
      },
      {
        title: "Lý do huỷ",
        dataIndex: "cancelNote",
        key: "cancelNote",
        align: "left",
        render(cancelNote?:any) {
          return (
            <Typography.Paragraph
              ellipsis={{
                tooltip: cancelNote,
                rows : 2,
              }}
            >
              {cancelNote}
            </Typography.Paragraph>
          );
        },
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        align: "left",
        render(note?:any) {
          return (
            <Typography.Paragraph
              ellipsis={{
                tooltip: note,
                rows : 2,
              }}
            >
              {note}
            </Typography.Paragraph>
          );
        },
      },
      {
        title: "Khách đã trả",
        dataIndex: "pair",
        key: "pair",
        align: "center",
        render(pair, record, index) {
          return (
            <Typography.Text>
              {formatter(pair + get(record, "totalReceiptVoucherCompleted"))}
            </Typography.Text>
          );
        },
      },
      {
        title: "Khách phải trả",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "center",
        render(totalPrice, record, index) {
          const remainAmount = CalculateBillMethod.remainAmount(record);

          return <Typography.Text>{formatter(remainAmount)}</Typography.Text>;
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
    ],
    [arrCheckBox, canDownload]
  );
  return (
    <div className="bill-page">
      {/* <Space> */}
      <Row justify={"space-between"}>
        <Col span={12}>
          <Space style={{ alignItems: "normal" }}>
            <SelectSupplier
              value={query?.supplierIds ? query?.supplierIds?.split(",") : []}
              onChange={(value) =>
                onParamChange({ supplierIds: value?.length ? value : null })
              }
              mode="multiple"
              style={{ width: 250 }}
            />
            {isSystem &&
            query.refCollection !== REF_COLLECTION.PHARMA_PROFILE &&
            query.refCollection ? (
              query.refCollection === REF_COLLECTION.EMPLOYEE ? (
                <SelectEmployee
                  value={
                    query?.employeeIds ? query?.employeeIds?.split(",") : []
                  }
                  onChange={(value) =>
                    onParamChange({ employeeIds: value?.length ? value : null })
                  }
                  mode="multiple"
                  style={{ width: 200 }}
                />
              ) : (
                <SelectCollaborator
                  value={query?.partnerIds ? query?.partnerIds?.split(",") : []}
                  onChange={(value) =>
                    onParamChange({ partnerIds: value?.length ? value : null })
                  }
                  mode="multiple"
                  style={{ width: 200 }}
                />
              )
            ) : (
              <Form
                form={form}
                initialValues={{ pharmacyId: query?.pharmacyIds }}
              >
                <SelectPharmacy
                  validateFirst={false}
                  form={form}
                  style={{ width: 200 }}
                  showIcon={false}
                  required={false}
                  size={"middle"}
                  defaultValue={query?.pharmacyIds || null}
                  onChange={(value) =>
                    onParamChange({ pharmacyIds: value?.length ? value : null })
                  }
                  mode="multiple"
                />
              </Form>
            )}
            <SearchAnt
              style={{ alignSelf: "center" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onParamChange={onParamChange}
            />
          </Space>
        </Col>
        <WithPermission permission={onPermissionCovert("DOWNLOAD", "BILL")}>
          <Col>
            <ExportExcelButton
              api="bill"
              exportOption="bill"
              query={query}
              fileName="Danh sách đơn hàng"
              ids={arrCheckBox}
            />
          </Col>
        </WithPermission>
      </Row>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: '#C4E4FF',
            },
          },
        }}
      >
        <TableAnt
        stickyTop
        className="table-striped-rows-custom"
        columns={columns}
        dataSource={bills}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
        size="small"
        bordered
        scroll={{ y: '60vh' ,x  : 800}}
      />
      </ConfigProvider>
    </div>
  );
}
