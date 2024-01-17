import { UserOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Row, Tag, Typography , MenuProps} from 'antd'
import Text from 'antd/lib/typography/Text'
import { get } from 'lodash'
import React, { useMemo } from 'react'
import { v4 } from 'uuid'
import MenuAssign from './MenuAssign'
import BaseBorderBox from '~/components/common/BaseBorderBox'
import { useHandleAssign } from '../workTask.hook'
import useTaskItemStore from '~/store/TaskItemContext'

interface Props {
  dataTask?: any
};

export default function Assigner({ dataTask }: Props) {
    const { _id } = dataTask || {};
    const { assign: { canAssign } } = useTaskItemStore();

    const assignUser = useMemo(() => get(dataTask, 'assignUser', []), [dataTask])
    const [isLoadingAssign, onAssign] = useHandleAssign();
    const onRemove = (idRemove : any) => {
        const submitData = {
            id: _id,
            listAssign: assignUser?.map((assign: any) => get(assign, 'userId._id',get(assign, 'userId',)))?.filter((employeeId: any) => employeeId !== idRemove),
        };

        onAssign(submitData)
    }
    return (
        <div>
            <BaseBorderBox title={<span><UserOutlined /> <Text strong>Thành viên tham gia</Text></span>}>
                <div>
                    <Row style={{ marginTop: 15 }}>
                        <Col style={{ minWidth: 90 }}>Thành viên: </Col>
                        {
                            !assignUser?.length && <Typography.Title level={5} type='secondary'>Hiện chưa có thành viên nào tham gia</Typography.Title>
                        }
                        <Col flex={1}>{assignUser?.map((employee: any) => {
                            return <Tag closable={canAssign} key={get(employee, 'User.fullName', v4())} onClose={() => onRemove(get(employee, 'userId._id',get(employee, 'userId',)))} color='processing'>{get(employee, 'User.fullName')}</Tag>
                        })}</Col>
                    </Row>
                </div>
                &nbsp; &nbsp;
                <div className='task-detail-content-left-button-tab add-member'>
                    <Dropdown menu={<MenuAssign dataTask={dataTask}/>  as MenuProps} trigger={['click']} >
                      <Button type='primary' icon={<UsergroupAddOutlined />}>Thêm thành viên tham gia</Button>
                    </Dropdown>
                  </div>
             
            </BaseBorderBox>
        </div>
    )
}
