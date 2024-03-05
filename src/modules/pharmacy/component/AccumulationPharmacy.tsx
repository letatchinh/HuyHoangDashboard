import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { concatAddress, formatter } from "~/utils/helpers";
import {
  useAccumulationPaging,
  useAccumulationQuery,
  useGetAccumulation,
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
import { propsAccumulation, propsType } from "../pharmacy.modal";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import ModalAnt from "~/components/Antd/ModalAnt";
import ReceiptVoucherForm from "~/modules/receiptVoucher/components/ReceiptVoucherForm";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import dayjs from "dayjs";
import AccumulationDetailPharmacy from "./AccumulationDetailPharmacy";

interface UserProps {
  currentTab: string | undefined;
}

export default function AccumulationPharmacy(props: propsAccumulation) {
  const { t }: any = useTranslate();
  const { pharmacyId, targetType } = props;
  const [keyword, setKeyword] = useState("");
  const [value, setValue] = useState("");
  const [query, onTableChange] = useAccumulationQuery();
  const [searchByStatus, setSearchByStatus] = useState<string[]>([]);
  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DDTHH:mm:ss"),
    }),
    []
  );
  const [date, setDate] = useState<any>(defaultDate);
  const [itemActive, setItemActive] = useState<any>();
  const newQuery = useMemo(
    () => ({
      ...query,
      pharmaId: pharmacyId,
      targetType: targetType,
      //   ...date,
      //   status: searchByStatus?.toString(),
    }),
    [pharmacyId, query, targetType]
  );
  const [data, isLoading] = useGetAccumulation(newQuery);

  const paging = useAccumulationPaging();

  const columns: ColumnsType = useMemo(
    () => [
      
      {
        title: "Mã thuốc",
        dataIndex: "variants",
        key: "variants",
        width: 120,
        render(record) {
          return record?.[0]?.variantCode;
        },
      },
      {
        title: "Tên thuốc",
        dataIndex: "product",
        key: "product",
        width: 280,
        render: (record) => {
          return record?.name;
        },
      },
      {
        title: "Đơn vị cơ bản",
        dataIndex: "variants",
        key: "variants",
        width: 150,
        render(record) {
          return record?.unit;
        },
      },
      {
        title: "Số lượng",
        dataIndex: "totalQuantity",
        key: "totalQuantity",
        width: 150,
        align: "center" as any,
      },
      {
        title: "Thành tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 180,
        render(record) {
          return formatter(record);
        },
      },
      {
        title: "Nhà cung cấp",
        dataIndex: "supplier",
        key: "supplier",
        width: 250,
        render: (record) => {
          return record?.name;
        },
      },
      {
        title: "Nhóm sản phẩm",
        dataIndex: "productGroup",
        key: "productGroup",
        width: 180,
        fixed: "right" as any,
        render: (record) => {
          return record?.name;
        },
      },
    ],
    []
  );
  const columnsGroup: ColumnsType = useMemo(
    () => [
      {
        title: "Nhóm sản phẩm",
        dataIndex: "productGroup",
        key: "productGroup",
        width: 180,
        render: (record) => {
          return record?.name;
        },
      },
      {
        title: "Thành tiền",
        dataIndex: "totalAmount",
        key: "totalAmount",
        width: 180,
        render(record) {
          return formatter(record);
        },
      },
    ],
    []
  );
  return (
    <div>
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

      <WhiteBox>
        <TableAnt
          dataSource={data}
          loading={isLoading}
          // rowKey={(rc) => rc?._id}
          scroll={{ x: "max-content" }}
          columns={targetType=="PRODUCT" ? columns : columnsGroup}
          size="small"
          onChange={onTableChange}
        //   expandable={{
        //     expandedRowRender: (record: any) => (
        //       <AccumulationDetailPharmacy
               
        //       />
        //     ),
        //     expandedRowKeys: [itemActive],
        //   }}
        //   onExpand={(expanded, record) => {
        //     expanded ? setItemActive(record._id) : setItemActive(null);
        //   }}
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
