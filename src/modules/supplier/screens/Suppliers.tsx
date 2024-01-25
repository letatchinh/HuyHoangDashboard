import { DeleteOutlined, InfoCircleOutlined, InfoCircleTwoTone, PlusCircleOutlined, PlusCircleTwoTone } from "@ant-design/icons";
import { Button, Col, Divider, Modal, Popconfirm, Row, Space, Switch, Typography } from "antd";
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
import { concatAddress, formatNumberThreeComma } from "~/utils/helpers";
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
import ProductModule from '~/modules/product';
import WithPermission from "~/components/common/WithPermission";
import PermissionBadge from "~/components/common/PermissionBadge";
import { REF_COLLECTION, REF_COLLECTION_UPPER } from "~/constants/defaultValue";
import PaymentVoucherForm from "~/modules/paymentVoucher/components/PaymentVoucherForm";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "~/modules/policy/policy.auth";
import Description from "../components/Description";
export default function Supplier(): React.JSX.Element {
  const canUpdateSupplier = useMatchPolicy(POLICIES.UPDATE_SUPPLIER);
  const canReadProduct = useMatchPolicy(POLICIES.READ_PRODUCT);
  // Translate
  const { t }: any = useTranslate();

  // State Form
  const [id, setId]: any = useState();
  const [isOpenForm, setIsOpenForm]: any = useState(false);
  const [idSupplierCreateProduct, setIdSupplierCreateProduct]: any = useState();
  const [isOpenFormProduct, setIsOpenFormProduct]: any = useState(false);
  const [open, setOpen] = useState(false);
  const [supplierId, setSupplierId] = useState<string | null>('');
  const [debt, setDebt] = useState<number | null>();
  const [isOpenDesc, setIsOpenDesc] = useState<boolean>(false);
  const canWriteVoucher = useMatchPolicy(POLICIES.WRITE_VOUCHER);
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
  // Control form Product
  const onOpenFormProduct = useCallback((idSelect?: any) => {
    if (idSelect) {
      setIdSupplierCreateProduct(idSelect);
    }
    setIsOpenFormProduct(true);
  }, []);
  const onCloseFormProduct = useCallback(() => {
    setIsOpenFormProduct(false);
    setIdSupplierCreateProduct(null);
  }, []);

  const onOpenPayment = (item: any) => {
    setOpen(true);
    setSupplierId(item?._id)
    setDebt(item?.resultDebt)
  };
  const onClosePayment = () => {
    setOpen(false);
    setSupplierId(null);
  };
  const onOpenDesc = (item?: any) => {
    setSupplierId(item?._id)
    setIsOpenDesc(true);
  };
  const onCloseDesc = () => {
    setIsOpenDesc(false);
  };

  // Hook
  const [query] = useSupplierQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateSupplierParams(query);
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
  const columns: ColumnsType  = useMemo(
    () => [
      {
        title: "Mã nhà cung cấp",
        dataIndex: "code",
        key: "code",
        render (value, rc) {
          return (
            <Button
              type="link"
              // onClick={() => onOpenDesc(rc)}
            >
            {value}
            </Button>
          )
        }
      },
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
        render(_id : any) {
          return <PermissionBadge permissions={[POLICIES.READ_PRODUCT]} title="Bạn không có quyền xem sản phẩm">
          <Link className={!canReadProduct ? "disabledLink" : ""} target={'_blank'} to={PATH_APP.product.root + "/" + _id}>Xem chi tiết sản phẩm</Link>
          </PermissionBadge>
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
        dataIndex: "resultDebt",
        key: "resultDebt",
        align: "center",
        render(value) {
          return formatNumberThreeComma(value);
        },
      },
      {
          title: "Tạo phiếu",
          dataIndex: "name",
          key: "name",
          align: "center",
          render(value: any, rc: any) {
            return (
              <Space>
                <Button type="primary" onClick={() => onOpenPayment(rc)}>Phiếu chi</Button>
              </Space>
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
          return <Switch disabled={!canUpdateSupplier} value={value === STATUS_SUPPLIER.ACTIVE} onChange={() => onUpdateStatus(value === STATUS_SUPPLIER.ACTIVE ? STATUS_SUPPLIER.INACTIVE : STATUS_SUPPLIER.ACTIVE,get(record,'_id'))}/>;
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
            <Space direction="vertical">
              <WithPermission permission={POLICIES.WRITE_PRODUCT}>
              <Button
                block
                icon={<PlusCircleTwoTone />}
                onClick={() => onOpenFormProduct(_id)}
                type="primary"
                size="small"
              >
                Thêm sản phẩm
              </Button>
              </WithPermission>
              <Button
                block
                icon={<InfoCircleOutlined />}
                onClick={() => onOpenForm(_id)}
                size="small"
              >
                Xem chi tiết
              </Button>
              <WithPermission permission={POLICIES.DELETE_SUPPLIER}>
              <Popconfirm
                title="Bạn muốn xoá nhà cung cấp này?"
                onConfirm={() => onDelete(_id)}
                okText="Xoá"
                cancelText="Huỷ"
              >
                <Button
                  block
                  loading={isSubmitLoading}
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                >
                  Xoá
                </Button>
              </Popconfirm>
              </WithPermission>
            </Space>
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
            allowClear
            onSearch={(value) => onParamChange({ keyword: value?.trim() })}
            enterButton="Tìm kiếm"
            placeholder="Nhập để tìm kiếm"
          />
        </Col>
        <Col>
          <WithPermission permission={POLICIES.WRITE_SUPPLIER}>
          <Button
            onClick={() => onOpenForm()}
            icon={<PlusCircleOutlined />}
            type="primary"
          >
            Thêm nhà cung cấp
          </Button>
          </WithPermission>
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

      <ModalAnt
        width={'auto'}
        open={isOpenFormProduct}
        onCancel={onCloseFormProduct}
        footer={null}
        destroyOnClose
      >
        <ProductModule.page.form supplierId={idSupplierCreateProduct} onCancel={onCloseFormProduct}/>
      </ModalAnt>
      <Modal
        title='Phiếu chi'
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={1366}
        footer={null}
        destroyOnClose
      >
        <PaymentVoucherForm
          onClose={() => onClosePayment()}
          supplierId={supplierId}
          refCollection={REF_COLLECTION_UPPER.SUPPLIER}
          debt={debt}
        />
      </Modal>
      <Modal
        title='Chi tiết' 
        open={isOpenDesc}
        onCancel={onCloseDesc}
        onOk={onCloseDesc}
        footer={null}
      >
        <Description/>
      </Modal>
    </div>
  );
}
