import { CloseOutlined, InfoCircleFilled } from '@ant-design/icons';
import { Avatar, Button, Col, Popconfirm, Row, Tooltip } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useFormTaskContext } from '~/modules/workList/screens/WorkList';
import { getShortName } from '~/utils/helpers';
import SelectStatusTask from '../components/SelectStatusTask';
import apis from '../workTask.api';
interface TaskProps {
  task: any; // Replace 'any' with the actual type of your 'task' object
  // idBoard: string; // Replace 'string' with the actual type of your 'idBoard' property
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [style, setStyle] = useState<boolean>(false);
  const {
    handleDeleteTask,
    setVisibleInfo,
    setIdVisibleInfo,
    setTaskData,
    updateTask,
    boardData: boardById,
  } = useFormTaskContext();
console.log('task',task,boardById)
  const [selected, setSelected] = useState('Không xác định');

  const handleChange = async (value: string) => {
    setSelected(value);
    const res = await apis.update({ statusId: value, id: task._id });
    setTaskData(res?.data);
  };

  useEffect(() => {
    const statusItem = boardById?.listStatusConfig.find((item:any) => item._id === task?.statusId?._id);

    if (statusItem) {
      setSelected(statusItem._id);
    } else if (typeof task?.statusId === 'object') {
      setSelected(get(task?.statusId, 'value', 'Không xác định'));
    } else {
      setSelected('Không xác định');
    }
  }, [boardById?.listStatusConfig, task?.statusId]);

  return (
    <div
      className={'work-item ' + (style ? 'active' : '')}
      onClick={(e) => {
        setStyle(true);
        setTimeout(() => {
          setStyle(false);
        }, 500);
      }}
      onDoubleClick={() => {
        window.open(`/work-task-item/${task._id}`);
      }}
    >
      {/* {task.name} */}
      <Row  justify='center' style={{ alignItems: 'center', cursor: 'move' }} className='headerTask'>
        <Col flex={0} style={{ padding: '0 4px' }} >
           <SelectStatusTask handleChange={handleChange} defaultValue={selected} value={selected} initStatusValue={get(task,'statusId',{})} listStatus={boardById?.listStatusConfig}/> 
        </Col>
        <Col flex={1}>
          <Tooltip title='Mở trang chi tiết' mouseEnterDelay={0.8}>
            <Button type='link' target='_blank' href={`/work-task-item/${task._id}`} style={{ color: 'rgb(77 114 145)', float: 'left', marginLeft: 10 }}>#{task.code}</Button>
          </Tooltip>
        </Col>
        <Col className='work-item-icon-action-info' style={{ display: 'flex', justifyContent: 'space-around', width: '50px', alignItems: 'center', fontSize: 'large' }} >
          <Tooltip title='Xem chi tiết' mouseEnterDelay={0.8} >
            <InfoCircleFilled
              onClick={(event) => {
                event.preventDefault();
                setVisibleInfo(true);
                setIdVisibleInfo(task._id);
                setTaskData(task);
              }} />
          </Tooltip>
            <span className='work-item-icon-action' style={{}}>
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa task này ?"
                onConfirm={() => { handleDeleteTask({ id: task._id, boardConfigId: task.boardConfigId }) }}
                okText="Xác nhận"
                cancelText="Huỷ"
              >
                <CloseOutlined className='button-remove-task' style={{ color: '#DC3535' }} />
              </Popconfirm>
            </span>

        </Col>
      </Row>
      <Row
        style={{ cursor: 'initial' }}
        onDoubleClick={() => {
          window.open(`/work-task-item/${task._id}`);
        }}>
        <div className='work-item-content'>
          <p className='bodyTask'>{task.name}</p>
        </div>
      </Row>
      <Row align='middle' justify='end' style={{ width: '100%' }}>
        <Col >
          <Avatar.Group
            maxCount={3}
            size={24}
            maxStyle={{
              color: '#f56a00',
              backgroundColor: '#fde3cf',
            }}
          >
            {task.assignUser && task.assignUser.map((item:any) => (
              <Tooltip title={get(item?.user||item?.User || item?.userId, 'fullName')} mouseEnterDelay={0.8}>

                <Avatar
                  size={24}
                  src={get(item?.user||item?.User || item?.userId, 'avatar') ?? ''}
                  style={{ marginRight: '2px', backgroundColor: '#f56a00', }}
                >
                  {!get(item?.user||item?.User || item?.userId, 'avatar') &&
                    getShortName(get(item?.user||item?.User || item?.userId, 'fullName', ''))
                  }
                </Avatar>
              </Tooltip>
            ))}
          </Avatar.Group>
        </Col>
      </Row>
    </div>
  );
};

export default Task;
