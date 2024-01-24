import React, { createContext, useContext, useEffect, useMemo, useRef, useState, lazy, Suspense, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { Button, Drawer, Form, Modal, Space, Spin } from 'antd';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { ResizableBox } from 'react-resizable';
import Text from 'antd/lib/typography/Text';
import { get } from 'lodash';
import { useUpdatePositionBoardConfig,useCreateWorkList, useDeleteWorkList, useGetListBoardConfig, useListBoardConfigItem, useUpdatePosition, useWorkListQueryParams, useUpdateWorkList } from '../workList.hook';
import { useGetWorkSprint } from '~/modules/workSprint/workSprint.hook';
import MenuListBoard from '~/modules/workSprint/components/MenuListBoard';
import BoardConfig from '../components/WorkListConfig';
import { FormTaskContextProps } from '../workList.modal';
import { useCreateTask, useDeleteTask, useResetAction, useUpdateTask } from '~/modules/workTask/workTask.hook';
import { useGetBoardById } from '~/modules/workBoard/workBoard.hook';
import Menufilter from '../components/Menufilter';
import TaskTabDetail from '~/modules/workTask/components/Task/TaskTabDetail';
const FormTaskContext = createContext({});
export const useFormTaskContext = () => useContext<FormTaskContextProps | any>(FormTaskContext);

const WorkList = () => {
  const workflowRef = useRef<any>(); // You can replace 'any' with a more specific type if available

  const { sprintId: sprintId_ } = useParams();
  const sprintId = useMemo(() => sprintId_, [sprintId_]);
  const [sprintInfo,] = useGetWorkSprint(sprintId);
  const idBoard = useMemo(() => sprintInfo?.boardId, [sprintInfo]);
  const [query] = useWorkListQueryParams(sprintId);
  const [visibleModal, setVisibleModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [form] = Form.useForm();
  const [boardConfig] = useGetListBoardConfig(query);
  const boardConfigMemo = useMemo(() => (boardConfig ?? []).map(({ name, _id,ordinal }: any) => ({ name, _id,ordinal })), [boardConfig]);
  const [data] = useListBoardConfigItem();
  const [propsModal, setPropsModal] = useState({});
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [lengthList, setLength] = useState<number>(
    workflowRef?.current?.offsetWidth ?? window.innerWidth
  );
  // let data = boardConfigMemo;
  const handleButtonClick = useCallback(() => {
    form.resetFields();
    setDropdownVisible(false); // Close the dropdown after clicking the button
  }, []);
  const [taskData, setTaskData] = useState('');
  const [visibleListBoard, setVisibleListBoard] = useState(false);
  const [idVisibleInfo, setIdVisibleInfo] = useState('');
  const [, updateTask] = useUpdateTask();
  const [, updatePosition] = useUpdatePosition();
  const [, handleCreateTask] = useCreateTask();
  const [,updatePositionBoardConfig] = useUpdatePositionBoardConfig();
  const [, handleDeleteTask] = useDeleteTask();
  const [, handleCreateWork] = useCreateWorkList();
  const [, handleDeleteWork] = useDeleteWorkList();
  const [, updateBoardConfig] = useUpdateWorkList()
  const [boardData] = useGetBoardById(idBoard);
  const [data1, setData1] = useState<any>(data);
  const showDrawer = (param?: any) => {
    setVisibleListBoard((val) => param ?? !val);
  };
  const handleFinshed = useCallback((val: any, key: any,id?:any) => {
    updateTask({
      [key]: val,
      id: id,
    });
  }, []);
  const openFormTask = (id: any, data: any) => {
    setPropsModal({ boardConfigId: id });
  };
  useEffect(() => {
    if (!visibleInfo) {
      setLength(workflowRef?.current?.offsetWidth ?? window.innerWidth);
    } else {
      setLength(workflowRef?.current?.offsetWidth * 0.7);
    }
  }, [visibleInfo]);
  const changePosition = (sourceIndex: any, destinationIndex: any) => {
    const newData: any = [...boardConfigMemo];
  const sourceItem = newData?.[sourceIndex];
  if ( sourceIndex !== destinationIndex) {
    newData.splice(sourceIndex, 1);
    newData.splice(destinationIndex, 0, sourceItem);
    let valueIdxUp = get(newData[destinationIndex-1], 'ordinal', 0);
    let valueIdxDown = get(newData[destinationIndex+1], 'ordinal', valueIdxUp + 5);
    let newOrdinal = (valueIdxUp + valueIdxDown) / 2;
    Object.assign(sourceItem ?? {}, { ordinal: newOrdinal });
    updateBoardConfig({id:get(sourceItem,'_id',''),ordinal:newOrdinal});
    updatePositionBoardConfig({ newData, destinationIndex, sourceIndex });
  };
};
  const onDragEndv2 = (result: any) => {
    const { source, destination, draggableId } = result;
    if (result.type === 'TASK') {
      let colBefore = result?.source?.droppableId,
        indexBefore = result?.source?.index,
        colAfter = result?.destination?.droppableId,
        indexAfter = result?.destination?.index;

      if (!colAfter) {
        return;
      }

      let dataBefore = [...{ ...data }[colBefore]];
      let dataAfter = [...data[colAfter]];

      if (colBefore === colAfter) {
        if (indexBefore === indexAfter) {
          return;
        }
        dataAfter.splice(indexBefore, 1);
      };
      let valueIdxUp = get(dataAfter[indexAfter - 1], 'ordinal', 0);
      let valueIdxDown = get(dataAfter[indexAfter], 'ordinal', valueIdxUp + 10);
      let newOrdinal = (valueIdxUp + valueIdxDown) / 2;
      let [{ ...itemBeRemove }] = dataBefore.splice(indexBefore, 1);
      Object.assign(itemBeRemove ?? {}, { ordinal: newOrdinal });
      updateTask({ id: itemBeRemove._id, ordinal: newOrdinal, boardConfigId: colAfter });
      updatePosition({
        colBefore,
        indexBefore,
        colAfter,
        indexAfter,
      });
    }
    else {
      changePosition(source?.index, destination?.index);
    }
  };
  return (
    <div className="branch-detail page-wraper page-content page-workflow">
      <FormTaskContext.Provider
        value={{
          ...propsModal,
          setPropsModal,
          openForm: openFormTask,
          boardId: idBoard,
          boardData,
          sprintId: sprintId_,
          updateTask,
          handleCreateTask,
          handleDeleteWork,
          setVisibleModal,
          handleDeleteTask,
          setVisibleInfo,
          setIdVisibleInfo,
          idVisibleInfo,
          setTaskData,
          handleFinshed,
          taskData,
          dropdownVisible,
          setDropdownVisible,
          handleButtonClick,
        }}
      >
        <Space style={{ width: '100%', height: 40, justifyContent: 'start', alignItems: 'center' }}>
          <Button htmlType="button" type="primary" onClick={(e) => {
            e.preventDefault();
            showDrawer();
          }}>=</Button>
          {!get(sprintInfo, 'name') ? (
            <Spin />
          ) : (
            <Text ellipsis style={{ fontSize: 28, width: '92vw' }}>{get(sprintInfo, 'name')}</Text>
          )}
        </Space>
        <Suspense fallback={<p>...</p>}>
          <Menufilter />
        </Suspense>
        <hr />
        <div className="workflow" ref={workflowRef}>
          <ResizableBox
            className={`react-resizable_custom ${visibleInfo ? 'active' : ''}`}
            resizeHandles={['e']}
            minConstraints={[workflowRef?.current?.offsetWidth * 0.2 || window.innerWidth * 0.2, Infinity]}
            maxConstraints={[workflowRef?.current?.offsetWidth * 0.7 || window.innerWidth * 0.7, Infinity]}
            height={Infinity}
            draggableOpts={{ grid: [8, 8] }}
            width={lengthList}
          >
            <div className="work-list">
              <div className="work-list-body">
                <DragDropContext onDragEnd={onDragEndv2}>
                  {boardConfigMemo?.map(({ name, _id }: any, index: number) => (
                    <Droppable key={_id} droppableId={_id} type={'COLUMN'} typeItem='boardConfig'>
                      {(provided: any) => (
                        <div
                          key={_id}
                           {...provided.droppableProps}
                          ref={provided.innerRef}                         
                        >
                          <Draggable key={_id} draggableId={_id} index={index} >
                            {(provided: any) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <BoardConfig
                                  key={_id}
                                  dataBoardConfigItem={data[_id] ?? []}
                                  name={name}
                                  id={_id}
                                />
                              </div>
                            )}
                          </Draggable>

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                  {/* <WithOrPermission permission={[POLICIES.WRITE_TODOLIST, POLICIES.ADMIN_TODOLIST]}> */}
                  <Button
                    // type="ghost"
                    htmlType="button"
                    onClick={() => handleCreateWork({ boardId: idBoard, sprintId, name: 'Default' })}
                  >
                    + Thêm danh mục
                  </Button>
                  {/* </WithOrPermission> */}
                </DragDropContext>
              </div>
            </div>
          </ResizableBox>
          <div className="view-port-info-container">
            {visibleInfo && (
              <div className="view-port-info-body">
                <Suspense fallback={<p>...loading</p>}>
                  <TaskTabDetail idTask={idVisibleInfo} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
        <Drawer
          title={
            <p style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              <Button type="dashed" href={`/work-board/sprint/${idBoard}`}><ArrowLeftOutlined style={{ color: 'black', fontSize: 16 }} /></Button>
              &nbsp; Danh sách nhóm
            </p>
          }
          extra={<Button type="text" onClick={() => showDrawer(false)}><CloseOutlined /></Button>}
          placement="left"
          mask={true}
          maskStyle={{ background: 'transparent', width: '100vw' }}
          drawerStyle={{ background: '#333739' }}
          bodyStyle={{
            paddingLeft: 0,
            paddingRight: 0
          }}
          width={'max-content'}
          closable={false}
          maskClosable={true}
          onClose={() => showDrawer(false)}
          visible={visibleListBoard}
          getContainer={false}
          headerStyle={{
            padding: '10px 8px 10px 3px',
            background: 'white'
          }}
          style={{
            position: 'absolute',
            boxShadow: '0px 3px 3px #333',
            textDecoration:'none',
          }}
        >
          <ResizableBox
            className={'react-resizable_custom react-resizable-list_board'}
            resizeHandles={['e']}
            minConstraints={[256, Infinity]}
            maxConstraints={[500, Infinity]}
            height={Infinity}
            width={300}
          >
            <Suspense fallback={<p>...</p>}>
              <MenuListBoard />
            </Suspense>
          </ResizableBox>
        </Drawer>
      </FormTaskContext.Provider>
    </div>
  );
};

export default WorkList;
