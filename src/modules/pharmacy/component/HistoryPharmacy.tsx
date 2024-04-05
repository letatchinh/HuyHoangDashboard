import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { formatter } from "~/utils/helpers";
import {
  useGetHistoryPharmacy,
  useHistoryPharmacyPaging,
  useHistoryPharmacyQuery,
  useUpdatePharmacy,
} from "../pharmacy.hook";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import { omit, get } from "lodash";
import {
  REF_COLLECTION_UPPER,
  STATUS,
  STATUS_NAMES,
} from "~/constants/defaultValue";
import moment from "moment";
// import ColumnActions from "~/components/common/ColumnAction";
import { useCallback, useMemo, useState } from "react";
import {
  Button,
  Col,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import { PlusCircleOutlined } from "@ant-design/icons";
// import PharmacyForm from "./PharmacyForm";
import { propsType } from "../pharmacy.modal";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import ModalAnt from "~/components/Antd/ModalAnt";
import ReceiptVoucherForm from "~/modules/receiptVoucher/components/ReceiptVoucherForm";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import Status from "~/components/common/Status";
import { STATUS_BILL_VI } from "~/modules/sale/bill/constants";
import ExpandHistoryPharmacy from "./ExpandHistoryPharmacy";

interface UserProps {
  currentTab: string | undefined;
}

const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;

export default function HistoryPharmacy(props: propsType) {
  const { t }: any = useTranslate();
  const { pharmacyId } = props;
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [query] = useHistoryPharmacyQuery();
  const [history, isLoading] = useGetHistoryPharmacy(pharmacyId);

  const [searchByStatus, setSearchByStatus] = useState<string[]>([]);
  const paging = useHistoryPharmacyPaging();
  const canReadBill = useMatchPolicy(POLICIES.READ_BILL);

  const [isOpenForm, setIsOpenForm] = useState(false);

  const [open, setOpen] = useState(false);
  const [debt, setDebt] = useState<number | null>();
  const [itemActive, setItemActive] = useState<any>();

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
        render(status, record, index) {
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
            // onChange(page, pageSize) {
            //   onParamChange({ page, limit: pageSize });
            // },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
        />
      </WhiteBox>
    </div>
  );
}
