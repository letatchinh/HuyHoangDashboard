import { Col, Row, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { get } from 'lodash';
import React from 'react';
import ActionColumn from '~/components/common/ActionColumn';
import { formatter } from '~/utils/helpers';
type propsType = {

}

export default function ProductsAll(props: propsType): React.JSX.Element {
    
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
                    //   onChange={(value) =>
                    //     onChangeVariantDefault({
                    //       productId: get(record, "_id"),
                    //       variantId: value,
                    //     })
                    //   }
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
          render(value, record, index) {
            return get(value,'element')
          },
        },
        {
          title: "Thao tác",
          dataIndex: "_id",
          key: "_id",
          align: "center",
          render(_id, record, index) {
            return <ActionColumn
            _id={_id}
            // onDetailClick={onOpenForm}
            // onDelete={onDelete}
            />
          },
        },
      ];
    return (
        <div>ProductsAll</div>
    )
}