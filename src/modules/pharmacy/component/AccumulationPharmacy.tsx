import { ColumnsType } from "antd/es/table";
import useTranslate from "~/lib/translation";
import { formatter } from "~/utils/helpers";
import {
  useAccumulationPaging,
  useAccumulationQuery,
  useGetAccumulation,
  useUpdateAccumulationParams,
} from "../pharmacy.hook";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import { omit, get } from "lodash";
import { useMemo, useState } from "react";
import { Col, DatePicker, Form, Row, Space } from "antd";
import Search from "antd/es/input/Search";
import { FormFieldSearch, propsAccumulation } from "../pharmacy.modal";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import AccumulationDetailPharmacy from "./AccumulationDetailPharmacy";

interface UserProps {
  currentTab: string | undefined;
}

export default function AccumulationPharmacy(props: propsAccumulation) {
  const { t }: any = useTranslate();
  const [query, onTableChange] = useAccumulationQuery();
  const { pharmacyId, targetType } = props;
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateAccumulationParams(query);
  const defaultDate = useMemo(
    () => ({
      startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
      endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    }),
    []
  );

  const [date, setDate] = useState<any>(defaultDate);
  const [itemActive, setItemActive] = useState<any>();
  const newQuery = useMemo(
    () => ({
      ...query,
      pharmacyId: pharmacyId,
      targetType: targetType,
      ...date,
    }),
    [pharmacyId, query, date, targetType]
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
        render(variants, record, index) {
          return (
            <Space>
              {variants?.map((item: any) => get(item, "variantCode", ""))}
            </Space>
          );
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
        render(variants, record, index) {
          return (
            <Space>
              {variants?.map((item: any) => get(item, "unit", "") + ", ")}
            </Space>
          );
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
      </Row>

      <WhiteBox>
        <TableAnt
          dataSource={data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          scroll={{ x: "max-content" }}
          columns={targetType == "PRODUCT" ? columns : columnsGroup}
          size="small"
          // onChange={onTableChange}
          expandable={{
            expandedRowRender: (record: any) => (
              <AccumulationDetailPharmacy
                _id={record._id}
                pharmacyId={pharmacyId}
                targetType={targetType}
                date={date}
              />
            ),
            expandedRowKeys: [itemActive],
          }}
          onExpand={(expanded, record) => {
            expanded ? setItemActive(record._id) : setItemActive(null);
          }}
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
    </div>
  );
}
