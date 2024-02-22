import { Button, Col, Form, Input, Radio, Row, Select, Skeleton } from 'antd';
import { debounce, differenceBy, get } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormTaskContext } from '~/modules/workList/screens/WorkList';
import apisSprint from '~/modules/workSprint/workSprint.api';
import { useGetListTaskBySprints, useGetWorkSprints } from '~/modules/workSprint/workSprint.hook';
import { useCopyTask, useResetAction } from '../workTask.hook';
interface TaskFormProps {
  dropdownVisible?: boolean;
  setDropdownVisible: (value: boolean) => void;
}
const TaskForm: React.FC<TaskFormProps> = ({setDropdownVisible, dropdownVisible}) => {
  const { Option } = Select;
  const { boardConfigId, boardId, id,handleButtonClick, handleCreateTask, setVisibleModal, sprintId, boardData } = useFormTaskContext();
  const [form] = Form.useForm();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [idSprint, setIdSprint] = useState<string>('');
  const [taskData, setTaskData] = useState<any>([]);
  const [dataTask,setDataTask] = useState([]);
    const [, copyTask] = useCopyTask();
    const nQuery = useMemo(() => ({  id: sprintId }), [sprintId,copyTask]);
  const query = useMemo(() => {
    if (boardId) {
      return {
        page: 1,
        limit: 30,
        boardId,
      };
    }
    return null;
  }, [boardId]);
  const getData = useCallback(async () => {
    const a = await apisSprint.getTaskInSprints(nQuery)
    console.log(a,'asdasd')
    setDataTask(a)
   }, [nQuery]);
   useEffect(() => {
     getData();
   }, [sprintId]);
  const [sprints] = useGetWorkSprints(query);
  const querySearch = useMemo(() => ({
    id: idSprint ? idSprint : sprintId,
    keyword: keyword,
  }), [idSprint, keyword]);
  useResetAction();
    const [sprint, isLoadingSprint] = useGetListTaskBySprints(querySearch);
    useEffect(() => {
      if (sprint) {
        const arr: any = differenceBy(sprint, dataTask, '_id','taskExited');
            setTaskData(arr);
      };
    }, [sprint, dataTask,idSprint]);
  const [value, setValue] = useState<string>('new');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const onFinish = async (values: any) => {
    const { name } = values;
    const data = {
      name,
      assignUser: [],
      detail: {
        priority: 'NORMAL',
        date: [],
      },
      description: '',
      boardConfigId,
      sprintId,
      boardId: boardId,
      estimatedTime: 0,
      file: [],
      status: '',
      justDetail: false,
      statusId: '',
    };
    handleCreateTask(data);
    setDropdownVisible(false);
  };
  const handleChangeTask = async (value: string) => {
    const data = {
      sprintId,
      boardConfigId,
    };
    copyTask({ id: value, ...data });
    handleButtonClick();
    setDropdownVisible(false);
  };
  return (
    <>
<div style={{ width: '103%', backgroundColor: 'white', height: '150px', boxShadow: 'rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px' }}>
        <Radio.Group onChange={(e: any) => onChange(e)} value={value} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Radio value='new'>Tạo mới</Radio>
          <Radio value='existed'>Chọn công việc đã có</Radio>
        </Radio.Group>
        {value === 'existed' ? (
          <>
          <Form>
            <Row gutter={48} align="middle" justify="space-between">
            <Col flex={1}>
              <Form.Item
                label="Tên danh mục"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn danh mục',
                  },
                ]}
                name='sprint'
              >
                {sprints?.length === 0 ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    showSearch
                    // autoComplete="off"
                    onChange={(value) => {
                      setIdSprint(value);
                    }}
                  >
                    {sprints?.map((item:any) => (
                      <Option key={item?._id} value={item._id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item
                label="Tên công việc"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn ',
                  },
                ]}
                name='boardConfig'
              >
                {isLoadingSprint ? (
                  <Skeleton.Input active />
                ) : (
                  <Select
                    showSearch
                    disabled={!idSprint}
                    filterOption={false}
                    onSearch={debounce((value) => {
                      setKeyword(value);
                    }, 500)}
                    onChange={(value) => {
                      handleChangeTask(value);
                    }}
                  >
                    {Array.isArray(taskData) &&
                      taskData?.map((task) => (
                        <Option key={task?._id} value={task._id}>
                          <div className="task-option-label-item" style={{ width: '120%', borderBottom: '1px solid #f0f0f0', marginBottom: 10 }}>
                            <Row  justify='center' style={{ alignItems: 'center', cursor: 'move' }} className='headerTask'>
                              <Col flex={0} style={{ padding: '0 4px' }} >
                                <Button style={{ color: get(task?.statusId, 'color'), backgroundColor: get(task?.statusId, 'backgroundColor'), float: 'left' }}>{get(task?.statusId, 'value')}</Button>
                              </Col>
                              <Col flex={1} >
                                <Button style={{ color: 'rgb(77 114 145)', float: 'left', marginLeft: 10 }}>{task.code}</Button>
                              </Col>
                            </Row>
                            <Row
                              style={{ cursor: 'initial' }}
                            >
                              <div >
                                <p className='bodyTask'>{task.name}</p>
                              </div>
                            </Row>
                          </div>
                        </Option>
                      ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          </Form>
          </>
        ) : (
          <Form
            form={form}
            onFinish={onFinish}
            layout="horizontal"
          >
            <Form.Item style={{ marginBottom: 0, width: '90%' }} label="Tên task" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}>
              <Input />
            </Form.Item>
            <Form.Item style={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}>
              <Button htmlType="submit" type="primary">
                {id ? 'Cập nhật' : 'Thêm mới'}</Button>
            </Form.Item>
          </Form>
        )}
      </div>

    </>
  );
};

export default TaskForm;
