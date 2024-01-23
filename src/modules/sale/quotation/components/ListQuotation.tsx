import React, { useMemo } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import {
  useDeleteQuotation,
  useGetQuotations,
  useQuotationPaging,
  useQuotationQueryParams,
  useUpdateQuotationParams
} from "../quotation.hook";

import { Button, Popconfirm, Row, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import dayjs from "dayjs";
import { get } from "lodash";
import { Link } from "react-router-dom";
import SearchAnt from "~/components/Antd/SearchAnt";
import Status from "~/components/common/Status/index";
import BillModule from "~/modules/sale/bill";
import { ItemDataSource } from "~/pages/Dashboard/Bill/CreateBill";
import { PATH_APP } from "~/routes/allPath";
import { pagingTable } from "~/utils/helpers";
import SelectPharmacy from "../../bill/components/SelectPharmacy";
import { STATUS_QUOTATION, STATUS_QUOTATION_VI } from "../constants";
import { PlusCircleTwoTone } from "@ant-design/icons";
type propsType = {
  status?: string;
};
const CLONE_STATUS_QUOTATION_VI: any = STATUS_QUOTATION_VI;
export default function ListQuotation({
  status,
}: propsType): React.JSX.Element {
  const [query] = useQuotationQueryParams(status);
  console.log(query,'query');
  
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateQuotationParams(query);
  const [quotations, isLoading] = useGetQuotations(query);
  const paging = useQuotationPaging();
  const [, onDelete] = useDeleteQuotation();
  const onUpdateQuotation = (data: Omit<ItemDataSource, "typeTab">) => {
    BillModule.service.addDataToSaleScreen({
      typeTab: "updateQuotation",
      ...data,
    });
    window.open(PATH_APP.bill.create)
  };
  const onConvertQuotation = (data: Omit<ItemDataSource, "typeTab">) => {
    BillModule.service.addDataToSaleScreen({
      typeTab: "convertQuotation",
      ...data,
    });
    window.open(PATH_APP.bill.create)
  };
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
        return  <Link
              className="link_"
              to={PATH_APP.bill.root + "/" + get(record, "bill._id")}
              target="_blank"
            >
              {get(record,'bill.codeSequence')}
            </Link>
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
              <Typography.Text>
              {dayjs(createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography.Text>
            <p>-</p>
            Bởi: <Typography.Text strong>{get(record,'createBy.fullName')}</Typography.Text>
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
          return historyStatus?.[STATUS_QUOTATION.CONFIRMED] && <div>
            <Typography.Text>
              {dayjs(historyStatus?.[STATUS_QUOTATION.CONFIRMED]).format("DD/MM/YYYY HH:mm")}
            </Typography.Text>
            <p>-</p>
            Bởi: <Typography.Text strong>{get(record,'confirmBy.fullName')}</Typography.Text>
          </div>
        ;
        },
      },
      {
        title: "Tên nhà thuốc",
        dataIndex: "pharmacy",
        key: "pharmacy",
        align: "center",
        width : '30%',
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
      {
        title: "Thao tác",
        dataIndex: "_id",
        key: "action",
        align: "center",
        render(_id, record: any, index) {
          return (
            <Space direction="vertical">
              <Button
                disabled={get(record,'status') !== STATUS_QUOTATION.NEW}
                block
                onClick={() => {
                  onConvertQuotation({
                    quotationItems: get(record, "quotationItems", []),
                    pharmacyId: get(record, "pharmacyId"),
                    dataUpdateQuotation: {
                      id: _id,
                      code: get(record, "code"),
                    },
                  });
                }}
                type="primary"
                size="small"
              >
                Chuyển đổi
              </Button>
              <Button
                block
                disabled={get(record,'status') !== STATUS_QUOTATION.NEW}
                onClick={() => {
                  onUpdateQuotation({
                    quotationItems: get(record, "quotationItems", []),
                    pharmacyId: get(record, "pharmacyId"),
                    dataUpdateQuotation: {
                      id: _id,
                      code: get(record, "code"),
                    },
                  });
                }}
                size="small"
              >
                Cập nhật
              </Button>
              <Popconfirm
                title="Bạn muốn xoá nhà cung cấp này?"
                onConfirm={() => onDelete(_id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button block danger size="small" 
                // disabled={get(record,'status') !== STATUS_QUOTATION.NEW}
                >
                  Xoá
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    []
  );
  return (
    <div className="quotation-page">
      <Row align="middle" gutter={8}>
      <SelectPharmacy onChange={(value) => onParamChange({pharmacyId : value})}/>
      <SearchAnt value={keyword} onChange={(e) => setKeyword(e.target.value)} onParamChange={onParamChange} />
      <Button style={{marginLeft : 'auto'}} onClick={() => window.open(PATH_APP.bill.create)} type="primary" icon={<PlusCircleTwoTone />}>
        Tạo đơn hàng tạm
      </Button>
      </Row>
      <TableAnt
      stickyTop
        columns={columns}
        dataSource={quotations}
        loading={isLoading}
        pagination={pagingTable(paging, onParamChange)}
        size='small'
      />
    </div>
  );
}
