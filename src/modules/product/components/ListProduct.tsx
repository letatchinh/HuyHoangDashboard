import { Col, Modal, Row, Select, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import ActionColumn from "~/components/common/ActionColumn/index";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter } from "~/utils/helpers";
import {
  useChangeVariantDefault,
  useDeleteProduct,
  useGetProducts,
  useProductPaging,
  useProductQueryParams,
  useUpdateProductParams
} from "../product.hook";
import { TypePropsListProduct } from "../product.modal";
import FormProduct from "./FormProduct";
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
  console.log(data,'data');
  const onChangeVariantDefault = useChangeVariantDefault();

  const [isSubmitLoading, onDelete] = useDeleteProduct();
  const paging = useProductPaging();

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
  const columns: ColumnsType = [
    {
      title: "Mã thuốc",
      dataIndex: "variant",
      key: "variant",
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
          const options = get(record, "variants", [])?.map((item) => ({
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
    {
      title: "Giá bán",
      dataIndex: "variant",
      key: "variant",
      render(variant, record, index) {
        return formatter(get(variant,'price'))
      },
    },
    {
      title: "Giá Vốn",
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
    {
      title: "Thao tác",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      fixed : 'right',
      width : 200,
      render(_id, record, index) {
        return <ActionColumn 
        _id={_id}
        onDetailClick={onOpenForm}
        onDelete={onDelete}
        />
      },
    },
  ];

  return (
    <div>
      <WhiteBox>
      <SelectSearch 
      isShowButtonAdd
      showSelect={false}
      handleOnClickButton={() => onOpenForm()}
      onSearch={(value : any) => onParamChange({keyword: value?.trim()})
      }
      />

        <TableAnt
          dataSource={data}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          scroll={{x : 2000}}
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

        <Modal
          open={openForm}
          destroyOnClose
          width={1500}
          footer={null}
          onCancel={onCloseForm}
        >
          <FormProduct id={id} supplierId={supplierId} onCancel={onCloseForm} />
        </Modal>
      </WhiteBox>
    </div>
  );
}
