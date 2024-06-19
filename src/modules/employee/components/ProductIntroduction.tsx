import React, { useMemo } from "react";
import { propsType } from "../employee.modal";
import { useGetEmployee } from "../employee.hook";
import { Flex, Form, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { get } from "lodash";
import TableAnt from "~/components/Antd/TableAnt";

export default function ProductIntroduction(
  props: propsType
): React.JSX.Element {
  const { employeeId } = props;
  const [info, isLoading] = useGetEmployee(employeeId);

  const columns: ColumnsType = useMemo(
    () => [
      {
        title: "Tên sản phẩm",
        dataIndex: "product",
        key: "product",
        render(product, record, index) {
          return (
            <Typography.Text strong>
              {get(product, "codeBySupplier", "")} - {get(product, "name", "")}
            </Typography.Text>
          );
        },
      },
      {
        title: "Chiết khấu",
        dataIndex: "discount",
        key: "discount",
        align: "center",
        // width: 250,
        render(discount: any, record, index) {
          return (
            <Typography.Text strong>
              {get(discount, "value", "")} %
            </Typography.Text>
          );
        },
      },
    ],
    []
  );
  if (isLoading) {
    return (
      <Flex align={"center"} justify="center">
        <LoadingOutlined />
      </Flex>
    );
  }
  return (
    <div>
      <TableAnt columns={columns} dataSource={get(info, "products", [])} />
    </div>
  );
}
