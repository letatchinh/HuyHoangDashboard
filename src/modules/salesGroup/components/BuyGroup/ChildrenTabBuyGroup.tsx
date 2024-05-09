/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Typography } from "antd";
import { get } from "lodash";
import React, { useEffect, useRef } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import { useGetCollaborator } from "~/modules/collaborator/collaborator.hook";
import { useGetEmployee } from "~/modules/employee/employee.hook";
type propsType = {
  targetId: string;
  targetType: "partner" | "employee";
};

const hookGetTarget = {
  employee: useGetEmployee,
  partner: useGetCollaborator,
};
export default function ChildrenTabBuyGroup(
  props: propsType
): React.JSX.Element {
  const [data] = hookGetTarget[props.targetType](props.targetId);
  return (
    <WhiteBox style={{paddingInline:20}}>
      <Table
        size="small"
        bordered
        dataSource={get(data, "products", [])}
        columns={[
          {
            title: "Mặt hàng",
            dataIndex: ["product", "name"],
            ellipsis:true,

          },
          {
            title: "Chiết khấu",
            dataIndex: ["discount", "value"],
            width: 100,
            align: "center",
            render:(val)=><Typography.Text strong>{val} %</Typography.Text>
          },
        ]}

        pagination={false}
      />
    </WhiteBox>
  );
}
