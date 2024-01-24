import { Col, Modal, Row, Select, Table, Form, Tabs, DatePicker } from "antd";
import React, { useMemo, useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import PaymentVouchers from "./Payment";
import ReceiptVouchers from "./Receipt";
import { get, head, transform } from "lodash";
import Search from "antd/es/input/Search";
import { MAP_STATUS_VOUCHERS_VI } from "~/constants/defaultValue";
import dayjs from "dayjs";
type propsType = {};
type optionsSearch = {
  value: string;
  label: string;
};
const optionsSearch: optionsSearch[] = [
  {
    value: "codeSequence",
    label: "Mã phiếu",
  },
  {
    value: "status",
    label: "Trạng thái",
  },
  {
    value: "reason",
    label: "Lý do",
  },
  {
    value: "totalAmount",
    label: "Tổng tiền",
  },
  // {
  //   value: "isCreated",
  //   label: "Ngày tạo",
  // },
  // {
  //   value: "isDateApproved",
  //   label: "Ngày duyệt",
  // },
];

export default function Vouchers(props: propsType): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("1");
  const [searchBy, setSearchBy] = useState(head(optionsSearch)?.value || "");
  const [keyword, setKeyword] = useState("");
  const [queryPayment, setQueryPayment] = useState<any>();
  const [queryReceipt, setQueryReceipt] = useState<any>();
  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DDTHH:mm:ss"),
    }),
    []
  );
  const [date, setDate] = useState(defaultDate);

  const onSearch = () => {
    let query;
    switch (activeTab) {
      case "1":
        query = queryReceipt;
        break;
      case "2":
        query = queryPayment;
        break;
      default:
        break;
    }
  };

  const onSearchByStatus = (value: string) => {
    console.log(value)
  };

  const onChangeSelect = (value: string) => {
    setSearchBy(value);
    setKeyword("");
  };
  return (
    <>
      <WhiteBox>
        <Breadcrumb title="Sổ quỹ" />
        <div className="select-search">
          <div className="select-search__left">
            <Row gutter={5}>
              <Col>
                <Select
                  style={{
                    width: 300,
                  }}
                  options={optionsSearch}
                  showSearch
                  placeholder={"Tiếm theo..."}
                  value={searchBy}
                  onChange={onChangeSelect}
                  // onSelect={onSelect}
                />
              </Col>
              <Col>
                {
                  {
                    codeSequence: (
                      <Search
                        placeholder={`Tìm ${optionsSearch
                          ?.find((item: any) => item.value === searchBy)
                          ?.label?.toLowerCase()}`}
                        onSearch={onSearch}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{
                          width: 300,
                        }}
                        allowClear
                        enterButton
                        value={keyword}
                      />
                    ),
                    value: (
                      <Search
                        placeholder={`Tìm ${optionsSearch
                          ?.find((item: any) => item.value === searchBy)
                          ?.label?.toLowerCase()}`}
                        onSearch={onSearch}
                        style={{
                          width: 300,
                        }}
                        allowClear
                        enterButton
                        value={keyword}
                      />
                    ),
                    reason: (
                      <Search
                        placeholder={`Tìm ${optionsSearch
                          ?.find((item: any) => item.value === searchBy)
                          ?.label?.toLowerCase()}`}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{
                          width: 300,
                        }}
                        allowClear
                        enterButton
                        value={keyword}
                      />
                    ),
                    status: (
                      <Select
                        mode="multiple"
                        allowClear
                        style={{
                          width: 200,
                        }}
                        placeholder="Vui lòng chọn trạng thái"
                        onChange={onSearchByStatus}
                      >
                        {transform(
                          MAP_STATUS_VOUCHERS_VI,
                          (result: any, value: any, key: any) => {
                            result.push({
                              label: get(value, "name", ""),
                              value: key,
                              color: get(value, "colorStyle", ""),
                            });
                          },
                          []
                        )?.map((e: any) => (
                          <Select.Option value={get(e, "value")}>
                            <p style={{ color: `${e.color}` }}>
                              {get(e, "label")}
                            </p>
                          </Select.Option>
                        ))}
                      </Select>
                    ),
                  }[searchBy]
                }
              </Col>
            </Row>
          </div>
        </div>
        <Row
          justify={"space-between"}
          style={{ width: "50%", marginTop: "20px", padding: "0px" }}
        >
          <Col flex={1}>
            <Row>
              <Col span={12}>
                <Form.Item label={"Từ ngày"} name="startDate">
                  <DatePicker
                    defaultValue={dayjs(date.startDate)}
                    onChange={(e) =>
                      setDate({
                        ...date,
                        startDate: dayjs(e).format("YYYY-MM-DD"),
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={"Đến ngày"} name="endDate">
                  <DatePicker
                    defaultValue={dayjs(date.endDate)}
                    onChange={(e) =>
                      setDate({
                        ...date,
                        endDate: dayjs(e).format("YYYY-MM-DD"),
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Phiếu thu" key="1">
            <ReceiptVouchers
              listOptionSearch={optionsSearch}
              keyword={keyword}
              searchBy={searchBy}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Phiếu chi" key="2">
            <PaymentVouchers
                listOptionSearch={optionsSearch}
                keyword={keyword}
                searchBy={searchBy}
            />
          </Tabs.TabPane>
        </Tabs>
      </WhiteBox>
    </>
  );
}
