import { Col, Modal, Row, Select, Table, Form, Tabs, DatePicker } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import PaymentVouchers from "../../paymentVoucher/screens/Payment";
import ReceiptVouchers from "../../receiptVoucher/screens/Receipt";
import { get, head, transform } from "lodash";
import Search from "antd/es/input/Search";
import { MAP_STATUS_VOUCHERS_VI } from "~/constants/defaultValue";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { convertQueryString } from "~/utils/helpers";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import ExportExcelButton from "~/modules/export/component";
import useCheckBoxExport from "~/modules/export/export.hook";
import { useArrCheckBoxRedux } from "../vouchers.hook";
import { PATH_APP } from "~/routes/allPath";
import { useChangeDocumentTitle } from "~/utils/hook";
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
    label: "Nội dung",
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
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
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
  const [date, setDate] = useState<any>(defaultDate);
  const arrCheckBoxRedux = useArrCheckBoxRedux();
  
  useEffect(() => {
    setKeyword('');
  }, [searchBy]);

  useEffect(() => {
    onSearch();
  }, [date]);

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
    let searchParams = `?page=1&limit=${query?.limit || 10}`;
    const assignSearchParams = (key: string, value?: string) => {
      let newKeyword = value?.toString();
      if (!['totalAmount']?.includes(key)) { // keyword not need clear space
        const regex = /[0-9.]/g;
        if (newKeyword && regex.test(newKeyword)) {
          newKeyword = newKeyword?.replace(/[. ]/g, '');
        };
      };
      searchParams += `&${key}=${newKeyword}`;
    };
    if (!date.startDate || date.startDate === 'Invalid date') {
      assignSearchParams('startDate', date?.defaultDate?.startDate)
    } else {
      assignSearchParams('startDate', date?.startDate)
      if (!date.endDate || date.endDate === 'Invalid date') {
        assignSearchParams('endDate', defaultDate?.endDate)
      } else {
        assignSearchParams('endDate', date?.endDate)
      }
      if (keyword) {
        assignSearchParams(searchBy, keyword);
      } else {
        searchParams = searchParams;
      };
    };
      // Navigate
      navigate(`${pathname}${searchParams}`);
  };

  const handleChangeStatus = (status: string) => {
    setKeyword(status);
    let query = {};

    // Set query by tab
    switch (activeTab) {
      case '1':
        query = queryReceipt;
        break;
      case '2':
        query = queryPayment;
        break;
      default:
        break;

    };
    let searchParams = convertQueryString(
      {
        ...query,
        [searchBy]: status
      }
    );
    navigate(`${pathname}${searchParams}`);
  };

  const onChangeSelect = (value: string) => {
    setSearchBy(value);
    setKeyword("");
    navigate(`${pathname}`);
  };
  
  const onChangeTab = (value: string) => {
    setActiveTab(value);
    navigate(`${pathname}`);
    setKeyword("");
  };
useChangeDocumentTitle(`Số quỹ của ${pathname === PATH_APP.vouchers.pharmacy ? 'Nhà thuốc' : 'Nhà cung cấp'}`,{dependency : [pathname]})
  return (
    <>
      <WhiteBox>
        <Breadcrumb title={`Sổ quỹ của ${pathname === PATH_APP.vouchers.pharmacy ? 'Nhà thuốc' : 'Nhà cung cấp'}`} />
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
                  placeholder={"Tìm kiếm theo..."}
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
                    totalAmount: (
                      <Search
                        placeholder={`Tìm ${optionsSearch
                          ?.find((item: any) => item.value === searchBy)
                          ?.label?.toLowerCase()}`}
                        onSearch={onSearch}
                        onChange={(e: any) => {
                          setKeyword(e.target.value);
                        }}
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
                    status: (
                      <Select
                        mode="multiple"
                        allowClear
                        style={{
                          width: 200,
                        }}
                        placeholder="Vui lòng chọn trạng thái"
                        onChange={handleChangeStatus}
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
              <Col>
                <WithPermission permission={POLICIES.DOWNLOAD_SUPPLIER}>
                    <ExportExcelButton
                      api= {'voucher'}
                      exportOption = 'voucher'
                      query={activeTab === '1' ? {...queryReceipt, typeVoucher: 'PT'} : {...queryPayment, typeVoucher: 'PC'}}
                      fileName={activeTab === '1' ? 'Phiếu thu' : 'Phiếu chi'}
                      ids={arrCheckBoxRedux}
                    />
                </WithPermission>
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
                        startDate: dayjs(e).format("YYYY-MM-DD HH:mm:ss"),
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
                        endDate: dayjs(e).format("YYYY-MM-DDTHH:mm:ss"),
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Tabs defaultActiveKey="1" onChange={onChangeTab} destroyInactiveTabPane>
          <Tabs.TabPane tab="Phiếu thu" key="1">
            <ReceiptVouchers
              listOptionSearch={optionsSearch}
              keyword={keyword}
              searchBy={searchBy}
              setQueryReceipt={setQueryReceipt}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Phiếu chi" key="2">
            <PaymentVouchers
                listOptionSearch={optionsSearch}
                keyword={keyword}
              searchBy={searchBy}
              setQueryPayment={setQueryPayment}
            />
          </Tabs.TabPane>
        </Tabs>
      </WhiteBox>
    </>
  );
}
