import {
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Modal,
  Popover,
  Row,
  Tag,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import SearchAnt from "~/components/Antd/SearchAnt";
import TableAnt from "~/components/Antd/TableAnt";
import WithPermission from "~/components/common/WithPermission";
import { REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import { useIsSuperAdmin } from "~/modules/auth/auth.hook";
import { DiscountFactory } from "~/modules/cumulativeDiscount/cumulativeDiscount.service";
import PaymentModule from "~/modules/paymentVoucher";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import billModule from "~/modules/sale/bill";
import { pagingTable } from "~/utils/helpers";
import ProcessCumulative from "../components/ProcessCumulative";
import Programme from "../components/Programme";
import RewardCumulative from "../components/RewardCumulative";
import {
  useGetLks,
  useLkPaging,
  useLkQueryParams,
  useUpdateLkParams,
} from "../lk.hook";
import { getValueOfLk } from "../lk.service";
import POLICIES from "~/modules/policy/policy.auth";
import ExportExcelButton from "~/modules/export/component/index";
import useCheckBoxExport from "~/modules/export/export.hook";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { CheckCircleOutlined, CheckCircleTwoTone, SearchOutlined } from "@ant-design/icons";

type propsType = {
  cumulativeSession: "IN" | "OUT";
  options?: {
    action?: boolean;
    showSession?: boolean;
    showIsDone?: boolean;
  };
};
export default function LkTabItem({
  cumulativeSession,
  options,
}: propsType): React.JSX.Element {
  // Hook
  const isSuperAdmin = useIsSuperAdmin();
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_CUMULATIVEEVENT);
  const canReadVoucher = useMatchPolicy(POLICIES.READ_VOUCHERPHARMACY)
  const [form] = Form.useForm();
  const [reFetch, setReFetch] = useState(false);
  const mutate = useCallback(() => setReFetch(!reFetch), [reFetch]);
  const [query] = useLkQueryParams(reFetch, cumulativeSession);
  const [keyword, { setKeyword, onParamChange }] = useUpdateLkParams(query);
  const [data, isLoading] = useGetLks(query);
  const paging = useLkPaging();
  const [dataInitForm, setData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [openVoucher, setOpenVoucher] = useState(false);
  const [idVoucher, setIdVoucher] = useState<string | null>(null);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();

  const onOpenPayment = (newData: any) => {
    setOpen(true);
    setData(newData);
  };
  const onClosePayment = () => {
    setOpen(false);
  };
  const onOpenVoucher = (id: any) => {
    setOpenVoucher(true);
    setIdVoucher(id);
  };
  const onCloseVoucher = () => {
    setOpenVoucher(false);
    setIdVoucher(null);
  };
  const columns: ColumnsType = [
    {
      title: "Mặt hàng",
      dataIndex: "product",
      key: "product",
      render(product, record, index) {
        return (
          <Popover
            title="Thông tin thêm"
            content={
              <span>
                Nhà cung cấp:{" "}
                <Typography.Text strong>
                  {get(record, "supplier.code", "")}
                </Typography.Text>{" "}
                - {get(record, "supplier.name", "")}
              </span>
            }
          >
            <span>
              <Typography.Text strong>
                {get(product, "codeBySupplier", "")} -{" "}
              </Typography.Text>
              {get(product, "name")}
            </span>
          </Popover>
        );
      },
    },
    {
      title: "Nhà thuốc",
      dataIndex: "pharmacy",
      key: "pharmacy",
      align: "center",
      render(pharmacy, record, index) {
        return <span>{get(pharmacy, "name")}</span>;
      },
    },

    {
      title: "Chương trình luỹ kế",
      dataIndex: "discount",
      key: "discount",
      width : 180,
      render(discount, record, index) {
        return (
          <Popover
            content={
              options?.showSession ? (
                <Programme
                  discount={discount}
                  sequence={get(record, "sequence", "")}
                />
              ) : null
            }
          >
            <a>{get(discount, "name", "")}</a>
          </Popover>
        );
      },
    },
    {
      title: "Đã tích luỹ",
      key: "cumulative",
      //   align : "center",
      width: 300,
      render(item, record, index) {
        return <ProcessCumulative record={record} options={{showIsDone : options?.showIsDone}}/>;
      },
    },
    {
      title: "Thưởng",
      dataIndex: "discount",
      key: "discount",
      //   align : "center",
      render(discount, record, index) {
        return <RewardCumulative record={record} />;
      },
    },
  ];


  if (options?.action) {
    columns.push({
      title: "Thao tác",
      dataIndex: "_id",
      key: "action",
      align: "center",
      fixed: "right",
      render(_id, record: any, index) {
        const { pharmacy, voucher } = record;
        const applyTimeSheet = get(record, "discount.applyTimeSheet");
        const typeRepeat = get(record, "discount.typeRepeat");
        const DiscountMethod = new DiscountFactory();
        const isInApplyTime =
          isSuperAdmin ??
          DiscountMethod.handleCheckIsInTimeApplyTimeSheet(
            applyTimeSheet,
            typeRepeat
          ); // Super Admin Can create All Day

        return (
          !!voucher ? <Flex vertical>
            <Tag icon={<CheckCircleOutlined twoToneColor={'#389F0C'}/>} bordered={false} color={'#389F0C'}>Đã phát thưởng</Tag>
            <Typography.Link disabled={!canReadVoucher} onClick={() => onOpenVoucher(get(voucher, "_id"))}>
            <SearchOutlined /> {get(voucher, "codeSequence", "")}
          </Typography.Link>
          </Flex> :
          <WithPermission permission={POLICIES.WRITE_VOUCHERPHARMACY}>
            <Button
              disabled={!!voucher ?? !isInApplyTime}
              onClick={() => {
                onOpenPayment({
                  totalAmount: getValueOfLk(record),
                  pharmacyId: get(pharmacy, "_id"),
                  method: {
                    data: _id,
                    type: "LK",
                  },
                  refCollection: REF_COLLECTION_UPPER["PHARMA_PROFILE"],
                });
              }}
              size="small"
              type="primary"
            >
              Tạo Phiếu chi
            </Button>
          </WithPermission>
        );
      },
    });
  }
  if(canDownload){
    columns.push({
      title: "Lựa chọn",
      key: "_id",
      width: 80,
      align: "center",
      render: (item: any, record: any) => {
        const id = record._id;
        return (
          <Checkbox
            checked={arrCheckBox.includes(id)}
            onChange={(e) => onChangeCheckBox(e.target.checked, id)}
          />
        );
      },
    });
  }
  return (
    <div>
      <Form form={form} initialValues={query}>
        <Row>
          <Col span={6}>
            <billModule.components.SelectPharmacy
              validateFirst={false}
              form={form}
              allowClear
              showIcon={false}
              size={"middle"}
              onChange={(value) => onParamChange({ pharmacyId: value })}
            />
          </Col>
          <Col span={6}>
            <Form.Item name={"product"}>
              <SearchAnt
                onParamChange={onParamChange}
                keyPath="product"
                placeholder="Tìm mặt hàng..."
              />
            </Form.Item>
          </Col>
          <WithPermission permission={POLICIES.DOWNLOAD_CUMULATIVEEVENT}>
          <Col style={{marginLeft : 'auto'}}>
            <ExportExcelButton
              api="cumulative_event"
              exportOption="cumulative_event"
              query={query}
              fileName="Danh sách các mặt hàng luỹ kế"
              ids={arrCheckBox}
            />
          </Col>
          </WithPermission>
        </Row>
      </Form>
      <TableAnt
        loading={isLoading}
        dataSource={data}
        columns={columns}
        size="small"
        pagination={pagingTable(paging, onParamChange)}
        // scroll={{x : 1700}}
      />
      <Modal
        title="Phiếu chi"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={"auto"}
        footer={null}
        destroyOnClose
      >
        <PaymentModule.components.PaymentVoucherFormPharmacy
          onClose={() => onClosePayment()}
          initData={dataInitForm}
          callback={mutate}
        />
      </Modal>
      <Modal
        footer={null}
        open={openVoucher}
        onCancel={onCloseVoucher}
        width={1366}
        destroyOnClose
      >
        <PaymentVoucherForm
          id={idVoucher}
          onClose={onCloseVoucher}
          refCollection={REF_COLLECTION_UPPER.PHARMA_PROFILE}
        />
      </Modal>
    </div>
  );
}
