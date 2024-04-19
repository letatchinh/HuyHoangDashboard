import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useCopyQuotation,
  useDeleteQuotation,
  useGetQuotations,
  useQuotationPaging,
  useQuotationQueryParams,
  useUpdateQuotationParams,
} from "../quotation.hook";

import { Button, Checkbox, Col, Popconfirm, Row, Space, Typography,Form } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import BillModule from "~/modules/sale/bill";
import { ItemDataSource } from "~/pages/Dashboard/Bill/CreateBill";
import { PATH_APP } from "~/routes/allPath";
import { DeviceDetector, pagingTable } from "~/utils/helpers";
import SelectPharmacy from "../../bill/components/SelectPharmacy";
import { STATUS_QUOTATION, STATUS_QUOTATION_VI } from "../constants";
import { PlusCircleTwoTone } from "@ant-design/icons";
import WithPermission from "~/components/common/WithPermission";
import policyModule from 'policy';
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import useCheckBoxExport from "~/modules/export/export.hook";
import ExportExcelButton from "~/modules/export/component";
import SelectPharmacyInDevice from "../../bill/components/SelectPharmacyInDevice";
import '../quotation.style.scss';
import ConfigTable from "~/components/common/ConfigTable";
import DateTimeTable from "~/components/common/DateTimeTable";
type propsType = {
  status?: string;
};
const CLONE_STATUS_QUOTATION_VI: any = STATUS_QUOTATION_VI;
export default function ListQuotation({
  status,
}: propsType): React.JSX.Element {
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
    window.open(PATH_APP.bill.create);
  };
  const onConvertQuotation = (data: Omit<ItemDataSource, "typeTab">) => {
    BillModule.service.addDataToSaleScreen({
      typeTab: "convertQuotation",
      ...data,
    });
    window.open(PATH_APP.bill.create);
  };
  //Download
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_PRODUCT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();


  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng tạm",
        dataIndex: "code",
        key: "code",
        align: "center",
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
        title: "Ngày tạo đơn",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render(createdAt, record, index) {
          return (
            <div>
              {/* <Typography.Text strong>
                {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
              </Typography.Text> */}
                <DateTimeTable data={createdAt}/>
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
        align: "center",
        // width: "30%",
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
            <Status
              status={status}
              statusVi={CLONE_STATUS_QUOTATION_VI[status]}
            />
          );
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
      {
        title: "Thao tác",
        dataIndex: "_id",
        key: "action",
        align: "center",
        render(_id, record: any, index) {
          return (
            <Space direction="vertical">
              <WithPermission permission={policyModule.POLICIES.WRITE_BILL}>
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
                      fee : get(record,'fee')
                    });
                  }}
                  type="primary"
                  size="small"
                >
                  Chuyển đổi
                </Button>
              </WithPermission>
              <WithPermission
                permission={policyModule.POLICIES.UPDATE_QUOTATION}
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
                      fee : get(record,'fee')
                    });
                  }}
                  size="small"
                >
                  Cập nhật
                </Button>
              </WithPermission>
              <WithPermission
                permission={policyModule.POLICIES.WRITE_QUOTATION}
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
                permission={policyModule.POLICIES.DELETE_QUOTATION}
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
    ],
    [arrCheckBox, canDownload]
  );
  const {isMobile} = DeviceDetector();
  return (
    <div className="quotation-page">
      <Row align="middle" gutter={8} justify={"space-between"}>
        <Col>
          <Space className="quotation-page__wrap--search">
            <Form form={form} initialValues={{pharmacyId : query?.pharmacyId}}> 
              {!isMobile ? <SelectPharmacy
                validateFirst={false}
                form={form}
                style={{ width: 200 }}
                showIcon={false}
                size={"middle"}
                onChange={(value) =>
                  onParamChange({ pharmacyId: value })
                }
                /> : <SelectPharmacyInDevice
                validateFirst={false}
                form={form}
                showIcon={false}
                size={"middle"}
                onChange={(value) =>
                  onParamChange({ pharmacyId: value })
                }
            />}
            </Form>
            <SearchAnt
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onParamChange={onParamChange}
            />
          </Space>
        </Col>
        <Col>
          <Space>
            <WithPermission permission={POLICIES.DOWNLOAD_QUOTATION}>
                <Col>
                  <ExportExcelButton
                    api='billQuotation'
                    exportOption = 'billQuotation'
                    query={query}
                    fileName='Danh sách đơn hàng tạm'
                    ids={arrCheckBox}
                  />
                </Col>
            </WithPermission>
            <WithPermission permission={policyModule.POLICIES.WRITE_QUOTATION}>
            <Button style={{marginLeft : 'auto'}} onClick={() => window.open(PATH_APP.bill.create)} type="primary" icon={<PlusCircleTwoTone />}>
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
          />
      </ConfigTable>
    </div>
  );
}
