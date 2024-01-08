import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import {
  useSupplierPaging,
  useGetSuppliers,
  useSupplierQueryParams,
  useUpdateSupplierParams,
} from "../supplier.hook";
const columns: ColumnsType = [
  {
    title: "Nhà cung cấp",
    dataIndex: "name",
    key: "name",
    render(value) {
      return get(value, "vi", "");
    },
  },
];
export default function Supplier() : React.JSX.Element {
  const { t }: any = useTranslate();
  const [query] = useSupplierQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateSupplierParams(query);
  const [data, isLoading] = useGetSuppliers(query);
  const paging = useSupplierPaging();
  return (
    <div>
      <Breadcrumb title={t("list-supplier")} />
      <Row className="mb-3" justify={"space-between"}>
        <Col span={8}>
          <Search enterButton="Tìm kiếm" placeholder="Nhập để tìm kiếm" />
        </Col>
        <Col>
          <Button icon={<PlusCircleOutlined />} type="primary">
            Thêm nhà cung cấp
          </Button>
        </Col>
      </Row>
      <WhiteBox>
        <TableAnt
          dataSource={data}
          loading={isLoading}
          columns={columns}
          rowKey={(rc) => rc?._id}
          stickyTop
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
          }}
        />
      </WhiteBox>
    </div>
  );
}
