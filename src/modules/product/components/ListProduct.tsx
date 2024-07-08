import { Button, Col, Modal, Row, Select, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import ModalAnt from "~/components/Antd/ModalAnt";
import TableAnt from "~/components/Antd/TableAnt";
import ActionColumn from "~/components/common/ActionColumn/index";
import ConfigTable from "~/components/common/ConfigTable";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import { useAdapter } from "~/modules/auth/auth.hook";
import { ADAPTER_KEY } from "~/modules/auth/constants";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { formatter } from "~/utils/helpers";
import {
  useChangeVariantDefault,
  useDeleteProduct,
  useGetProducts,
  useProductPaging,
  useProductQueryParams,
  useUpdateProduct,
  useUpdateProductParams
} from "../product.hook";
import { TypePropsListProduct } from "../product.modal";
import FormProduct from "./FormProduct";
import StockModal, { itemData } from "./StockModal";
export default function ListProduct({
  supplierId,
}: TypePropsListProduct): React.JSX.Element {
  const [openForm, setOpenForm] = useState(false);
  const [id, setId]: any = useState();
  // Hook
  const [query] = useProductQueryParams(supplierId);
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateProductParams(query);
  const [data, isLoading] = useGetProducts(query);
  const onChangeVariantDefault = useChangeVariantDefault();

  const [isSubmitLoading, onDelete] = useDeleteProduct();
  const paging = useProductPaging();
  const adapter = useAdapter();
  const isAdapterIsEmployee = useMemo(() => adapter === ADAPTER_KEY.EMPLOYEE, [adapter]);
  const canUpdate = useMatchPolicy(POLICIES.UPDATE_PRODUCT);
  const canDelete = useMatchPolicy(POLICIES.DELETE_PRODUCT);

  const [isOpenStock, setIsOpenStock] = useState(false);
  const [dataStock, setDataStock] = useState<itemData | null >(null);
  const openStock = (data: itemData) => {
    setIsOpenStock(true);
    setDataStock(data);
  };

  const onCloseStock = () => {
    setIsOpenStock(false);
    setDataStock(null);
  };

  const onOpenForm = useCallback((id?: string) => {
    if (id) {
      setId(id);
    }
    setOpenForm(true);
  }, []);

  const onCloseForm = useCallback(() => {
    setId(null);
    setOpenForm(false);
  }, []);
  const [, onUpdateProduct] = useUpdateProduct(onCloseForm);
  const columns: ColumnsType = [
    {
      title: "Mã thuốc",
      dataIndex: "variant",
      key: "variant",
      width : 130,
      align: "center",
      render : (variant) => {
        return get(variant,'variantCode','')
      }
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width : 300,
      render(name, record) {
        const codeBySupplier = get(record,'codeBySupplier','');
        if (get(record, "variants", [])?.length > 1) {
          const options = get(record, "variants", [])?.map((item:any) => ({
            label: get(item, "unit.name"),
            value: get(item, "_id"),
          }));
          return (
            <Row align={"middle"} gutter={4} wrap={false}>
              <Col>
              <Typography.Text strong>{codeBySupplier} - </Typography.Text>
              </Col>
              <Col>{name}</Col>
              <Col>
                <Select
                  style={{minWidth : 50}}
                  dropdownStyle={{
                    width : 'max-content'
                  }}
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
          return <span>
              <Typography.Text strong>{codeBySupplier} - </Typography.Text>
            {name + " " + `(${get(record, "variant.unit.name")})`}
          </span>;
        }
      },
    },
  ...(!isAdapterIsEmployee? [{
      title: "Giá bán",
      dataIndex: "variant",
      key: "variant.price",
      width: 130,
      render(variant: any, record: any, index: any) {
        return formatter(get(variant,'price'))
      },
    }]:[]),
  ...(!isAdapterIsEmployee? [{
    title: "Giá thu về",
      dataIndex: "variant",
      key: "variant.cost",
      width: 130,
      render(variant: any, record: any, index: any) {
        return formatter(get(variant,'cost',0))
      },
    }]:[]),
  // ...(!isAdapterIsEmployee? [{
  //   title: "Tồn kho",
  //     dataIndex: "stock",
  //     key: "stock",
  //     // render(stock: any, record: any) {
  //     //   return <StockProduct variantDefault={get(record,'variantDefault')} stock={stock ?? 0} handleUpdate={(newStock:number) => onUpdateProduct({
  //     //     _id : get(record,'_id'),
  //     //     stock : newStock
  //     //   })}/>
  //   // },
  //     render: (value: any, record: any)=> <Button type = 'link' onClick = {() => openStock({id: get(record,'_id'),supplierId : get(record,'supplierId')})}>Xem chi tiết</Button>
  //   }]:[]),
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
        return <Typography.Text ellipsis={{tooltip:true}}>{ get(value,'element')}</Typography.Text>
      },
    },
    ...(canUpdate || canDelete ?[{
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center" as any,
      fixed : 'right'as any,
      width : 130,
      render(_id: any, record: any, index: number) {
        return <ActionColumn 
        _id={_id}
        onDetailClick={onOpenForm}
        onDelete={onDelete}
        />
      },
    }]:[]),
  ];

  return (
    <div>
      <WhiteBox>
      <SelectSearch 
      isShowButtonAdd
      showSelect={false}
      handleOnClickButton={() => onOpenForm()}
      onSearch={(value : any) => onParamChange({keyword: value?.trim()})}
      permissionKey={[POLICIES.WRITE_PRODUCT]}
      />
          <ConfigTable>
            <TableAnt
            className="table-striped-rows-custom"
            bordered
            dataSource={data}
            loading={isLoading}
            rowKey={(rc) => rc?._id}
            columns={columns}
            scroll={{x : 2000,y:'calc(100vh - 140px - 53px - 42px - 20px - 48px )'}}
            stickyTop
            size="small"
            pagination={{
              ...paging,
              onChange(page, pageSize) {
                onParamChange({ page, limit: pageSize });
              },
              showSizeChanger : true,
              showTotal: (total) => `Tổng cộng: ${total} `,
              size:"small"
            }}
            />
          </ConfigTable>
        <Modal
          open={openForm}
          destroyOnClose
          width={1500}
          footer={null}
          onCancel={onCloseForm}
        >
          <FormProduct onUpdate={onUpdateProduct} id={id} supplierId={supplierId} onCancel={onCloseForm} />
        </Modal>
        <ModalAnt
          open={isOpenStock}
          destroyOnClose
          width={1500}
          footer={null}
          onCancel={onCloseStock}
        >
          <StockModal
            data={dataStock} />
        </ModalAnt>
      </WhiteBox>
    </div>
  );
}
