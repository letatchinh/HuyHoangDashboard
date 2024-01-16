import { CheckOutlined } from '@ant-design/icons'
import { Button, List } from 'antd'
import Search from 'antd/lib/input/Search'
import { compact, get } from 'lodash'
import React from 'react'

interface Props {
  dataSource?: any
  progressList?: any
  onUpdateProgress?: any
  index?: number
  progress?: any
};
export default function SelectUsersAssign({dataSource,progressList,onUpdateProgress,index,progress}: Props) {
  const onAssign = (newEmployeeId: any) => {
    const listAssigned = get(progress,'[0].assign','')?.split(',');
    let assign = '';
    if(listAssigned?.includes(newEmployeeId)){ // Exist will Remove
      assign = compact(listAssigned)?.filter(id => id !== newEmployeeId)?.join(',');
    }else{ // Not Exist will Add
      assign = compact([...listAssigned,newEmployeeId])?.join(',');
    };
    onUpdateProgress(get(progressList,'_id'),index,[{assign},progress[1]]);

  }
  return (
    <div className='menuAssign'>
    <h6 style={{textAlign : 'center'}}>Các thành viên</h6>
    {/* <Search placeholder='Tìm kiếm thành viên' enterButton={false}/> */}
    <List
        className="menuAssign--listAssign"
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item
          style={{padding : 0}}
          >
            <Button onClick={() => onAssign(get(item,'_id',get(item,'userId',get(item,'userId',))))} style={{width : '100%',justifyContent : 'space-between',textTransform : 'unset',}}>
              {get(item,'fullName',get(item,'User.fullName',''))}
              {get(progress,'[0].assign','').includes(get(item,'_id',get(item,'userId',false))) && <CheckOutlined />}
            </Button>
          </List.Item>
        )}
      />
    </div>
  )
}
