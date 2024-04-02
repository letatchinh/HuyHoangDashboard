import { Checkbox, Col, Modal, Row, Select, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TableAnt from "~/components/Antd/TableAnt";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import ExportExcelButton from "~/modules/export/component";
import useCheckBoxExport from "~/modules/export/export.hook";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import FormProduct from "~/modules/product/components/FormProduct";
import StockProduct from "~/modules/product/components/StockProduct";
import {
  useChangeVariantDefault,
  useDeleteProduct,
  useGetProducts,
  useProductPaging,
  useUpdateProduct,
} from "~/modules/product/product.hook";
import { formatter } from "~/utils/helpers";
import { useChangeDocumentTitle } from "~/utils/hook";
import ActionColumn from "../components/ActionColumns";
import ShowStep from "../components/ShowStep";
import {
  useProductsAllQueryParams,
  useUpdateProductsAllParams,
} from "../productsAll.hook";
import { DataType, TypeProps } from "../productsAll.modal";
import { useSelector } from "react-redux";
import { ADAPTER_KEY } from "~/modules/auth/constants";

export default function ProductsAll(props: TypeProps): React.JSX.Element {
  const [query, onTableChange] = useProductsAllQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateProductsAllParams(query);
  const [data, isLoading] = useGetProducts(query);
  const onChangeVariantDefault = useChangeVariantDefault();
  const [, onDelete] = useDeleteProduct();

  // const onSetSupplierInfo = useSetSupplierInfo();
  const canReadSupplier = useMatchPolicy(POLICIES.READ_PRODUCT);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_PRODUCT);
  const canDelete = useMatchPolicy(POLICIES.DELETE_PRODUCT);
  const paging = useProductPaging();
  const [step, setStep] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFormProduct, setIsOpenFormProduct] = useState(false);
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  //Download
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_PRODUCT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();
  const adapter = useSelector((state: any) => state?.auth?.adapter);
  const isAdapterIsEmployee = useMemo(
    () => adapter === ADAPTER_KEY.EMPLOYEE,
    [adapter]
  );

  const onOpenModal = (id: string | null) => {
    setIsOpen(true);
    setSupplierId(id);
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setSupplierId(null);
  };

  const onOpenFormProduct = (id: string | null, supplierId: string | null) => {
    setIsOpenFormProduct(true);
    setSupplierId(supplierId);
    setId(id);
  };

  const onCloseFormProduct = useCallback(() => {
    setIsOpenFormProduct(false);
    setSupplierId(null);
    setId(null);
  }, []);
  const [, onUpdateProduct] = useUpdateProduct(onCloseFormProduct);

  const onChangeStep = (step: number) => {
    setStep(step);
  };

  const columns: any[] = [
    {
      title: "Mã thuốc",
      dataIndex: "variant",
      key: "variant",
      render: (variant: any) => {
        return get(variant, "variantCode", "");
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "name",
      render: (supplier: any) => {
        return canReadSupplier ? (
          <Link to={`/product/${get(supplier, "_id")}`}>
            {get(supplier, "name")}
          </Link>
        ) : (
          get(supplier, "name")
        );
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 300,
      render(name: any, record: any) {
        const codeBySupplier = get(record, "codeBySupplier", "");

        if (get(record, "variants", [])?.length > 1) {
          const options = get(record, "variants", [])?.map((item: any) => ({
            label: get(item, "unit.name"),
            value: get(item, "_id"),
          }));
          return (
            <Row align={"middle"} gutter={4} wrap={false}>
              <Col>
                <Typography.Text strong>{codeBySupplier}</Typography.Text>
              </Col>
              <Col>{name}</Col>
              <Col>
                <Select
                  style={{ minWidth: 50 }}
                  dropdownStyle={{
                    width: "max-content",
                  }}
                  value={get(record, "variant._id")}
                  options={options}
                  onChange={(value) =>
                    onChangeVariantDefault({
                      productId: get(record, "_id"),
                      variantId: value,
                    })
                  }
                />
              </Col>
            </Row>
          );
        } else {
          return (
            <span>
              <Typography.Text strong>{codeBySupplier} - </Typography.Text>
              {name + " " + `(${get(record, "variant.unit.name")})`}
            </span>
          );
        }
      },
    },
    ...(!isAdapterIsEmployee
      ? [
          {
            title: "Giá bán",
            dataIndex: "variant",
            key: "variant",
            render(variant: any, record: any, index: any) {
              return formatter(get(variant, "price"));
            },
          },
        ]
      : []),
    ...(!isAdapterIsEmployee
      ? [
          {
            title: "Giá thu về",
            dataIndex: "variant",
            key: "variant",
            render(variant: any, record: any, index: any) {
              return formatter(get(variant, "cost", 0));
            },
          },
        ]
      : []),
    ...(!isAdapterIsEmployee
      ? [
          {
            title: "Tồn kho",
            dataIndex: "stock",
            key: "stock",
            render(stock: any, record: any) {
              return (
                <StockProduct
                  variantDefault={get(record, "variantDefault")}
                  stock={stock ?? 0}
                  handleUpdate={(newStock: number) =>
                    onUpdateProduct({
                      _id: get(record, "_id"),
                      stock: newStock,
                    })
                  }
                />
              );
            },
          },
        ]
      : []),
    {
      title: "Nhóm sản phẩm",
      dataIndex: "productGroup",
      key: "productGroup",
      render(value: any, record: any) {
        return get(value, "name");
      },
    },
    {
      title: "Hãng sản xuất",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render(value: any) {
        return get(value, "name");
      },
    },
    {
      title: "Quy cách đóng gói",
      dataIndex: "productDetail",
      key: "productDetail.package",
      width: 300,
      render(value: any) {
        return get(value, "package");
      },
    },
    {
      title: "Thành phần",
      dataIndex: "productDetail",
      key: "productDetail.element",
      width: 300,
      render(value: any) {
        return get(value, "element");
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
                  checked={arrCheckBox?.includes(id)}
                  onChange={(e) => onChangeCheckBox(e.target.checked, id)}
                />
              );
            },
          },
        ]
      : []),
    ...(canDelete || canUpdate
      ? [
          {
            title: "Thao tác",
            dataIndex: "_id",
            key: "_id",
            align: "center" as any,
            fixed: "right" as any,
            render(_id: any, record: any, index: any) {
              return (
                <ActionColumn
                  _id={_id}
                  onDetailClick={() =>
                    onOpenFormProduct(_id, get(record, "supplier._id", null))
                  }
                  onDelete={onDelete}
                />
              );
            },
          },
        ]
      : []),
  ];

  useChangeDocumentTitle("Danh sách sản phẩm");
  return (
    <div>
      <Breadcrumb
        title={isLoading ? "Đang tải..." : <p>Danh sách sản phẩm</p>}
      />
      <SelectSearch
        style={{ marginBottom: "10px" }}
        isShowButtonAdd
        handleOnClickButton={onOpenModal}
        titleButtonAdd="Thêm mới sản phẩm"
        showSelect={false}
        onSearch={(value: any) => onParamChange({ keyword: value?.trim() })}
        permissionKey={[POLICIES.WRITE_PRODUCT]}
        addComponent={
          canDownload ? (
            <Col>
              <ExportExcelButton
                api="product"
                exportOption="product"
                query={query}
                fileName="Danh sách sản phẩm"
                ids={arrCheckBox}
              />
            </Col>
          ) : null
        }
      />
      <WhiteBox>
        <TableAnt
          style={{ marginBottom: "20px" }}
          dataSource={data ?? []}
          columns={columns}
          scroll={{ x: "max-content" }}
          size="small"
          pagination={{
            ...paging,
            showTotal: (total) => `Tổng cộng: ${total}`,
            showSizeChanger: true,
          }}
          onChange={onTableChange}
          loading={isLoading}
        />
      </WhiteBox>
      <Modal
        open={isOpen}
        onCancel={onCloseModal}
        footer={null}
        // title= {step === 0 ? "Chọn nhà cung cấp" : ''}
        width={1500}
        destroyOnClose
      >
        <ShowStep
          onChangeStep={onChangeStep}
          onCloseModal={onCloseModal}
          step={step}
          setStep={setStep}
        />
      </Modal>
      <Modal
        open={isOpenFormProduct}
        onCancel={onCloseFormProduct}
        footer={null}
        width={1500}
        destroyOnClose
      >
        <FormProduct
          onUpdate={onUpdateProduct}
          onCancel={onCloseFormProduct}
          supplierId={supplierId as any}
          id={id as any}
        />
      </Modal>
    </div>
  );
}
