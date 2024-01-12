import React, { Suspense, lazy, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Col, Dropdown, Menu, Row, Select, Space } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
// import { useParams, useHistory, Redirect, useRouteMatch } from 'react-router-dom';
// import { useCreateSprint, useDeleteSprint, useGetSprints, useUpdateSprint } from '~/hooks/workSprint';
// import { WithOrPermission, WithPermission } from '~/components/Common';
// import POLICIES from '~/constants/policy';
// import { useSprintContext } from './Sprint';
// import { useGetListManagersByIdBoard, useProfile } from '~/hooks';
import { get } from 'lodash';
import { useGetListManagerById } from '~/modules/workBoard/workBoard.hook';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '~/modules/auth/auth.hook';
import { useCreateWorkSprint, useDeleteWorkSprint, useGetWorkSprints, useUpdateWorkSprint } from '../workSprint.hook';
import SprintCard from './SprintCard';
import { useSprintContext } from '../screens/WorkSprint';

// const SprintCard = lazy(() => import('./SprintCard.js'));
const layoutCol = { lg: { span: 6 }, xl: { span: 6 }, xxl: { span: 4 }, sm: { span: 12 }, md: { span: 8 }, style: { height: 'auto' } };

const SprintList: React.FC = memo(() => {
  const { boardId } = useParams();
  const { showDrawer, board } = useSprintContext();
  const [listManagersByBoard,] = useGetListManagerById(boardId);
  const [profile] = useProfile();
  const userIsAdminforBoard = useMemo(() => get(profile, 'isSuperAdmin', false) || listManagersByBoard.some(({ _id }:any) => String(_id) === String(profile?._id)), [listManagersByBoard, profile]);

  const query = useMemo(() => {
    if (!boardId) {
      return null;
    }
    return {
      boardId
    };
  }, [boardId]);

  const [sprintByBoardID,] = useGetWorkSprints(query);
  const [dataSource, setDataSource] = useState(sprintByBoardID);

  const boardNow = useMemo(() => {
    const item = (board ?? []).find(({ _id }) => String(_id) === String(boardId))
    return item;
  }, [boardId, board]);

  useEffect(() => {
    setDataSource(sprintByBoardID);
  }, [sprintByBoardID])

  const [, handleCreate] = useCreateWorkSprint()
  const [, handleUpdate] = useUpdateWorkSprint()
  const [, handleDelete] = useDeleteWorkSprint()
  const navigate = useNavigate()
//   const history = useHistory();

  const handleSelect = (value: string, option: React.ReactElement) => {
    navigate(value)
  }

  return (
    <div style={{ width: 'auto', height: '100%' }}>
      <Space align='center' style={{ position: 'sticky', top: 0, width: '100%', backgroundColor: 'white', zIndex: 2 }}>
        <Button
          htmlType='button'
          type='primary'
          onClick={(e) => {
            e.preventDefault();
            // showDrawer()
          }}
        >=</Button>
        <h4 style={{ margin: 0 }}>Danh mục: </h4>
        {
          (boardNow || board.length) && <Select
            style={{ fontSize: 20 }}
            bordered={false}
            defaultValue={boardNow?._id ?? null}
            dropdownMatchSelectWidth={false}
            onSelect={handleSelect}
          >
            {(board ?? []).map(({ name, _id }) => (
              <Select.Option key={_id} value={_id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        }
      </Space>
      <Row
        wrap={true}
        justify="start"
        align="stretch"
        gutter={[24, 24]}
        style={{ boxSizing: 'border-box', marginTop: '15px' }}
      >
        {dataSource.map((value:any, index:any) => {
          return (
            <Col {...layoutCol} key={index}>
              <Suspense fallback={<p>Loading...</p>}>
                <SprintCard
                  key={value._id}
                  style={{ '--duration': (Math.round(Math.sqrt(index)) * 130) + 'ms' }}
                  onCreate={(data) => handleCreate({ ...data, boardId })}
                  onSave={(data) => { handleUpdate({ ...data, boardId }) }}
                  onDelete={(data) => { handleDelete({ ...data, boardId }) }}
                  name={value.name}
                  id={value._id}
                  boardId={boardId}
                  type={value?.type ?? false}
                  userIsAdminforBoard={userIsAdminforBoard}
                  note={
                    value?.note ??
                    ''
                  }
                />
              </Suspense>
            </Col>
          );
        })}
        {/* <WithOrPermission permission={[POLICIES.ADMIN_TODOLIST, POLICIES.WRITE_TODOLIST]}> */}
          <Col {...layoutCol} key={'create'}>
            <Button
              htmlType="button"
              onClick={() =>
                setDataSource((old:any) => [
                  ...old,
                  { name: 'Create', note: '', type: 'CREATE' }
                ])
              }
            >
              {' '}
              <PlusOutlined></PlusOutlined> Thêm Danh mục{' '}
            </Button>
          </Col>
        {/* </WithOrPermission> */}
      </Row>
    </div>
  );
});

export default SprintList;
