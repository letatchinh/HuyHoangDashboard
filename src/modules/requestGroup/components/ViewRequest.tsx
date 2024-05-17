import { SyncOutlined } from "@ant-design/icons";
import { Badge, Dropdown, Typography } from "antd";
import { ColumnsType } from "antd/lib/table/InternalTable";
import { get, keys } from "lodash";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchOrPolicy, useMatchPolicy } from "~/modules/policy/policy.hook";

import { pagingTable } from "~/utils/helpers";
import { STATUS_REQUEST_GROUP, STATUS_REQUEST_GROUP_COLOR, STATUS_REQUEST_GROUP_DISABLED, STATUS_REQUEST_GROUP_VI } from "../constants";
import useRequestGroupStore from "../RequestGroupProvider";
import ContentEllipsis from "./ContentEllipsis";
type propsType = {};

export default function ViewRequest(props: propsType): React.JSX.Element {
    const {onChangeStatus,data,paging,setQuery,loading,onSelectPartner} = useRequestGroupStore();
    const canUpdateRequest = useMatchOrPolicy([POLICIES.UPDATE_REQUESTCHANGEGROUP,POLICIES.UPDATE_REQUESTCHANGEGROUPCTV]);
    const canDeleteRequest = useMatchPolicy(POLICIES.DELETE_REQUESTCHANGEGROUP);
    const columns: ColumnsType = [
        {
          title: "Nội dung",
          dataIndex: "contentRequest",
          key: "contentRequest",
          render(value, record, index) {
            return <ContentEllipsis>
              {value}
            </ContentEllipsis>
          },
        },
        {
          title: "Người yêu cầu",
          dataIndex: "requestOf",
          key: "requestOf",
          width : 150,
          render(requestOf) {
            return <Typography.Text strong>{get(requestOf,'fullName','')}</Typography.Text>
          },
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
              disabled={!canUpdateRequest}
              trigger={['click']}
              placement='bottomLeft'
              icon={<SyncOutlined style={{color : '#3481FF'}}/>}
              menu={{
                items : keys(STATUS_REQUEST_GROUP_VI).map((k : any) => ({
                  key : k,
                  label : get(STATUS_REQUEST_GROUP_VI,k),
                  onClick : () => {
                    onChangeStatus({_id,status : k});
                    onSelectPartner(get(rc,'requestOfId'))
                  },
                  icon : <Badge status={get(STATUS_REQUEST_GROUP_COLOR,k)}/>,
                  disabled : get(STATUS_REQUEST_GROUP_DISABLED,stt).includes(k) || (k === STATUS_REQUEST_GROUP.CANCELLED && !canDeleteRequest),
                }))
              }}
              >
                <Typography.Text style={{width : 100,textAlign:'left'}} strong>
                <Badge status={get(STATUS_REQUEST_GROUP_COLOR,stt)}/>
                {" "}
                {get(STATUS_REQUEST_GROUP_VI,stt)}
                </Typography.Text>
              </Dropdown.Button>
            );
          },
        },
      ];
  return (
    <div>
      <TableAnt loading={loading} size="small" dataSource={data} columns={columns} pagination={pagingTable(paging,setQuery)}/>
    </div>
  );
}
