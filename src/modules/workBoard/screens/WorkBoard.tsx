
import React, { Suspense, useState, lazy } from 'react';
import { Button, Col, Form, Modal, Row, Select, Space, Switch, Table } from 'antd';
import Search from 'antd/lib/input/Search';
// import POLICY from '~/constants/policy';
// import { useMatchOrPolicy } from '~/hooks';

import Breadcrumb from '~/components/common/Breadcrumb';
import { useDeleteWorkBoard, useGetlistWorkBoard, useUpdateWorkBoardParams, useWorkBoardPaging, useWorkBoardQueryParams } from '../workBoard.hook';
import { useExpandrowTableClick } from '~/utils/helpers';
import SelectSearch from '~/components/common/SelectSearch';
import useTranslate from '~/lib/translation';
import { ColumnsType } from 'antd/es/table';
import { DataType } from '../workBoard.modal';
import moment from 'moment';
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
  const { t }: any = useTranslate();
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
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Người tạo',
      dataIndex: 'createBy',
      align: 'center',
      key: 'createBy',
      render: (_, record) => <a>{record?.userCreate?.fullName}</a>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      align: 'center',
      key: 'createAt',
      render: (item, record, index) => moment(item)?.format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Thao tác',
      dataIndex: 'status',
      align: 'center',
      width: '120px',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record?.status === 'ACTIVE'}
          onChange={(value: boolean) => {
            // Update your logic here based on the switch value
            // updateProductConfig({ status: value ? 'ACTIVE' : 'INACTIVE', id: record?._id });
          }}
        />
      ),
    },
    {
      title: 'Xem chi tiết',
      key: 'detail',
      width: '130px',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            type="link"
            style={{ background: '#1890ff', borderRadius: '10px', color: 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenFormDetail(record?._id);
            }}
          >
            <span> Xem chi tiết</span>
          </Button>
        </Space>
      ),
    },
    // canUpdateAndDelete
    //   ? 
      {
          title: 'Hành động',
          key: 'action',
          align: 'center',
          width: '180px',
          render: (_, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => handleOpenUpdate(record?._id)}>
                Xem chi tiết
              </Button>
              <Button style={{ color: 'red' }} onClick={() => handleDelete(record._id)}>
                Xóa
              </Button>
            </Space>
          ),
        }
      // : null,
  ];
  
//   const columns = useColumnsBoard({ handleOpenFormDetail });
//   const columnsAction = useActionColumn({ handleDelete, handleOpenUpdate });
const onSearch = (value: string) => {
  onParamChange({ ['keyword']: value });
};
  return (
    <div className="branch-detail page-wraper page-content page-workflow">
      {/* <TabBranch> */}
        <div className="container-fluid">
          <Breadcrumb title={t("workBoard")} />
          <SelectSearch onSearch = {onSearch} isShowButtonAdd={true} showSelect={false} />
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
              columns={columns}
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
      <Modal open={isOpenForm} footer={null} onCancel={() => setOpen(false)} width={700} destroyOnClose={true}>
        <Suspense fallback={<div>...</div>}>
          {/* <BoardForm id={id} handleCloseForm={handleCloseForm} /> */}
        </Suspense>
      </Modal>
      <Modal open={openDetail} footer={null} onCancel={() => setOpenDetail(false)} width={1200} destroyOnClose>
        <Suspense fallback={<div>...</div>}>
          {/* <BoardFormDetail id={id} setOpenDetail={setOpenDetail} /> */}
        </Suspense>
      </Modal>
    </div>
  );
};

export default WorkBoard;
