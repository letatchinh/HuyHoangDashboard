
import React, { Suspense, useState, lazy, useCallback } from 'react';
import { Button, Col, Form, Modal, Row, Select, Space, Switch, Table, message } from 'antd';
import Search from 'antd/lib/input/Search';
import Breadcrumb from '~/components/common/Breadcrumb';
import { useDeleteWorkBoard, useGetlistWorkBoard, useUpdateWorkBoardParams, useWorkBoardPaging, useWorkBoardQueryParams } from '../workBoard.hook';
import { useExpandrowTableClick } from '~/utils/helpers';
import useTranslate from '~/lib/translation';
import { ColumnsType } from 'antd/es/table';
import { DataType } from '../workBoard.modal';
import moment from 'moment';
import BoardForm from '../components/BoardForm';
import BoardFormDetail from '../components/BoardFormDetail';
import { SearchOutlined } from '@ant-design/icons';
import WithPermission from '~/components/common/WithPermission';
import POLICIES from '~/modules/policy/policy.auth';
import { useMatchOrPolicy } from '~/modules/policy/policy.hook';
interface WorkFlowProps { }

const WorkBoard: React.FC<WorkFlowProps> = () => {
    const canUpdate = useMatchOrPolicy([POLICIES.UPDATE_WORKMANAGEMENT]);
    const canDELETE = useMatchOrPolicy([POLICIES.DELETE_WORKMANAGEMENT]);
  const [form] = Form.useForm();
  const { select, setSelect, onClick } = useExpandrowTableClick();
  const [isOpenForm, setOpen] = useState(false);
  const [id, setId]: any = useState(null);
  const [query] = useWorkBoardQueryParams();
  const [keyword, { onParamChange, setKeyword }] = useUpdateWorkBoardParams(query);
  const [isSubmitLoading, deleteWorkList] = useDeleteWorkBoard();
  const [board, isLoadingList] = useGetlistWorkBoard(query);
  const [openDetail, setOpenDetail] = useState(false);
  const paging = useWorkBoardPaging();
  const { t }: any = useTranslate();
  const handleDelete = (id: string) => {
    deleteWorkList(id);
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

  const handleCloseForm = useCallback(() => {
    setOpen(false);
    setId(null);
    form.resetFields();
  }, []);
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (value, record) => {
        return (
          <Button type="link" href={`/work-board/sprint/${record._id}`} >
            {value}
          </Button>
        );
      }
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
      title: 'Xem chi tiết',
      key: 'detail',
      width: '130px',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="middle"
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
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      width: '180px',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" onClick={() => {
            if(!canUpdate) return message.warning('Bạn không có quyền thay đổi')
            handleOpenUpdate(record?._id)}}>
            Chinh sửa
          </Button>
          <Button style={{ color: 'red' }} onClick={() =>{
            if(!canDELETE) return message.warning('Bạn không có quyền xoá')
            handleDelete(record._id)}}>
            Xóa
          </Button>
        </Space>
      ),
    }
  ];
  const onSearch = (value: string) => {
    onParamChange({ ['keyword']: value });
  };
  const pageSizeOptions = ['10', '20', '50', '100'];
  return (
    <div className="branch-detail page-wraper page-content page-workflow">
      {/* <TabBranch> */}
      <div className="container-fluid">
        <Breadcrumb title={t("workBoard")} />
        <Row justify="space-between">
          <Col span={8}>
            <Search
              style={{ height: '50px', padding: '5px 0px' }}
              placeholder="Nhập bất kì để tìm..."
              value={keyword}
              onChange={(e) => (setKeyword(e.target.value))

              }
              allowClear
              onSearch={onSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col>
            <WithPermission permission={POLICIES.WRITE_WORKMANAGEMENT}>
              <Button onClick={() => handleOpenFormCreate()} type="primary">
                Thêm mới
              </Button>
            </WithPermission>
          </Col>
        </Row>
        <Table
          rowKey={(rc) => rc._id}
          columns={columns}
          dataSource={board}
          onRow={(item) => ({
            onClick: () => onClick(item),
          })}
          pagination={{
            ...paging,
            pageSizeOptions: pageSizeOptions,
            showSizeChanger: true, // Hiển thị dropdown chọn kích thước trang
            defaultPageSize: 10, // Kích thước trang mặc định
            showTotal: (total) => `Tổng cộng: ${total} `,
          }}
          expandable={{
            expandedRowKeys: select,
            onExpandedRowsChange: (e: any) => {
              onParamChange({ page: 1 }); // Reset to the first page when expanding rows
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
      <Modal open={isOpenForm} footer={null} onCancel={() => setOpen(false)} width={700} destroyOnClose
        title={id ? 'Chinh sửa không gian làm việc' : 'Thêm không gian làm việc'}
      >
        <Suspense fallback={<div>...</div>}>
          <BoardForm id={id} handleCloseForm={handleCloseForm} />
        </Suspense>
      </Modal>
      <Modal open={openDetail} footer={null} onCancel={() => setOpenDetail(false)} width={750} destroyOnClose
        title={'Xem chi tiết'}
      >
        <Suspense fallback={<div>...</div>}>
          <BoardFormDetail id={id} setOpenDetail={setOpenDetail} />
        </Suspense>
      </Modal>
    </div>
  );
};

export default WorkBoard;
