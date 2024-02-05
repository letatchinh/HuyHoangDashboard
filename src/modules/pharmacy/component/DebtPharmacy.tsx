import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useGetPharmacyDebt,
  usePharmacyDebtQuery,
  usePharmacyPaging,
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
import dayjs from "dayjs";

interface UserProps {
  currentTab: string | undefined;
}
// type propsType = {
//   pharmacyId: string | null
// };


export default function DebtPharmacy(props: propsType) {
  const { t }: any = useTranslate();
  const { pharmacyId } = props;
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [query, onTableChange] = usePharmacyDebtQuery();
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
      pharmacyId: pharmacyId,
      ...date,
      status: searchByStatus?.toString(),
    }),
    [pharmacyId, query, date, searchByStatus]
  );
  const [data, isLoading] = useGetPharmacyDebt(query);
  
  const paging = usePharmacyPaging();

  const [open, setOpen] = useState(false);
  const [debt, setDebt] = useState<number | null>();
  
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
        title: "Giá trị đơn hàng",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 180,
      },
      {
        title: "Phương thức thanh toán",
        dataIndex: "paymentMethod",
        key: "paymentMethod",
        width: 120,
      },
      {
        title: "Đã thanh toán",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 300,
      },
      {
        title: "Nợ",
        dataIndex: "totalDebt",
        key: "totalDebt",
        width: 120,
      },
    ],
    []
  );

  return (
    <div>
      <Breadcrumb title={t("debt")} />
      <Row className="mb-3" justify={"space-between"}>
        {/* <Col span={8}>
          <Search
            enterButton="Tìm kiếm"
            placeholder="Nhập để tìm kiếm"
            allowClear
            onSearch={() => onParamChange({ keyword })}
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
        </Col> */}
      </Row>

        <TableAnt
          dataSource={data}
          loading={isLoading}
          // rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          onChange={onTableChange}
          pagination={{
            ...paging,
            // onChange(page, pageSize) {
            //   onParamChange({ page, limit: pageSize });
            // },
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
        />
    </div>
  );
}
