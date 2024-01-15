import { DeleteOutlined, InfoCircleTwoTone, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Popconfirm, Row, Switch, Typography } from "antd";
import Search from "antd/es/input/Search";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import Vnd from "~/components/common/Vnd/index";
import WhiteBox from "~/components/common/WhiteBox";
import useTranslate from "~/lib/translation";
import { PATH_APP } from "~/routes/allPath";
import { concatAddress } from "~/utils/helpers";
import TabSupplier from "../components/TabSupplier";
import { STATUS_SUPPLIER } from "../constants";
import {
  useDeleteSupplier,
  useGetSuppliers,
  useSupplierPaging,
  useSupplierQueryParams,
  useUpdateSupplier,
  useUpdateSupplierParams,
} from "../supplier.hook";
import { STATUS_SUPPLIER_TYPE } from "../supplier.modal";

export default function Supplier(): React.JSX.Element {
  // Translate
  const { t }: any = useTranslate();

  // State Form
  const [id, setId]: any = useState();
  const [isOpenForm, setIsOpenForm]: any = useState(false);

  // Control form
  const onOpenForm = useCallback((idSelect?: any) => {
    if (idSelect) {
      setId(idSelect);
    }
    setIsOpenForm(true);
  }, []);
  const onCloseForm = useCallback(() => {
    setIsOpenForm(false);
    setId(null);
  }, []);

  // Hook
  const [query] = useSupplierQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateSupplierParams(query);
  const [data, isLoading] = useGetSuppliers(query);
  const [isSubmitLoading, onDelete] = useDeleteSupplier();
  const [, onUpdate] = useUpdateSupplier(onCloseForm);
  const paging = useSupplierPaging();

  const onUpdateStatus = useCallback((status:keyof STATUS_SUPPLIER_TYPE,idUpdate:any) => {
    onUpdate({
      _id : idUpdate,
      status
    })
  },[onUpdate])
  // Columns Table
  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Nhà cung cấp",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Danh sách sản phẩm",
        dataIndex: "_id",
        key: "listProduct",
        align: "center",
        render(_id) {
          return <Link to={PATH_APP.product.root + "/" + _id}>Xem chi tiết sản phẩm</Link>
        },
      },
      {
        title: "Số điện thoại",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        align: "center",
      },
      {
        title: "Công nợ",
        dataIndex: "name",
        key: "name",
        align: "center",
        render(value) {
          return (
            <Typography.Text strong>
              100.000 <Vnd />
            </Typography.Text>
          );
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: "10%",
        render(value,record) {
          return <Switch value={value === STATUS_SUPPLIER.ACTIVE} onChange={() => onUpdateStatus(value === STATUS_SUPPLIER.ACTIVE ? STATUS_SUPPLIER.INACTIVE : STATUS_SUPPLIER.ACTIVE,get(record,'_id'))}/>;
        },
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        align: "center",
        render(address) {
          return concatAddress(address);
        },
      },
      
      {
        title: "Thao tác",
        dataIndex: "_id",
        key: "_id",
        align: "center",
        fixed: 'right',
        render(_id) {
          return (
            <Row justify={"center"} align={"middle"} wrap={false}>
              <Button icon={<InfoCircleTwoTone />} onClick={() => onOpenForm(_id)} type="primary" size="small">
                Xem chi tiết
              </Button>
              <Divider type="vertical" />
              <Popconfirm
                title="Bạn muốn xoá nhà cung cấp này?"
                onConfirm={() => onDelete(_id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
              <Button
                loading={isSubmitLoading}
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Xoá
              </Button>
              </Popconfirm>
            </Row>
          );
        },
      },
    ],
    [isSubmitLoading, onDelete, onOpenForm, onUpdateStatus]
  );
  return (
    <div>
      <Breadcrumb title={t("list-supplier")} />
      <Row className="mb-3" justify={"space-between"}>
        <Col span={8}>
          <Search
            onSearch={(value) => onParamChange({ keyword: value?.trim() })}
            enterButton="Tìm kiếm"
            placeholder="Nhập để tìm kiếm"
          />
        </Col>
        <Col>
          <Button
            onClick={() => onOpenForm()}
            icon={<PlusCircleOutlined />}
            type="primary"
          >
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
          scroll={{x : 1500}}
          stickyTop
          size="small"
          pagination={{
            ...paging,
            onChange(page, pageSize) {
              onParamChange({ page, limit: pageSize });
            },
            showTotal: (total) => `Tổng cộng: ${total} `,
            showSizeChanger : true
          }}
        />
      </WhiteBox>
      <ModalAnt
        width={'auto'}
        open={isOpenForm}
        onCancel={onCloseForm}
        footer={null}
        destroyOnClose
      >
        <TabSupplier id={id} onCancel={onCloseForm} onUpdate={onUpdate} isSubmitLoading={isSubmitLoading}/>
      </ModalAnt>
    </div>
  );
}
