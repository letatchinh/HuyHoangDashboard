
import React, { Suspense, useState, lazy } from 'react';
import { Button, Col, Form, Modal, Row, Select, Table } from 'antd';
import Search from 'antd/lib/input/Search';
// import POLICY from '~/constants/policy';
// import { useMatchOrPolicy } from '~/hooks';

import Breadcrumb from '~/components/common/Breadcrumb';
import { useDeleteWorkBoard, useGetlistWorkBoard, useUpdateWorkBoardParams, useWorkBoardPaging, useWorkBoardQueryParams } from '../workBoard.hook';
import { useExpandrowTableClick } from '~/utils/helpers';
// const BoardForm = lazy(() => import('./TaskForm/BoardForm.js'));
// const BoardFormDetail = lazy(() => import('./TaskForm/BoardFormDetail.js'));

interface WorkFlowProps {}

const WorkBoard: React.FC<WorkFlowProps> = () => {
//   const canUpdateAndDelete = useMatchOrPolicy([POLICY.UPDATE_TODOLIST, POLICY.DELETE_TODOLIST]);
  const [form] = Form.useForm();
  const { select, setSelect, onClick } = useExpandrowTableClick();
  const [isOpenForm, setOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [query] = useWorkBoardQueryParams();
  const [keyword, { onParamChange, setKeyword }] = useUpdateWorkBoardParams(query);
  const [isSubmitLoading, deleteWorkList] = useDeleteWorkBoard();
  const [board, isLoadingList] = useGetlistWorkBoard(query);
  const [openDetail, setOpenDetail] = useState(false);
  const paging = useWorkBoardPaging();

  const handleDelete = (id: string) => {
    deleteWorkList({ id });
  };

  const handleOpenUpdate = (id: string) => {
    setOpen(true);
    if (id) {
      setId(id);
    }
  };

  const handleOpenFormDetail = (id: string) => {
    setOpenDetail(true);
    if (id) {
      setId(id);
    }
  };

  const handleOpenFormCreate = () => {
    setOpen(true);
    setId(null);
  };

  const handleCloseForm = () => {
    setOpen(false);
    form.resetFields();
  };

//   const columns = useColumnsBoard({ handleOpenFormDetail });
//   const columnsAction = useActionColumn({ handleDelete, handleOpenUpdate });

  return (
    <div className="branch-detail page-wraper page-content page-workflow">
      {/* <TabBranch> */}
        <div className="container-fluid">
          <Breadcrumb title="Quản lý không gian làm việc" />
          {/* <WithPermission permission={POLICY.WRITE_TODOLIST}> */}
            <Button style={{ marginBottom: 16 }} type="primary" onClick={handleOpenFormCreate}>
              Thêm không gian
            </Button>
          {/* </WithPermission> */}
          <div className="page-wraper__header">
            <Row>
              <Col span={6}>
                <Search
                  placeholder={`Nhập để tìm...`}
                  enterButton
                  allowClear
                  onSearch={(value) => {
                    onParamChange({ keyword: value?.trim() });
                  }}
                  style={{ maxWidth: '500px' }}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    if (e.target.value === '') {
                      onParamChange({ keyword: null });
                    }
                  }}
                  value={keyword}
                />
              </Col>
            </Row>
          </div>
          {/* {isLoadingList && !(board ?? []).length ? (
            <SkeletonTable
              columns={columns.concat(canUpdateAndDelete ? columnsAction : [])}
              dataSource={[]}
              pagination={{
                ...paging,
                showTotal: (total) => `Tổng cộng: ${total} `,
              }}
              onChange={({ current }) => {
                onParamChange({ page: current });
              }}
            />
          ) : ( */}
            <Table
              rowKey={(rc) => rc._id}
            //   columns={columns.concat(canUpdateAndDelete ? columnsAction : [])}
              dataSource={board}
              onRow={(item) => ({
                onClick: onClick(item),
              })}
              pagination={false}
              expandable={{
                expandedRowKeys: select,
                onExpandedRowsChange: (e:any) => {
                  setSelect(e);
                },
              }}
              onChange={({ current }) => {
                onParamChange({ page: current });
              }}
            />
          {/* )} */}
        </div>
      {/* </TabBranch> */}
      <Modal visible={isOpenForm} footer={null} onCancel={() => setOpen(false)} width={700} destroyOnClose={true}>
        <Suspense fallback={<div>...</div>}>
          {/* <BoardForm id={id} handleCloseForm={handleCloseForm} /> */}
        </Suspense>
      </Modal>
      <Modal visible={openDetail} footer={null} onCancel={() => setOpenDetail(false)} width={1200} destroyOnClose>
        <Suspense fallback={<div>...</div>}>
          {/* <BoardFormDetail id={id} setOpenDetail={setOpenDetail} /> */}
        </Suspense>
      </Modal>
    </div>
  );
};

export default WorkBoard;
