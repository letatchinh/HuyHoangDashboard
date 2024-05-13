import { Badge, Button, Popover, Segmented } from "antd";
import { ColumnsType } from "antd/lib/table/InternalTable";
import { truncate } from "lodash";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";

import { getOptions } from "~/utils/helpers";
import { STATUS_REQUEST_GROUP_COLOR, STATUS_REQUEST_GROUP_VI } from "../constants";
import useRequestGroupStore from "../RequestGroupProvider";
type propsType = {};

export default function ViewRequest(props: propsType): React.JSX.Element {
    const {onChangeStatus,data} = useRequestGroupStore();
    const columns: ColumnsType = [
        {
          title: "Nội dung",
          dataIndex: "contentRequest",
          key: "contentRequest",
          render: (contentRequest) => (
            <Popover content={contentRequest} trigger={"click"}>
              <Button type="text">
              {truncate(contentRequest,{length : 40})}
              </Button>
            </Popover>
          ),
        },
        {
          title: "Xử lí trạng thái",
          dataIndex: "_id",
          key: "_idAction",
          align: "center",
          render(_id) {
            return (
              <Segmented
              options={getOptions(STATUS_REQUEST_GROUP_VI).map((item : {value : keyof typeof STATUS_REQUEST_GROUP_VI,label : string}) => ({
                  ...item,
                  icon : <Badge status={STATUS_REQUEST_GROUP_COLOR[item.value]}/>
              }))}
              onChange={(value) => {
                onChangeStatus({_id,status : value}); // string
              }}
            />
            );
          },
        },
      ];

  return (
    <div>
      <TableAnt size="small" dataSource={data} columns={columns} />
    </div>
  );
}
