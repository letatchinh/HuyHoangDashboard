import { Divider } from 'antd';
import { omit } from 'lodash';
import React from 'react';
import StepStatus from '../../bill/components/StepStatus';
import { STATUS_BILLITEM, STATUS_BILLITEM_VI } from '../constants';
type propsType = {
    historyStatus : any,
    status : any,
}
export default function ExpandRowBillItem({historyStatus,status}:propsType) : React.JSX.Element {
    return (
        <div>
            <StepStatus
              statuses={
                status !== STATUS_BILLITEM.CANCELLED
                  ? omit(STATUS_BILLITEM, ["CANCELLED"])
                  : omit(STATUS_BILLITEM, [
                    STATUS_BILLITEM.ORDERED,
                    STATUS_BILLITEM.PACKAGED,
                    STATUS_BILLITEM.RECEIVED,
                    STATUS_BILLITEM.SHIPPING,
                      STATUS_BILLITEM.COMPLETED,
                      STATUS_BILLITEM.PROCESSING,
                    ])
              }
              statusesVi={STATUS_BILLITEM_VI}
              currentStatus={status}
              historyStatus={historyStatus}
            />
            <Divider />
        </div>
    )
}