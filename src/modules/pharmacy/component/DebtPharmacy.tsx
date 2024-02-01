import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { concatAddress } from "~/utils/helpers";
import {
  useDeletePharmacy,
  useGetPharmacies,
  usePharmacyPaging,
  usePharmacyQueryParams,
  useUpdatePharmacy,
  useUpdatePharmacyParams,
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

interface UserProps {
  currentTab: string | undefined;
}


export default function DebtPharmacy() {
  const { t }: any = useTranslate();
  const [query] = usePharmacyQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdatePharmacyParams(query);
  const [pharmacies, isLoading] = useGetPharmacies(query);

  const onCloseForm = useCallback(() => {
    setPharmacyId(null);
    setIsOpenForm(false);
  }, []);

  const [, updatePharmacy] = useUpdatePharmacy(onCloseForm);
  const [isSubmitLoading, deletePharmacy] = useDeletePharmacy();
  const [pharmacyId, setPharmacyId] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const paging = usePharmacyPaging();

  const onOpenForm = useCallback(
    (id?: any) => {
      if (id) {
        setPharmacyId(id);
      }
      setIsOpenForm(true);
    },
    [setPharmacyId, setIsOpenForm]
  );
  const [open, setOpen] = useState(false);
  const [debt, setDebt] = useState<number | null>();

  const onOpenReceipt = (item: any) => {
    setOpen(true);
    setPharmacyId(item?._id);
    setDebt(item?.resultDebt);
  };
  const onCloseReceipt = () => {
    setOpen(false);
    setPharmacyId(null);
  };

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

  const onChange = ({ target }: any) => {
    switch (target.value) {
      case 2:
        onParamChange({ ...query, status: STATUS["ACTIVE"] });
        break;
      case 3:
        onParamChange({ ...query, status: STATUS["INACTIVE"] });
        break;
      default:
        onParamChange({ ...query, status: "" });
        break;
    }
  };

  return (
    <div>
      <Breadcrumb title={t("list-pharmacies")} />
      <Row className="mb-3" justify={"space-between"}>
        <Col span={8}>
          <Search
            enterButton="Tìm kiếm"
            placeholder="Nhập để tìm kiếm"
            allowClear
            onSearch={() => onParamChange({ keyword })}
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
        </Col>
        <WithPermission permission={POLICIES.WRITE_PHARMAPROFILE}>
          <Col>
            <Button
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={() => onOpenForm()}
            >
              Thêm mới
            </Button>
          </Col>
        </WithPermission>
      </Row>
      <WithPermission permission={POLICIES.UPDATE_PHARMAPROFILE}>
        <Space style={{ marginBottom: 20 }}>
          <Typography style={{ fontSize: 14, marginRight: 20 }}>
            Phân loại trạng thái theo :
          </Typography>
          <Row gutter={14}>
            <Radio.Group
              onChange={onChange}
              optionType="button"
              buttonStyle="solid"
              defaultValue={(() => {
                switch (query?.status) {
                  case "ACTIVE":
                    return 2;
                  case "INACTIVE":
                    return 3;
                  default:
                    return 1;
                }
              })()}
            >
              <Radio.Button value={1}>Tất cả</Radio.Button>
              <Radio.Button value={2}>{STATUS_NAMES["ACTIVE"]}</Radio.Button>
              <Radio.Button value={3}>{STATUS_NAMES["INACTIVE"]}</Radio.Button>
            </Radio.Group>
          </Row>
        </Space>
      </WithPermission>
      <WhiteBox>
        <TableAnt
          dataSource={pharmacies}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
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
      
      <Modal
        title="Phiếu chi"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <ReceiptVoucherForm
          onClose={() => onCloseReceipt()}
          pharmacyId={pharmacyId}
          refCollection={REF_COLLECTION_UPPER.PHARMA_PROFILE}
          debt={debt}
          from="Pharmacy"
        />
      </Modal>
    </div>
  );
}
