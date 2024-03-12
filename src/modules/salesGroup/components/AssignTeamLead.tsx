import { Avatar, Button, List, Popover } from "antd";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import { useGetListTeamLeadSalesGroups } from "../salesGroup.hook";
type propsType = {};
export default function AssignTeamLead(props: propsType): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [keyword,setKeyWord] = useState('');
  const query = useMemo(() => ({keyword}),[keyword])
  const [data,isLoading] = useGetListTeamLeadSalesGroups(query);
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  return (
    <div>
      <Popover
        content={<List
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={get(item,'_id')}>
                <List.Item.Meta
                  avatar={<Avatar src={get(item,'avatar')} />}
                  title={<a href="https://ant.design">{get(item,'name','')}</a>}
                />
                <div>Content</div>
              </List.Item>
            )}
          />}
        title="Danh sách người quản lý"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button>+</Button>
      </Popover>
    </div>
  );
}
