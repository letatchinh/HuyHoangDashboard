import { ColumnsType } from "antd/es/table";
import { formatter } from "~/utils/helpers";
import {
  useGetHistoryPharmacy,
  useHistoryPharmacyPaging,
} from "../pharmacy.hook";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import {  get } from "lodash";
import moment from "moment";
import {  useMemo, useState } from "react";
import { propsType } from "../pharmacy.modal";
import { Link } from "react-router-dom";
import Status from "~/components/common/Status";
import { STATUS_BILL_VI } from "~/modules/sale/bill/constants";
import ExpandHistoryPharmacy from "./ExpandHistoryPharmacy";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";

interface UserProps {
  currentTab: string | undefined;
}

const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;

export default function HistoryPharmacy(props: propsType) {
  const { pharmacyId } = props;
  const [query,setQuery] = useState({page : 1 , limit : 10});
  const queryMemo = useMemo(() => ({id : pharmacyId, ...query}), [query,pharmacyId]);
  const [history, isLoading] = useGetHistoryPharmacy(queryMemo);
  const paging = useHistoryPharmacyPaging();
  const canReadBill = useMatchPolicy(POLICIES.READ_BILL);

  const [itemActive, setItemActive] = useState<any>();
  const onParamChange = (newQuery : any) => {
    setQuery({...query, ...newQuery});
  }
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "codeSequence",
        key: "codeSequence",
        width: 120,
        render(codeSequence) {
          return (
            canReadBill ?<Link className="link_" to={`/bill?keyword=${codeSequence}`} target={'_blank'}>
              {codeSequence}
            </Link> : codeSequence
          );
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
        title: "Thành tiền",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 120,
        render(value) {
          return formatter(value);
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 120,
        render(status) {
          return (
            <Status status={status} statusVi={CLONE_STATUS_BILL_VI[status]} />
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <WhiteBox>
        <TableAnt
          dataSource={history}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          expandable={{
            expandedRowRender: (record: any) => (
              <ExpandHistoryPharmacy
                historyStatus={get(record, "historyStatus")}
              />
            ),
            expandedRowKeys: [itemActive],
          }}
          onExpand={(expanded, record) => {
            expanded ? setItemActive(record._id) : setItemActive(null);
          }}
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
        />
      </WhiteBox>
    </div>
  );
}
