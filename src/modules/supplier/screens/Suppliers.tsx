import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Switch, Typography } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { useCallback, useMemo, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import Vnd from "~/components/common/Vnd/index";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import TabSupplier from "../components/TabSupplier";
import {
  useGetSuppliers, useSupplierPaging, useSupplierQueryParams,
  useUpdateSupplierParams
} from "../supplier.hook";

export default function Supplier() : React.JSX.Element {
  // Translate
  const { t }: any = useTranslate();

  // State Form
  const [id,setId]:any = useState();
  const [isOpenForm,setIsOpenForm]:any = useState(false);
  
  // Hook
  const [query] = useSupplierQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateSupplierParams(query);
  const [data, isLoading] = useGetSuppliers(query);
  const paging = useSupplierPaging();

  // Control form
  const onOpenForm = useCallback((idSelect?:any) => {
    if(idSelect){
      setId(idSelect);
    };
    setIsOpenForm(true);
  },[]);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  },[]);

  // Columns Table
  const columns: ColumnsType = useMemo(() => [
    {
      title: "Nhà cung cấp",
      dataIndex: "name",
      key: "name",
      render(value) {
        return get(value, "vi", "");
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "name",
      key: "name",
      align : "center",
      render(value) {
        return '0905970965'
      },
    },
    {
      title: "Công nợ",
      dataIndex: "name",
      key: "name",
      align : "center",
      render(value) {
        return <Typography.Text strong>100.000 <Vnd /></Typography.Text>
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "name",
      key: "name",
      align : "center",
      width : '10%',
      render(value) {
        return <Switch />
        
      
      },
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align : "center",
      render(_id) {
        return <Row justify={"center"} align={'middle'}>
          <Button onClick={() => onOpenForm(_id)} type="primary">
            Xem chi tiết
          </Button>
          <Divider type="vertical"/>
          <Button danger>
            Xoá
          </Button>
        </Row>
          
      },
    },
  ],[onOpenForm]);
  return (
    <div>
      <Breadcrumb title={t("list-supplier")} />
      <Row className="mb-3" justify={"space-between"}>
        <Col span={8}>
          <Search onSearch={(value) => onParamChange({keyword:value?.trim()})} enterButton="Tìm kiếm" placeholder="Nhập để tìm kiếm" />
        </Col>
        <Col>
          <Button onClick={() => onOpenForm()} icon={<PlusCircleOutlined />} type="primary">
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
      <ModalAnt width={900} open={isOpenForm} onCancel={onCloseForm} footer={null} destroyOnClose>
      <TabSupplier id={id}/>
      </ModalAnt>
    </div>
  );
}
