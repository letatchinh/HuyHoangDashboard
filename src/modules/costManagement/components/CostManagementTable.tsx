import { Col, Modal, Row, Select, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import TableAnt from "~/components/Antd/TableAnt";
import ActionColumn from "~/components/common/ActionColumn/index";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter } from "~/utils/helpers";
import { useCostManagementPaging, useCostManagementQueryParams, useDeleteCostManagement, useGetCostManagements, useUpdateCostManagementParams } from "../costManagement.hook";
import CostManagementForm from "./CostManagementForm";
export default function CostManagementTable({
  _id,
}: any): React.JSX.Element {
  const [openForm, setOpenForm] = useState(false);
  const [id, setId]: any = useState();
  // Hook
  const [query] = useCostManagementQueryParams();
  const [keyword, { setKeyword, onParamChange }] =
    useUpdateCostManagementParams(query);
  const [data, isLoading] = useGetCostManagements(query);

  const [isSubmitLoading, onDelete] = useDeleteCostManagement();
  const paging = useCostManagementPaging();

  const onOpenForm = useCallback((id?: string) => {
    if (id) {
      setId(id);
    }
    setOpenForm(true);
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
                  onChange={(value) =>{}
                    // onChangeVariantDefault({
                    //   productId: get(record, "_id"),
                    //   variantId: value,
                    // })
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
      title: "Chi phí vận chuyển",
      dataIndex: "logistic",
      key: "logistic",
      render(value, record, index) {
        return get(value,'name')
      },
    },
    {
      title: "Chi phí phân phối",
      dataIndex: "distributionChannel",
      key: "distributionChannel",
      render(value, record, index) {
        return get(value,'name')
      },
    },
    {
      title: "Chi phí quản lý",
      dataIndex: "management",
      key: "management",
      render(value, record, index) {
        return get(value,'package')
      },
    },
    {
      title: "Chi phí vận hành",
      dataIndex: "operations",
      key: "operations.element",
      width : 300,
      render(value, record, index) {
        return get(value,'element')
      },
    },
    {
      title: "Chi phí maketing",
      dataIndex: "maketing",
      key: "maketing",
      width : 300,
      render(value, record, index) {
        return get(value,'element')
      },
    },
    {
      title: "Chi phí trình dược",
      dataIndex: "pharmaceutical",
      key: "pharmaceutical",
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

    </div>
  );
}
