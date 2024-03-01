import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { formatter } from "~/utils/helpers";
import {
  useAccumulationDetailPaging,
  useAccumulationDetailQuery,
  useGetAccumulationDetail,
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
import { propsAccumulation, propsType } from "../pharmacy.modal";
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
import dayjs from "dayjs";

interface UserProps {
  currentTab: string | undefined;
}

const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;

export default function AccumulationDetailPharmacy(props: propsAccumulation) {
  const { t }: any = useTranslate();
  const { pharmacyId, targetType } = props;
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [query] = useAccumulationDetailQuery();

  const [searchByStatus, setSearchByStatus] = useState<string[]>([]);
  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DDTHH:mm:ss"),
    }),
    []
  );
  const [date, setDate] = useState<any>(defaultDate);
  const newQuery = useMemo(
    () => ({
      ...query,
      pharmaId: pharmacyId,
      targetType: targetType,
    }),
    [pharmacyId, targetType, query, date, searchByStatus]
  );
  const [data, isLoading] = useGetAccumulationDetail(newQuery);
  const paging = useAccumulationDetailPaging();

  const [isOpenForm, setIsOpenForm] = useState(false);

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
            <Link className="link_" to={`/bill?keyword=${codeSequence}`} target={'_blank'}>
              {codeSequence}
            </Link>
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
          dataSource={data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={{
            ...paging,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
        />
      </WhiteBox>
    </div>
  );
}
