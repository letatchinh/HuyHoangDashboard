import React, { useMemo } from 'react'
import { sortBy } from 'lodash'
import moment from 'moment'
import { Card, Col, Divider, Row } from 'antd'
// import { HISTORY_TASK_ITEM_TYPE } from '~/constants/defaultValue'
// import { HistoryRender } from '../constants'
import Text from 'antd/lib/typography/Text'
import { ClockCircleOutlined } from '@ant-design/icons'
import useTaskItemStore from '~/store/TaskItemContext'
import { HistoryRender } from './constants'
import { HISTORY_TASK_ITEM_TYPE } from '~/constants/defaultValue'
export default function ActivityTask() {

  const { allHistoryTaskById } = useTaskItemStore();
    const dataSort = useMemo(() => {
        let timeTemp = ''
        let data : any = sortBy(allHistoryTaskById, ({ createdAt }) => -(new Date(createdAt)))

        data = data.map((value: any) => {
            let timeInPipeline = moment(value.createdAt).format('DD/MM/YYYY ')
            let check = false;
            if (timeTemp != timeInPipeline) {
                timeTemp = timeInPipeline
                check = true
            }
            const result = [value]
            if (check) {
                result.unshift({ keyRender: timeTemp })
            }
            return result
        })
        return data.flat(2)
    }, [allHistoryTaskById])


    return (
        <div className='activity-task-container'>
            <div className='activity-task-header'>
              {/* <div className='activity-task-header-title'>
                <span>Lịch sử chỉnh sửa</span> 
              </div> */}
              </div>
            <div className='activity-task-content' style={{ width: 'auto', padding: '0 20px',height:'100%' }}>
                {
                    dataSort.map((value: any) => {
                        if (value?.keyRender) {
                            return <Divider orientation="left" plain>
                                <h5>{value?.keyRender}  </h5>
                            </Divider>
                        }

                        return <Card  bordered={true}>
                            <h6> <Text type='secondary'><ClockCircleOutlined /> {moment(value.createdAt).format('DD/MM/YYYY HH:mm A')}</Text>  <strong>{value.createBy}</strong> đã cập nhập giá trị  <strong>{HISTORY_TASK_ITEM_TYPE[value?.action]}</strong>.</h6>  
                            <HistoryRender value={value} />
                        </Card>
                    })
                }
            </div>

        </div>
    )
}
