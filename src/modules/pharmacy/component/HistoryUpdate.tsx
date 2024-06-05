import React from 'react';
import { useFetchState } from '~/utils/helpers';
import api from '~/modules/pharmacy/pharmacy.api'
import TableAnt from '~/components/Antd/TableAnt';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { get } from 'lodash';
type propsType = {
    id : any
}
export default function HistoryUpdate({id}:propsType) : React.JSX.Element {
    const [data,loading] = useFetchState({api : api.getHistoryUpdateById,useDocs : false,query : id,shouldRun : !!id});
    const columns : ColumnsType = [
        {
            title : "Ngày chỉnh sửa",
            dataIndex : 'createdAt',  
            key : 'createdAt',  
            align : 'center',
            render : (createdAt,rc) => <div className='flex-column-center'>
            <Typography.Text strong>{get(rc,'createBy','')}</Typography.Text>
            <Typography.Text type='secondary'>{dayjs(createdAt).format("DD-MM-YYYY HH:mm")}</Typography.Text>
            </div>
        },
        {
            title : "Chi tiết",
            dataIndex : 'historyMessage',  
            key : 'historyMessage',  
            render : (historyMessage) => <ul>
                {historyMessage?.map((item : string) => <li>{item}</li>)}
            </ul>
        },
    ]
    return (
        <div>
            <TableAnt loading={loading} columns={columns} dataSource={data} size="small" pagination={{showSizeChanger : true}}/>
        </div>
    )
}