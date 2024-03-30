import { Button, Popover, Typography } from 'antd';
import { get } from 'lodash';
import React, { useState } from 'react';
import { formatter } from '~/utils/helpers';
import FormConditionWorking from './FormConditionWorking';
type propsType = {
    rc : any
}
export default function ConditionShowWorking({rc}:propsType) : React.JSX.Element {
    const {cond} = rc;
    const [open, setOpen] = useState(false);
    const hide = () => {
      setOpen(false);
    };
    const handleOpenChange = (newOpen: boolean) => {
      setOpen(newOpen);
    };
    
    return (
        <Popover
        trigger={["click",'contextMenu']}
        content={
          <FormConditionWorking
            initData={rc}
            id={get(rc, "_id")}
            onCancel={hide}
          />
        }
        open={open}
        onOpenChange={handleOpenChange}
      >
        <div style={{cursor : 'pointer'}}>
            <p><Typography.Text strong>{get(cond,'gte',0)}</Typography.Text> ngày trở lên phát sinh đơn hàng liên tục, đơn hàng min từ <Typography.Text strong>{formatter(get(cond,'subCond',0))}</Typography.Text> trở lên</p>
        </div>
      </Popover>
    )
}