import { Badge, Button, Dropdown, Popover, Segmented, Typography } from "antd";
import { ColumnsType } from "antd/lib/table/InternalTable";
import { get, keys, truncate } from "lodash";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";

import { getOptions, pagingTable } from "~/utils/helpers";
import { STATUS_REQUEST_GROUP_COLOR, STATUS_REQUEST_GROUP_VI } from "../constants";
import useRequestGroupStore from "../RequestGroupProvider";
type propsType = {};

export default function ViewRequest(props: propsType): React.JSX.Element {
    const {onChangeStatus,data,paging,setQuery,loading} = useRequestGroupStore();
    const columns: ColumnsType = [
        {
          title: "Nội dung",
          dataIndex: "contentRequest",
          key: "contentRequest",
          // render: (contentRequest) => (
          //   <Popover content={contentRequest} trigger={"click"}>
          //     <Button type="text">
          //     {truncate(contentRequest,{length : 40})}
          //     </Button>
          //   </Popover>
          // ),
        },
        {
          title: "Xử lí trạng thái",
          dataIndex: "_id",
          key: "_idAction",
          align: "center",
          width : 200,
          render(_id,rc) {
            const stt = get(rc,'status');
            return (
              <Dropdown.Button
            
              menu={{
                items : keys(STATUS_REQUEST_GROUP_VI).map((k : any) => ({
                  key : k,
                  label : get(STATUS_REQUEST_GROUP_VI,k),
                  onClick : () => onChangeStatus({_id,status : k}),
                  icon : <Badge status={get(STATUS_REQUEST_GROUP_COLOR,k)}/>
                }))
              }}
              >
                <Typography.Text style={{width : 100,textAlign:'left'}} strong>
                <Badge status={get(STATUS_REQUEST_GROUP_COLOR,stt)}/>
                {" "}
                {get(STATUS_REQUEST_GROUP_VI,stt)}
                </Typography.Text>
              </Dropdown.Button>
            //   <Segmented
            //   value={get(rc,'status')}
            //   options={getOptions(STATUS_REQUEST_GROUP_VI).map((item : {value : keyof typeof STATUS_REQUEST_GROUP_VI,label : string}) => ({
            //       ...item,
            //       icon : <Badge status={STATUS_REQUEST_GROUP_COLOR[item.value]}/>
            //   }))}
            //   onChange={(value) => {
            //     onChangeStatus({_id,status : value}); // string
            //   }}
            // />
            );
          },
        },
      ];
      console.log(data,'data');
      
  return (
    <div>
      <TableAnt loading={loading} size="small" dataSource={data} columns={columns} pagination={pagingTable(paging,setQuery)}/>
    </div>
  );
}
