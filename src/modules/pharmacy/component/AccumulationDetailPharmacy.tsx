import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { formatter } from "~/utils/helpers";
import {
  useAccumulationDetailPaging,
  useAccumulationDetailQuery,
  useGetAccumulationDetail,
} from "../pharmacy.hook";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";
import { propsAccumulation, propsAccumulationDetail, propsType } from "../pharmacy.modal";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { Link } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import dayjs from "dayjs";

interface UserProps {
  currentTab: string | undefined;
}

export default function AccumulationDetailPharmacy(props: propsAccumulationDetail) {
  const { t }: any = useTranslate();
  const { _id, pharmacyId, targetType, date } = props;
  const canReadBill = useMatchPolicy(POLICIES.READ_BILL);

  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    }),
    []
  );
  // const [date, setDate] = useState<any>(defaultDate);
  const [query] = useAccumulationDetailQuery();
  const newQuery = useMemo(
    () => ({
      ...query,
      pharmacyId: pharmacyId,
      targetType: targetType,
      ...date,
    }),
    [pharmacyId, targetType, date, query]
  );
  const memoId = useMemo(() => _id, [_id]);
  const [data, isLoading] = useGetAccumulationDetail(memoId, newQuery);

  const paging = useAccumulationDetailPaging();

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Mã đơn hàng",
        dataIndex: "codeSequence",
        key: "codeSequence",
        width: 120,
        render(codeSequence) {
          return (
            canReadBill ?<Link
              className="link_"
              to={`/bill?keyword=${codeSequence}`}
              target={"_blank"}
            >
              {codeSequence}
            </Link> : codeSequence
          );
        },
      },
      {
        title: "Ngày hoàn thành",
        dataIndex: "timestamp",
        key: "timestamp",
        width: 120,
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 150,
        align: "center" as any,
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
    ],
    [data]
  );

  return (
    <div>
      <WhiteBox>
        <TableAnt
          dataSource={data?.bills}
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
