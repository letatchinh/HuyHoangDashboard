import { CheckOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, List, Typography } from 'antd'
import Search from 'antd/lib/input/Search'
import { get } from 'lodash'
import { useState } from 'react'
import useTaskItemStore from '~/store/TaskItemContext'
import { useHandleAssign } from '../workTask.hook'
import { StringToSlug } from '~/utils/helpers'

interface MenuAssignProps {
  dataTask?: any
};
const MenuAssign: React.FC<MenuAssignProps> = ({ dataTask }) => {
  const { assign: { users, isLoading, canAssign } } = useTaskItemStore();
  const { _id, assignUser = [] } = dataTask;
  const [userShow, setUserShow] = useState(null);

  const onSearchUsers = (fullName: string) => {
    setUserShow(users?.filter((user: any) => StringToSlug(get(user, 'fullName', '')?.toLowerCase())?.includes(StringToSlug(fullName?.trim()?.toLowerCase()))))
  };

  const [isLoadingAssign, onAssign] = useHandleAssign();

  const handleAssign = (newEmployeeId: any) => {
    let listAssignClone = assignUser?.map((item: any) => get(item, 'userId')); // Convert To Id List
    
    let listAssignSubmit = []
    const isExist = listAssignClone?.some((employeeId: any) => employeeId === newEmployeeId);
    if (isExist) { // Un Assign
      listAssignSubmit = listAssignClone?.filter((employeeId: any) => employeeId !== newEmployeeId)
    } else { // Assign
      listAssignSubmit = [...listAssignClone, newEmployeeId]
    }
    const submitData = {
      id: _id,
      listAssign: listAssignSubmit,
    };

    onAssign(submitData);
  }
  return (
    <div className='menuAssign'>
      <ConfigProvider
        theme={{
          components: {},
        }}
      >
      <h6 style={{ textAlign: 'center' }}>Các thành viên</h6>
      <Search allowClear onChange={(e) => onSearchUsers(e.target.value)} onSearch={(value) => onSearchUsers(value)} placeholder='Tìm kiếm thành viên' enterButton={false} />
      <List
        className="menuAssign--listAssign"
        loading={isLoading}
        dataSource={userShow ?? users}
        split={false}
        renderItem={item => (
          <List.Item
            style={{
              padding: 0,
            }}
          >
            <Button onClick={() => handleAssign(get(item, '_id'))}
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between', 
                textTransform: 'unset',
                borderColor: 'transparent',
              }}
            
            >
              {get(item, 'fullName', '')}
              {assignUser?.some((e: any) => get(e, 'userId') === get(item, '_id')) && <CheckOutlined />}
            </Button>
          </List.Item>
        )}
      />
      {!canAssign && <div className='menuAssign--overlayDisabled'>
        <Typography.Title level={5} style={{ textAlign: 'center' }}>Bạn Phải là quản lý mới được phép thêm người tham gia</Typography.Title>
      </div>}

      </ConfigProvider>
    </div>
  )
};
export default MenuAssign;
