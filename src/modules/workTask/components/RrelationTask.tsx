import { CloseOutlined, PlusCircleFilled } from '@ant-design/icons';
import { AutoComplete, Avatar, Button, Input, Spin, Tag } from 'antd';
import Text from 'antd/lib/typography/Text';
import { get, map } from 'lodash';
import React, { memo, useEffect, useMemo, useState } from 'react';
// import { useGetRelationTask, useSearchTask, useUpdateRelationTask } from '~/hooks';
// import useTaskItemStore from '~/storeContext/TaskItem';
import { TASK_ITEM_STATUS_NAME, TASK_ITEM_TYPE_REQUEST } from '~/constants/defaultValue';
import { useNavigate, useLocation } from 'react-router-dom';
import useTaskItemStore from '~/store/TaskItemContext';
import { getShortName } from './constants';
import { useGetRelationTask, useSearchTask, useUpdateRelationTask } from '../workTask.hook';

let timing : any = null;

function RelationTask() {
  const { dataTask } = useTaskItemStore();
  const [showInputSearch, setShowInputSearch] = useState(false);
  const [options, setOptions] = useState([]);
  const [valueSearch, setValueSearch] = useState('');
  const query = useMemo(() => ({ taskId: dataTask?._id }), [dataTask?._id]);

  const [listTaskRelation, ld_relation_task] = useGetRelationTask(query);
  const [, handleSearchTask] = useSearchTask();
  const [, handleUpdateRelationTask] = useUpdateRelationTask();
  const handleSearch = (value : any) => {
    if(!!(timing)){
      clearTimeout(timing)
    }

   if(!!(value)){ 
    timing = setTimeout(()=>{
      handleSearchTask({ 
        boardId: dataTask.boardId, 
        keyword: value??'',
        taskId:dataTask._id,
        action:setOptions
      })     
    },400)
    }else{
      setOptions([])
    }
    // setOptions(value ? searchResult(value) : []);
  };
  const onSelect = (value : any) => {
    handleUpdateRelationTask({typeRequest:TASK_ITEM_TYPE_REQUEST.add,taskId:value,taskItemId:dataTask?._id})
    setValueSearch('')
    setOptions([])
  };
  
  const handleDeleteRelationTask=(value : any)=>{
    handleUpdateRelationTask({typeRequest:TASK_ITEM_TYPE_REQUEST.remove,taskId:value,taskItemId:dataTask?._id})
  }

  const onToggleShowInputSearch = (e : any) => {
    e.preventDefault();
    setShowInputSearch((show) => !show);
    setOptions([]);
  };
  return (
    <div className="relation-task-container">
      &nbsp;
      <div className="relation-task-body">
        <div className='transition-h d-flex justify-content-center' style={{height:(ld_relation_task? 50:0),opacity:(ld_relation_task? 1:0)}} ><Spin size='large'></Spin></div>
         { map(listTaskRelation).map((task : any)=>(
            <React.Fragment key={task._id}>
            <div className='d-flex ' style={{width:'100%'}} key={task._id}>
              <div className='d-flex align-self-center'>
                <Button style={{padding:'3px 4px'}} type='text' onClick={()=>handleDeleteRelationTask(task._id)}>
                  <CloseOutlined style={{fontSize:14,color:'red'}} />
                </Button>
                </div>
            <TaskRelationItem  task={task}/>
          </div>
          <hr />
            </React.Fragment>
          ))
        }
      </div>
      <div className="relation-task-controller">
        <Button
          type={showInputSearch ? 'dashed' : 'primary'}
          onClick={onToggleShowInputSearch}
          className="relation-task-controller-add"
        >
          &nbsp;
          <PlusCircleFilled />
          &nbsp; Tạo liên kết &nbsp;
        </Button>
        {showInputSearch && (
          <AutoComplete
            options={options}
            onChange={setValueSearch}
            tabIndex={2}
            value={valueSearch}
            onSelect={onSelect}
            onSearch={handleSearch}
            className="relation-task-controller-search"
          >
            <Input.Search enterButton placeholder="Tìm kiếm" allowClear />
          </AutoComplete>
        )}
      </div>
    </div>
  );
}

export default RelationTask;

const TaskRelationItem = memo(({ task }: any) => {
  const navigate = useNavigate();
  const history = useLocation()
  const statusBackGround = get(task,'statusId.backgroundColor','gray') 
  const statusValue = get(task,'statusId.value',  'Không xác định')

  const actionRouting = ()=>{
    // history.push({
    //   pathname:"/work-task-item/"+task._id
    // })
    navigate(`/work-task-item/${task._id}`)
  }
  return (
    <div className="relation-task-item flex-fill">
      <Avatar.Group
        size="large"
        maxCount={1}
        className="relation-task-item-avatar"
      >
        {
          get(task,'assignUser',[{user:{avatar:'',fullName:'No Name'}}]).map(({user}: any)=><Avatar src={user?.avatar} >{getShortName(user?.fullName)}</Avatar>)
        }
      </Avatar.Group>
      <div className="relation-task-item-info d-flex">
        <Button type="text" onClick={actionRouting} className="relation-task-item-info-tag">
         {get(task,'code','#...')}
        </Button>
        <Text  onClick={actionRouting } ellipsis={true} style={{cursor:'pointer'}} className="relation-task-item-info-name">
         {get(task,'name','Name ...jack plenty asleep oil water greatly step percent native train man shall back building space common poor pond rock tell clay mean fear college')}
        </Text>
        <Text className="relation-task-item-info-status"><Tag color={statusBackGround}>{statusValue} </Tag></Text>
      </div>
    </div>
  );
});
interface taskRelationOptionProps{
  task?: any,
}
// export const TaskRelationOption = memo(({task}: taskRelationOptionProps) => {

//   const statusBackGround = get(task,'statusId.backgroundColor','gray') 
//   const statusValue = get(task,'statusId.value',  'Không xác định')

//   return (
//     <div className="relation-task-item flex-fill">
//       <Avatar.Group
//         size="large"
//         maxCount={1}
//         className="relation-task-item-avatar"
//       >
//         {
//           get(task,'assignUser',[{user:{avatar:'',fullName:'No Name'}}]).map(({user}: any)=><Avatar src={user?.avatar} >{getShortName(user?.fullName)}</Avatar>)
//         }
//       </Avatar.Group>
//       <div className="relation-task-item-info d-flex">
//         <Text ellipsis={true} className="relation-task-item-info-tag">
//          {get(task,'code','#...')}
//         </Text>
//         <Text ellipsis={true} className="relation-task-item-info-name">
//          {get(task,'name','Name ...jack plenty asleep oil water greatly step percent native train man shall back building space common poor pond rock tell clay mean fear college')}
//         </Text>
//         <Text className="relation-task-item-info-status"> <Tag color={statusBackGround}>{statusValue} </Tag></Text>
//       </div>
//     </div>
//   );
// });

interface TaskRelationOptionProps {
  task?: any; 
}


const TaskRelationOption: React.FC<TaskRelationOptionProps> = ({ task }) => {
    const statusBackGround = get(task,'statusId.backgroundColor','gray') 
  const statusValue = get(task,'statusId.value',  'Không xác định')

  return (
    <div className="relation-task-item flex-fill">
      <Avatar.Group
        size="large"
        maxCount={1}
        className="relation-task-item-avatar"
      >
        {
          get(task,'assignUser',[{user:{avatar:'',fullName:'No Name'}}]).map(({user}: any)=><Avatar src={user?.avatar} >{getShortName(user?.fullName)}</Avatar>)
        }
      </Avatar.Group>
      <div className="relation-task-item-info d-flex">
        <Text ellipsis={true} className="relation-task-item-info-tag">
         {get(task,'code','#...')}
        </Text>
        <Text ellipsis={true} className="relation-task-item-info-name">
         {get(task,'name','Name ...jack plenty asleep oil water greatly step percent native train man shall back building space common poor pond rock tell clay mean fear college')}
        </Text>
        <Text className="relation-task-item-info-status"> <Tag color={statusBackGround}>{statusValue} </Tag></Text>
      </div>
    </div>
  );
};

export {TaskRelationOption};
