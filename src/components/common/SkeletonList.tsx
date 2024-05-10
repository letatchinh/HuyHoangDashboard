import { List } from 'antd'
import SkeletonInput from 'antd/lib/skeleton/Input'
import { range } from 'lodash'
import React from 'react'

export default function SkeletonList({rowCount = 5}) {
  return (
    <List>
        {range(0, rowCount)?.map(item => <List.Item key={item}>
            <SkeletonInput active className='skeleton-notification'/>
            <hr style={{margin : 0}}/>
        </List.Item>)}
    </List>
  )
}
