import React, { useMemo, useState } from "react";
import { contextReport, fomartNumber } from "../reportSalaryPartner.hook";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Popover,
  Row,
  Table,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import dayjs from "dayjs";
import BaseBorderBox from "~/components/common/BaseBorderBox";
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
            <Button type="link">{item.codeSequence}</Button> ~{"   "}
            <strong>{fomartNumber(item.value)}</strong> (
            {Math.ceil(item.discount * 100)}%)
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

  const hide = () => {
    setClicked(false);
    setHovered(false);
  };

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
];
export default function ModalDetail(props: propsType): React.JSX.Element {
  const { data } = contextReport.useContextReportSalaryPartner;
  const [form] = Form.useForm();
  const infoData: any = useMemo(() => {
    return data.find((p: any) => p._id === props?.id);
  }, [data, props?.id]);

  return (
    <div>
      {/* <PieChart width={400} height={400} infoData={infoData}></PieChart> */}
      <BaseBorderBox title={"Thông tin chung"}>
        <Form form={form} >
          <Row style={{width:'100%',margin:'0 0'}} gutter={24}>
            <Col span={12}>
              <Form.Item name={"fullName"} label="Tên">
                <Input variant="borderless" readOnly/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"phoneNumber"} label="Số điện thoại">
                < Input variant="borderless" readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </BaseBorderBox>
      <Table
        size="small"
        columns={columns}
        dataSource={infoData?.revenue ?? []}
      />
    </div>
  );
}
