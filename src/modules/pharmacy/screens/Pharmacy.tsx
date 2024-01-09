import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useGetPharmacies,
  usePharmacyPaging,
  useUpdatePharmacy,
} from "../pharmacy.hook";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import { omit } from "lodash";

const dataFake = [
  {
    id: 1,
    code: "P01",
    fullName: "Pharmacy 01",
    phoneNumber: "0123456789",
    address: "HCM",
  },
  {
    id: 2,
    code: "P02",
    fullName: "Pharmacy 02",
    phoneNumber: "0123456789",
    address: "HCM",
  },
  {
    id: 3,
    code: "P03",
    fullName: "Pharmacy 03",
    phoneNumber: "0123456789",
    address: "HCM",
  },
];

const columns: ColumnsType = [
  {
    title: "Mã nhà thuốc",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Tên nhà thuốc",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
    render(value, record, index) {
      return concatAddress(value);
    },
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
  },
];

export default function Pharmacy() {
  const { t }: any = useTranslate();
  const [pharmacies, isLoading] = useGetPharmacies();
  console.log(pharmacies, "pharmacies");
  const { query, onParamChange } = usePharmacyPaging();
  const [, updatePharmacy] = useUpdatePharmacy();
  const paging = usePharmacyPaging();

  const onChangeStatus = (
    _id: any,
    status: any,
    isSubmitLoading: any,
    record: any
  ) => {
    updatePharmacy({
      _id,
      status,
      isSubmitLoading,
      ...omit(record, ["_id", "status"]),
    });
  };

  // const onChange = ({ target }: any) => {
  //   switch (target.value) {
  //     case 2:
  //       onParamChange({ ...query, status: STATUS["ACTIVE"] });
  //       break;
  //     case 3:
  //       onParamChange({ ...query, status: STATUS["INACTIVE"] });
  //       break;
  //     default:
  //       onParamChange({ ...query, status: "" });
  //       break;
  //   }
  // };

  return (
    <div>
      <Breadcrumb title={t("list-pharmacies")} />
      <WhiteBox>
        <TableAnt
          dataSource={dataFake}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
        />
      </WhiteBox>
    </div>
  );
}
