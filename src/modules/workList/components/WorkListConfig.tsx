import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Tooltip, Popconfirm, Dropdown, Menu } from 'antd';
import { Suspense, useMemo, useState, FC, ChangeEvent } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
// import { useFormTaskContext } from './WorkList';
// import { WithOrPermission } from '../Common';
// import POLICIES from '~/constants/policy';
import { useNavigate } from 'react-router-dom';
import { useFormTaskContext } from '../screens/WorkList';
import TaskForm from '~/modules/workTask/components/TaskForm';
import TaskItem from '~/modules/workTask/components/TaskItem';

// const Task = Suspense.lazy(() => import('./Workitem.js'));

interface BoardConfigProps {
  name?: string;
  id?: string;
  dataBoardConfigItem?: any; // Change the type to your actual type
}

const BoardConfig: FC<BoardConfigProps> = ({ name, id, dataBoardConfigItem }) => {
  const tasks = useMemo(() => dataBoardConfigItem, [dataBoardConfigItem]);
  const { openForm, handleDeleteWork, handleButtonClick, sprintId } = useFormTaskContext();
  const [inputValue, setInputValue] = useState(name);
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleButtonClickOpen = () => {
    // Handle button click if needed
    openForm(id);
    setDropdownVisible(true); // Close the dropdown after clicking the button
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async () => {
    if (!inputValue) {
      setInputValue(name);
    }
    if (inputValue === name) {
      return;
    }
    try {
      // await api.workFlow.updateWorkFlow({ name: inputValue ?? name, id });
    } catch (error) {
      console.log(error);
    }
  };
  const menu: any = (
    <TaskForm setDropdownVisible={setDropdownVisible} dropdownVisible={dropdownVisible} />
  );
  return (
    <div className="work-list-main" style={{ height: '100vh' }}>
      <div className="work-list-column work-list-column_header" style={{ marginBottom: 10 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Row className="work-item-top" justify="center" align="middle" gutter={4}>
            <Col flex={1}>
              <Input
                type="text"
                size="small"
                className="input-title-boardConfig"
                style={{
                  width: '100%',
                  height: 30,
                  fontSize: '18px',
                  fontWeight: 700,
                  background: 'transparent',
                }}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
              />
            </Col>
            {/* <WithOrPermission permission={[POLICIES.ADMIN_TODOLIST, POLICIES.WRITE_TODOLIST]}> */}
            <Col style={{ width: 20 }} className="work-item-top_delete-button">
              <Popconfirm
                title="Bạn có chắc chắn muốn cột này ?"
                onConfirm={() => {
                  handleDeleteWork(id);
                }}
                okText="Xác nhận"
                cancelText="Huỷ"
              >
                <DeleteFilled style={{ color: '#DC3535' }} />
              </Popconfirm>
            </Col>
            {/* </WithOrPermission> */}
          </Row>
          <Tooltip title="Thêm mới công việc" color="blue" placement="bottom" mouseEnterDelay={0.2}>
            <Dropdown
              trigger={['click']}
              open={dropdownVisible}
              overlay={menu}
              onOpenChange={(visible) => setDropdownVisible(visible)}
            // dropdownRender={()=>()}
            >
              <Button
                type="primary"
                className="add-task"
                icon={<PlusOutlined />}
                onClick={handleButtonClickOpen}
              />
            </Dropdown>
          </Tooltip>
        </Space>
      </div>
      <Droppable key={id} droppableId={id as string} type={'TASK'} typeItem='task'>
        {(provided: any) => (
          <div
            key={id}
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="work-list-column work-list-column_body"
            style={{
              height: '100%',
              background: 'rgb(82 146 234 / 88%)',
            }}
          >
            <div className="task-list">
              {tasks?.map((task: any, index: number) => (
                <Draggable key={task._id} draggableId={task._id} index={index} >
                  {(provided: any) => (
                    <div
                      ref={provided.innerRef}
                      key={task._id}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-list__item"
                    >
                      <Suspense fallback={<div >...</div>}>
                        <TaskItem
                          key={task._id}
                          task={task}
                        />
                      </Suspense>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BoardConfig;
