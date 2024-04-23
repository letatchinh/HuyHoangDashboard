
import React, { Suspense, useState, useCallback } from 'react';
import { Button, Col, Form, Modal, Row, Space, Table } from 'antd';
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
import { useNavigate } from 'react-router-dom';
interface WorkFlowProps { }

const WorkBoard: React.FC<WorkFlowProps> = () => {
  // const canCreate = useMatchOrPolicy([POLICIES.WRITE_TODOLIST]);
  const canUpdateAndDelete = useMatchOrPolicy([POLICIES.UPDATE_TODOLIST, POLICIES.DELETE_TODOLIST]);
  const canUpdate = useMatchOrPolicy([POLICIES.UPDATE_TODOLIST]);
  const canDELETE = useMatchOrPolicy([POLICIES.DELETE_TODOLIST]);
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
  const [destroy,setDestroy] = useState(false);
  const handleDelete = (id: string) => {
    deleteWorkList(id);
  };
  const handleOpenUpdate = (id: string) => {
    setOpen(true);
    if (id) {
      setId(id);
      setDestroy(true)
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
  const navigate = useNavigate()
  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      align: 'left',
      key: 'name',
      className: 'name-column',
      render: (value, record) => (
       <span style={{ cursor: 'pointer' }}>
        <Button type="link" onClick={() => navigate(`sprint/${record._id}`)} >
          {value}
        </Button>
       </span> 
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createBy',
      align: 'center',
      key: 'createBy',
      render: (_, record) => <p>{record?.userCreate?.fullName}</p>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (record) => {
        return moment(record).format("DD/MM/YYYY");
      },
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
    ...( canUpdateAndDelete ? [
      {
        title: 'Hành động',
        key: 'action',
        align: 'center' as any,
        width: '180px',
        render: (_:any, record:any) => (
          <Space size="small">
            <WithPermission permission={POLICIES.UPDATE_TODOLIST}>
              <Button type="primary" size='small' onClick={() => {
                // if (!canUpdate) return message.warning('Bạn không có quyền thay đổi')
                handleOpenUpdate(record?._id)
              }}>
                Chỉnh sửa
              </Button>
            </WithPermission>
            <WithPermission permission={POLICIES.DELETE_TODOLIST}>
              <Button size='small' style={{ color: 'red' }} onClick={() => {
                // if (!canDELETE) return message.warning('Bạn không có quyền xoá')
                handleDelete(record._id)
              }}>
                Xóa
              </Button>
            </WithPermission>
          </Space>
        ),
      }
    ]: []
  ),
  ];
  const onSearch = (value: string) => {
    onParamChange({ ['keyword']: value });
  };
  const pageSizeOptions = ['10', '20', '50', '100'];
  return (
    <div className="branch-detail page-wraper page-content page-workflow">
      {/* <TabBranch> */}
      <div className="container-fluid">
        <Breadcrumb title={t("Quản lý không gian làm việc")} />
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
            <WithPermission permission={POLICIES.WRITE_TODOLIST}>
              <Button onClick={() => handleOpenFormCreate()} type="primary">
                Thêm mới
              </Button>
            </WithPermission>
          </Col>
        </Row>
        <Table
          rowKey={(rc) => rc._id}
          columns={columns}
          loading={isLoadingList}
          dataSource={board}
          onRow={(item) => ({
            onClick: onClick(item),
            // onMouseEnter:(evt:any)=>{
            //   if(evt?.target?.cellIndex===0){

            //     }
            // }
          })}
          expandable={{
            expandedRowKeys: select,
            onExpandedRowsChange: (e: any) => {
              onParamChange({ page: 1 }); // Reset to the first page when expanding rows
              setSelect(e);
            },
          }}
          bordered
          pagination={false}
        />
        {/* )} */}
      </div>
      {/* </TabBranch> */}
      <Modal  open={isOpenForm} footer={null} onCancel={handleCloseForm} width={700} destroyOnClose={destroy} afterClose={() => setDestroy(false)}
        title={id ? 'Chỉnh sửa không gian làm việc' : 'Thêm không gian làm việc'}
      >
        <Suspense fallback={<div>...</div>}>
          <BoardForm setDestroy={setDestroy} id={id} handleCloseForm={handleCloseForm} />
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
