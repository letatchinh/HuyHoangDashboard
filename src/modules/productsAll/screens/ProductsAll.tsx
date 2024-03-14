import React, { useState } from 'react';
import { Checkbox, Col, Modal, Row, Select } from 'antd';
import { ColumnsType } from "antd/es/table/InternalTable";
import { Table } from 'antd/lib';
import { get } from 'lodash';
import WhiteBox from '~/components/common/WhiteBox';
import { formatter } from '~/utils/helpers';
import Breadcrumb from '~/components/common/Breadcrumb';
import { useChangeVariantDefault, useGetProductsAll, useProductsAllPaging, useProductsAllQueryParams, useSetSupplierInfo, useUpdateProductsAllParams } from '../productsAll.hook';
import TableAnt from '~/components/Antd/TableAnt';
import { Link } from 'react-router-dom';
import { useMatchPolicy } from '~/modules/policy/policy.hook';
import POLICIES from '~/modules/policy/policy.auth';
import FormProduct from '~/modules/product/components/FormProduct';
import FormListSupplier from '../components/FormListSupplier';
import SelectSearch from '~/components/common/SelectSearch/SelectSearch';
import { DataType, TypeProps } from '../productsAll.modal';
import ShowStep from '../components/ShowStep';
import ActionColumn from '../components/ActionColumns';
import { useDeleteProduct } from '~/modules/product/product.hook';
import useCheckBoxExport from '~/modules/export/export.hook';
import ExportExcelButton from '~/modules/export/component';

export default function ProductsAll(props: TypeProps): React.JSX.Element {
  const [query, onTableChange] = useProductsAllQueryParams();
  const [keyword, { setKeyword, onParamChange }] = useUpdateProductsAllParams(query);
  const [data, isLoading] = useGetProductsAll(query);
  const onChangeVariantDefault = useChangeVariantDefault();
  const [, onDelete] = useDeleteProduct();
  const onSetSupplierInfo = useSetSupplierInfo();
  const canReadSupplier = useMatchPolicy(POLICIES.READ_PRODUCT);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_PRODUCT);
  const canDelete = useMatchPolicy(POLICIES.DELETE_PRODUCT);
  const paging = useProductsAllPaging();
  const [step, setStep] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFormProduct, setIsOpenFormProduct] = useState(false);
  const [supplierId, setSupplierId] = useState <string | null>(null);
  const [id, setId] = useState<string | null>(null);
  
  //Download
  const canDownload = useMatchPolicy(POLICIES.DOWNLOAD_PRODUCT);
  const [arrCheckBox, onChangeCheckBox] = useCheckBoxExport();

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
  
  const onCloseFormProduct = () => {
    setIsOpenFormProduct(false);
    setSupplierId(null);
    setId(null);
  };

  const onChangeStep = (step: number) => {
    setStep(step);
  };

    const columns: ColumnsType <DataType> = [
        {
          title: "Mã thuốc",
          dataIndex: "variant",
          key: "variant",
          render : (variant) => {
            return get(variant,'variantCode','')
          }
        },
        {
          title: "Nhà cung cấp",
          dataIndex: "supplier",
          key: "name",
          render : (supplier) => {
            return (
              canReadSupplier?
                <Link to={`/product/${get(supplier, '_id')}`}>{get(supplier, 'name')}</Link>
                : get(supplier, 'name')
            )
          }
        },
        {
          title: "Tên sản phẩm",
          dataIndex: "name",
          key: "name",
          width : 300,
          render(name, record) {
            if (get(record, "variants", [])?.length > 1) {
              const options = get(record, "variants", [])?.map((item) => ({
                label: get(item, "unit.name"),
                value: get(item, "_id"),
              }));
              return (
                <Row align={"middle"} gutter={4} wrap={false}>
                  <Col>{name}</Col>
                  <Col>
                    <Select
                      style={{minWidth : 50}}
                      value={get(record,'variant._id')}
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
              return name + " " + `(${get(record, "variant.unit.name")})`;
            }
          },
        },
        {
          title: "Giá bán",
          dataIndex: "variant",
          key: "variant",
          render(variant, record, index) {
            return formatter(get(variant,'price'))
          },
        },
        {
          title: "Giá thu về",
          dataIndex: "variant",
          key: "variant",
          render(variant, record, index) {
            return formatter(get(variant,'cost',0))
          },
        },
        {
          title: "Nhóm sản phẩm",
          dataIndex: "productGroup",
          key: "productGroup",
          render(value, record, index) {
            return get(value,'name')
          },
        },
        {
          title: "Hãng sản xuất",
          dataIndex: "manufacturer",
          key: "manufacturer",
          render(value, record, index) {
            return get(value,'name')
          },
        },
        {
          title: "Quy cách đóng gói",
          dataIndex: "productDetail",
          key: "productDetail.package",
          width : 300,
          render(value, record, index) {
            return get(value,'package')
          },
        },
        {
          title: "Thành phần",
          dataIndex: "productDetail",
          key: "productDetail.element",
          width : 300,
          render(value, record, index) {
            return get(value,'element')
          },
        },
        ...(
          canDownload ? [
            {
              title: 'Lựa chọn',
              key: '_id',
              width: 80,
              align: 'center' as any,
              render: (item: any, record: any) =>
              {
                const id = record._id;
                return (
                  <Checkbox
                    checked= {arrCheckBox?.includes(id)}
                    onChange={(e)=>onChangeCheckBox(e.target.checked, id)}
              />)}
            },
          ]: []
        ),
      ...( canDelete || canUpdate ? [
        {
          title: "Thao tác",
          dataIndex: "_id",
          key: "_id",
          align: "center" as any,
          fixed: "right" as any,
          render(_id : any, record: any, index: any) {
            return <ActionColumn
            _id={_id}
            onDetailClick={() => onOpenFormProduct(_id, get(record, "supplier._id", null))}
            onDelete={onDelete}
            />
          },
        },
        ]: []
      ),
      ];
    return (
      <div>
      <Breadcrumb title={isLoading ? "Đang tải..." : <p>Danh sách sản phẩm</p>} />
        <SelectSearch
          style={{ marginBottom: "10px" }}
          isShowButtonAdd
          handleOnClickButton={onOpenModal}
          titleButtonAdd='Thêm mới sản phẩm'
          showSelect={false}
          onSearch={(value: any) => onParamChange({ keyword: value?.trim() })}
          permissionKey={[POLICIES.WRITE_PRODUCT]}
          addComponent={
            canDownload ?  <Col>
                <ExportExcelButton
                  api='product'
                  exportOption = 'product'
                  query={query}
                  fileName='Danh sách sản phẩm'
                  ids={arrCheckBox}
                />
          </Col> : null
          }
          />
        <WhiteBox>
          <TableAnt
            style={{ marginBottom: "20px" }}
            dataSource={data ?? []}
            columns={columns}
            scroll={{ x: 'max-content' }}
            size='small'
            pagination={{
              ...paging,
              showTotal: (total) => `Tổng cộng: ${total}`,
              showSizeChanger : true
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
          <ShowStep onChangeStep={onChangeStep} onCloseModal={onCloseModal} step={step} />
        </Modal>
        <Modal
          open={isOpenFormProduct}
          onCancel={onCloseFormProduct}
          footer={null}
          width={1500}
          destroyOnClose
        >
          <FormProduct
            onCancel={onCloseFormProduct}
            supplierId={supplierId as any}
            id= {id as any}
          />
        </Modal>
        </div>
    )
}