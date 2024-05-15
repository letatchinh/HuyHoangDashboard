/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from "react";
import { contextReport, fomartNumber } from "../reportSalaryPartner.hook";
import {
  Badge,
  Button,
  Col,
  Flex,
  Form,
  Input,
  Popover,
  Row,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { get, head } from "lodash";
import dayjs from "dayjs";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import { PATH_APP } from "~/routes/allPath";
import { formatter } from "~/utils/helpers";
import ModalAnt from "~/components/Antd/ModalAnt";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import ReceiptVoucherForm from "~/modules/receiptVoucher/components/ReceiptVoucherForm";

import { REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import { MenuOutlined } from "@ant-design/icons";
import VoucherList from "./VoucherList";
import { ItemVoucher } from "./Context";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { METHOD_TYPE } from "~/modules/vouchers/constants";
import { useLocation } from "react-router-dom";
type propsType = {
  id?: string;
};
type propsBillRenderType = {
  dataSource: Partial<{
    billSales: any[];
    billTeams: any[];
    billId: {
      historyStatus: {
        COMPLETED: Date;
      };
      pharmacyId: {
        fullName: string;
      };
    };
  }>;
  getType: "billSales" | "billTeams";
};

const BillRender = (props: propsBillRenderType) => {
  return (
    <Flex gap={5} vertical>
      {get(props.dataSource, [props.getType], []).map((item) => {
        return (
          <div style={{ borderBottom: "0.2px solid #333" }}>
            {props.getType === "billTeams" && (
              <strong style={{ display: "inline-block", minWidth: "250px" }}>
                {get(item, ["billId", "pharmacyId", "fullName"])}
              </strong>
            )}{" "}
            <strong>
              {dayjs(
                get(item, ["billId", "historyStatus", "COMPLETED"])
              ).format("DD/MM/YYYY")}
            </strong>
            <Button
              href={PATH_APP.bill.root + "?keyword=" + item?.codeSequence}
              target={"_blank"}
              type="link"
            >
              {item?.codeSequence}
            </Button>{" "}
            ~{"   "}
            <strong style={{color:item?.value<0?'red':''}}>{fomartNumber(item?.value)}</strong> (
            {Math.ceil(item?.discount * 100)}%)
          </div>
        );
      })}
    </Flex>
  );
};
const DetailOver = ({
  total,
  record,
  getType,
}: {
  total: number;
  record: any;
  getType: "billSales" | "billTeams";
}) => {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleHoverChange = (open: boolean) => {
    setHovered(open);
    setClicked(false);
  };

  const handleClickChange = (open: boolean) => {
    setHovered(false);
    setClicked(open);
  };
  if (!total)
    return (
      <Button type="text" ghost>
        {total}
      </Button>
    );

  return (
    <Tooltip
      title={"Xem chi tiết"}
      style={{}}
      onOpenChange={handleHoverChange}
      open={hovered}
      trigger={"hover"}
    >
      <Popover
        title="Danh sách đơn hàng"
        style={{ width: 400 }}
        content={<BillRender dataSource={record} getType={getType} />}
        trigger={"click"}
        open={clicked}
        onOpenChange={handleClickChange}
        placement="bottomRight"
      >
        <Button type="text" size="small">
          {fomartNumber(total)}
        </Button>
      </Popover>
    </Tooltip>
  );
};
const BoxMoney = ({ title, total }: { title: any; total: any }) => (
  <Flex vertical>
    <span style={{ fontSize: 16, color: "#525667" }}>{title}</span>
    <span style={{ fontWeight: 700, fontSize: 16, color: "#525667" }}>
      {formatter(total)}
    </span>
  </Flex>
);
const columns: ColumnsType = [
  {
    title: "Tên mặt hàng",
    dataIndex: ["productId", "name"],
    render: (name, record) => {
      return (
        <strong>
          {get(record, ["productId", "codeBySupplier"]) + " - " + name}
        </strong>
      );
    },
  },
  {
    title: "Mức CK",
    dataIndex: "billSales",
    align: "center",
    width: 100,
    render: (billSales, record) => {
      let value:any =head(billSales);
      return <Typography.Text>{Math.ceil(value?.discount * 100)}%</Typography.Text>;
    },
  },
  {
    title: "Doanh số cá nhân",
    dataIndex: "revenueSelf",
    align: "center",
    width: 300,
    render: (total, record) => {
      return <DetailOver total={total} record={record} getType="billSales" />;
    },
  },
  {
    title: "Doanh số nhóm",
    dataIndex: "revenueGroup",
    align: "center",
    width: 300,
    render: (total, record) => {
      return <DetailOver total={total} record={record} getType="billTeams" />;
    },
  },
  {
    title: "Tổng doanh số",
    align: "center",
    key: "total",
    width: 300,
    render: (total, record) => {
      return formatter(
        get(record, "revenueGroup", 0) + get(record, "revenueSelf", 0)
      );
    },
  },
];
export default function ModalDetail(props: propsType): React.JSX.Element {
  const { data,mutate } = contextReport.useContextReportSalaryPartner;
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const { pathname } = useLocation();
  const infoData: any = useMemo(() => {
    return data.find((p: any) => p._id === props?.id);
  }, [data, props?.id]);
  const onOpenPayment = useCallback(() => {
    setOpen(true);
  }, []);
  const onClosePayment = useCallback(() => {
    setOpen(false);
    mutate();
  }, []);
  const onOpenReceipt = useCallback(() => {
    setOpenReceipt(true);
  }, []);
  const onCloseReceipt = useCallback(() => {
    setOpenReceipt(false);
    mutate();
  }, []);

  const totalPayment = useMemo(() => get(infoData, "vouchers", [])?.reduce((sum:number,cur:ItemVoucher) => {
    if(cur?.status === 'APPROVED' && cur?.typeVoucher === 'PC'){
       return sum + cur?.totalAmount;
    }
    return sum
  },0),[infoData]);
  const totalReceipt = useMemo(() => get(infoData, "vouchers", [])?.reduce((sum:number,cur:ItemVoucher) => {
    if(cur?.status === 'APPROVED' && cur?.typeVoucher === 'PT'){
       return sum + cur?.totalAmount;
    }
    return sum
  },0),[infoData]);
  const totalVoucher = useMemo(() => get(infoData, "vouchers", [])?.reduce((sum:number,cur:ItemVoucher) => {
    
    if(cur?.status === 'APPROVED'){
      if(cur?.typeVoucher === 'PC') return sum - cur?.totalAmount;
      if(cur?.typeVoucher === 'PT') return sum + cur?.totalAmount;
      return sum
    }
    return sum
  },0),[infoData]);

  const initTotal = useMemo(
    () =>
      get(infoData, "revenue", [])?.reduce(
        (sum: number, cur: any) =>
          sum + get(cur, "revenueGroup", 0) + get(cur, "revenueSelf", 0),
        0
      )
      ,
    [infoData]
    );

  const total = useMemo(
    () =>
      initTotal + totalVoucher
      ,
    [initTotal,totalVoucher]
    );

    
  return (
    <div>
      {/* <PieChart width={400} height={400} infoData={infoData}></PieChart> */}
      <BaseBorderBox title={"Thông tin chung"}>
        <Form
          form={form}
          initialValues={{
            fullName: get(infoData, "salerId.fullName", ""),
            phoneNumber: get(infoData, "salerId.phoneNumber", ""),
          }}
        >
          <Row style={{ width: "100%", margin: "0 0" }} gutter={24}>
            <Col span={12}>
              <Form.Item name={"fullName"} label="Tên">
                <Input variant="borderless" readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"phoneNumber"} label="Số điện thoại">
                <Input variant="borderless" readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </BaseBorderBox>
      <Table
        size="small"
        columns={columns}
        dataSource={infoData?.revenue ?? []}
        pagination={false}
      />
      <Flex justify={'space-between'} align='center'>
        <Flex gap={50} justify='space-around' align='center'>
          <BoxMoney title={'Tổng phải thu'} total={initTotal < 0 ? initTotal : 0}/>
          <BoxMoney title={'Tổng phải chi'} total={initTotal > 0 ? initTotal : 0}/>
          <BoxMoney title={'Tổng đã thu'} total={totalReceipt}/>
          <BoxMoney title={'Tổng đã chi'} total={totalPayment}/>
        </Flex>
      <Flex style={{ marginTop: 20 }} justify="end" gap={10} align='center'>
        <WithPermission permission={pathname === PATH_APP.reportSalaryPartner.root ? POLICIES.READ_VOUCHERSALARYPARTNER : POLICIES.READ_VOUCHERSALARYEMPLOYEE}>
        <Popover
          trigger={["click"]}
          title="Danh sách phiếu"
          content={<VoucherList dataSource={get(infoData, "vouchers", [])} />}
        >
          <Badge count={get(infoData, "vouchers", []).length}>
            <Button icon={<MenuOutlined />} type="primary" ghost>
              Danh sách phiếu
            </Button>
          </Badge>
        </Popover>
        </WithPermission>
        {total === 0 && <Tag color={'success'}>Đã hoàn tất thanh toán</Tag>}
      <WithPermission permission={pathname === PATH_APP.reportSalaryPartner.root ? POLICIES.WRITE_VOUCHERSALARYPARTNER : POLICIES.WRITE_VOUCHERSALARYEMPLOYEE}>
      {total > 0 && (
          <Button type="primary" onClick={onOpenPayment}>
            Tạo phiếu chi
          </Button>
        )}
        {total < 0 && <Button type="primary" onClick={onOpenReceipt}>
            Tạo phiếu thu
          </Button>}
      </WithPermission>
      </Flex>
      </Flex>

      <ModalAnt
        title="Phiếu chi"
        open={open}
        onCancel={onClosePayment}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <PaymentVoucherForm
          initData={{
            reason: "Chi Lương",
            paymentMethod: "COD",
          }}
          {...infoData?.typeSaler === 'employee' && {employeeId : get(infoData, "salerId._id")}}
          {...infoData?.typeSaler === 'partner' && {partnerId : get(infoData, "salerId._id")}}
          onClose={() => onClosePayment()}
          refCollection={REF_COLLECTION_UPPER[infoData?.typeSaler?.toUpperCase()]}
          debt={total}
          method={{
            data: infoData?._id,
            type: METHOD_TYPE.VOUCHER_SALARY,
          }}
          dataAccountingDefault={[
            {
              creditAccount: 1111,
              amountOfMoney: total || 0,
            },
          ]}
        />
      </ModalAnt>
      <ModalAnt
        title="Phiếu thu"
        open={openReceipt}
        onCancel={onCloseReceipt}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <ReceiptVoucherForm
          initData={{
            reason: "Thu Lương",
            paymentMethod: "COD",
          }}
          method={{
            data: infoData?._id,
            type: METHOD_TYPE.VOUCHER_SALARY as any,
          }}
          onClose={() => onCloseReceipt()}
          {...infoData?.typeSaler === 'employee' && {employeeId : get(infoData, "salerId._id")}}
          {...infoData?.typeSaler === 'partner' && {partnerId : get(infoData, "salerId._id")}}
          refCollection={REF_COLLECTION_UPPER[infoData?.typeSaler?.toUpperCase()]}
          debt={total}
          from="Pharmacy"
          dataAccountingDefault={[
            {
              debitAccount: 1111,
              amountOfMoney: total || 0,
            },
          ]}
        />
      </ModalAnt>
    </div>
  );
}
