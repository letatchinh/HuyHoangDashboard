import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useBillPaging,
  useBillQueryParams,
  useGetBills,
  useUpdateBillParams,
} from "../bill.hook";

import { Checkbox, Col, Row, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import { get, includes } from "lodash";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import { PATH_APP } from "~/routes/allPath";
import { formatter, pagingTable } from "~/utils/helpers";
import { STATUS_BILL_VI } from "../constants";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import useCheckBoxExport from "~/modules/export/export.hook";
import WithPermission from "~/components/common/WithPermission";
import ExportExcelButton from "~/modules/export/component";
type propsType = {
  status?: string;
};
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function ListBill({ status }: propsType): React.JSX.Element {
  const [query] = useBillQueryParams(status);
  const [keyword, { setKeyword, onParamChange }] = useUpdateBillParams(query);
  const [bills, isLoading] = useGetBills(query);
  const paging = useBillPaging();

  //Download
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_PRODUCT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "codeSequence",
        key: "codeSequence",
        align: "center",
        render(codeSequence, record, index) {
          return (
            <Link
              className="link_"
              to={PATH_APP.bill.root + "/" + get(record, "_id")}
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
        align: "center",
        render(createdAt, record, index) {
          return (
            <Typography.Text strong>
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography.Text>
          );
        },
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        align: "center",
        render(pharmacy, record, index) {
          return <Typography.Text>{get(pharmacy, "name", "")}</Typography.Text>;
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
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
        align: "center",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        key: "note",
        align: "center",
      },
      {
        title: "Khách đã trả",
        dataIndex: "pair",
        key: "pair",
        align: "center",
        render(pair, record, index) {
          return <Typography.Text>{formatter(pair + get(record,'totalReceiptVoucherCompleted',0))}</Typography.Text>;
        },
      },
      {
        title: "Khách phải trả",
        dataIndex: "totalPrice",
        key: "totalPrice",
        align: "center",
        render(totalPrice, record, index) {
          return <Typography.Text>{formatter(totalPrice)}</Typography.Text>;
        },
      },
      ...(
        canDownload ? [
          {
            title: 'Lựa chọn',
            key: '_id',
            width: 80,
            align: 'center' as any,
            render: (item: any, record: any) => {
              const id = record?._id;
              return (
                <Checkbox
                  checked={arrCheckBox?.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />)
            }
          },
        ] : []
      ),
    ], [arrCheckBox]
  );
  console.log(query?.supplierIds,'query?.supplierIds');
  
  return (
    <div className="bill-page">
      {/* <Space> */}
        <Row justify={"space-between"}>
          <Col span={12}>
          <Space>
        <SelectSupplier
          value={query?.supplierIds ? query?.supplierIds?.split(',') : []}
          onChange={(value) => onParamChange({ supplierIds: value?.length ? value : null })}
          mode="multiple"
          style={{width : 200}}
        />
        <SearchAnt value={keyword} onChange={(e) => setKeyword(e.target.value)} onParamChange={onParamChange} />
      </Space>
          </Col>
            <WithPermission permission={POLICIES.DOWNLOAD_BILL}>
              <Col>
                <ExportExcelButton
                  api='bill'
                  exportOption = 'bill'
                  query={query}
                  fileName='Danh sách đơn hàng'
                  ids={arrCheckBox}
                />
              </Col>
          </WithPermission>
        </Row>
      {/* </Space> */}
      <TableAnt
        stickyTop
        columns={columns}
        dataSource={bills}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
        size="small"
      />
    </div>
  );
}
