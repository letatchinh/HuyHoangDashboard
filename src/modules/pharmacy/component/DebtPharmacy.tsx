import { ColumnsType } from "antd/es/table";
import { formatNumberThreeComma, formatter } from "~/utils/helpers";
import {
  useGetPharmacyDebt,
  usePharmacyDebtPaging,
  usePharmacyDebtQuery,
  usePharmacyPaging,
} from "../pharmacy.hook";
import TableAnt from "~/components/Antd/TableAnt";
import moment from "moment";
import { useMemo, useState } from "react";
import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Spin,
} from "antd";
import { FormFieldSearch, propsType } from "../pharmacy.modal";
import { Link } from "react-router-dom";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import dayjs from "dayjs";
import { get, sum } from "lodash";
import useCheckBoxExport from "~/modules/export/export.hook";
import WithPermission from "~/components/common/WithPermission";
import ExportExcelButton from "~/modules/export/component";

interface UserProps {
  currentTab: string | undefined;
}

export default function DebtPharmacy(props: propsType) {
  const { pharmacyId } = props;
  const [query, onTableChange] = usePharmacyDebtQuery();
  const canReadBill = useMatchPolicy(POLICIES.READ_BILL);
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_DEBTPHARMACY);
  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    }),
    []
  );

  const [date, setDate] = useState<any>(defaultDate);
  const newQuery = useMemo(
    () => ({
      ...query,
      pharmaId: pharmacyId,
      ...date,
      // status: searchByStatus?.toString(),
    }),
    [pharmacyId, query, date]
  );
  const [data, isLoading] = useGetPharmacyDebt(newQuery);
  
  const paging = usePharmacyDebtPaging();
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const totalPage = useMemo(() => {
    return sum(data?.map((e: any) => get(e, "resultDebt", 0)));
  }, [data]);

  const renderLoading = (component: any) => {
    return isLoading ? <Spin /> : component;
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
            canReadBill ?  <Link className="link_" to={`/bill?keyword=${codeSequence}`} target={'_blank'}>
              {codeSequence}
            </Link> 
              : codeSequence
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
        width: 200,
        render(value) {
          return formatter(value);
        },
      },
      {
        title: "Phương thức thanh toán",
        dataIndex: "debtType",
        key: "debtType",
        width: 250,
        
      },
      {
        title: "Đã thanh toán",
        dataIndex: "pair",
        key: "pair",
        width: 120,
        render(value) {
          return formatter(value);
        },
      },
      {
        title: "Nợ",
        dataIndex: "resultDebt",
        key: "resultDebt",
        width: 120,
        render(value) {
          return formatter(value);
        },
      },
      ...(canDownload
        ? [
            {
              title: "Lựa chọn",
              key: "_id",
              width: 80,
              align: "center" as any,
              render: (item: any, record: any) => {
                const id = record._id;
                return (
                  <Checkbox
                    checked={arrCheckBox.includes(id)}
                    onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                  />
                );
              },
            },
          ]
        : []),
    ],
    [canDownload, arrCheckBox]
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
        <Row gutter={16}>
          <Col>
            <Form.Item<FormFieldSearch> name={"startDate"} label="Ngày bắt đầu">
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
          <Col>
            <Form.Item<FormFieldSearch> name={"endDate"} label="Ngày kết thúc">
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
        <Row>
          <WithPermission permission={POLICIES.DOWNLOAD_PHARMAPROFILE}>
            <Col>
              <ExportExcelButton
                fileName="DS công nợ "
                api="pharma-profile-debt"
                exportOption="pharmaDebt"
                query={newQuery}
                ids={arrCheckBox}
              />
            </Col>
          </WithPermission>
        </Row>
      </Row>
      <Row
        gutter={30}
        style={{
          // marginTop: "10px",
          marginBottom: "10px",
          padding: "5px",
        }}
      >
        {/* {renderLoading(
          <Col className="sumary-row__left" span={10}>
            <h6>Tổng tiền theo thời gian: </h6>
            <h6
              style={{
                marginLeft: "10px",
              }}
            >
              {formatNumberThreeComma(totalPage)}đ
            </h6>
          </Col>
        )} */}
        {renderLoading(
          <Col span={10} className="sumary-row__left">
            <h6>Tổng tiền công nợ trang hiện tại:</h6>
            <h6
              style={{
                marginLeft: "10px",
              }}
            >{`${formatNumberThreeComma(totalPage)}đ`}</h6>
          </Col>
        )}
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
          onChange(page, pageSize) {
            onTableChange({ page, limit: pageSize });
          },
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng: ${total} `,
        }}
      />
    </div>
  );
}
