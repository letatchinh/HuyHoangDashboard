import { CheckOutlined } from '@ant-design/icons';
import { Form, Input, List, Select, Skeleton, Space, Tag, Typography } from 'antd';
import { get, sortBy } from 'lodash';
import moment from 'moment';
import { BOARD_SECURITY } from '../constants';
import { useEffect } from 'react';
import {
    useCreateWorkBoard,
    useGetlistWorkBoardById,
    useUpdateWorkBoard,
    useGetlistWorkBoard,
    useGetListBoard,
    useGetListManagerById,
    useGetListEmployeeById

  } from '../workBoard.hook';
  import { DataTypeStatusConfig } from '~/modules/statusConfig/statusConfig.modal';
import { BOARD_SECURITY_TYPE, PERMISSION } from '../workBoard.modal';

interface BoardFormDetailProps {
  id?: string;
  setOpenDetail?: (value: boolean) => void;
}

const BoardFormDetail: React.FC<BoardFormDetailProps> = ({ id }) => {
  const [form] = Form.useForm();
  const [boardById, isLoading] = useGetlistWorkBoardById(id);
  const [listStaffsById, isLoadingStaff] = useGetListEmployeeById(id);
  const [listBoardGroup] = useGetListBoard();
  const [listManagersByBoard, isLoadingManagerByBoard] = useGetListManagerById(id);

  useEffect(() => {
    if (id) {
    //   if (boardById && listManagersByBoard && listStaffsById) {
      if (boardById ) {
        const { name, security, parentId } = boardById;
        form.setFieldsValue({
          name,
          security: security ?? 'private',
          parentId,
        });
      }
    } else {
      form.resetFields();
    }
//   }, [boardById, form, id, listManagersByBoard, listStaffsById]);
  }, [boardById, form, id]);

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      autoComplete="off"
    >
      <Form.Item label="Tên" name="name">
        {isLoading ? <Skeleton.Input active /> : <Input readOnly />}
      </Form.Item>
      <Form.Item name="security" label="Trạng thái">
        <Space>{BOARD_SECURITY[boardById?.security as keyof BOARD_SECURITY_TYPE]}</Space>
      </Form.Item>
      <Form.Item label="Người quản lý" name="managers">
        {listManagersByBoard?.map(({ id, _id, fullName }:PERMISSION ) => (
          <Tag color="blue" style={{ padding: '3px 8px', fontSize: '13px', marginBottom: '5px' }} key={id || _id} >
            {fullName}
          </Tag>
        ))}
      </Form.Item>
      <Form.Item label="Danh sách thành viên" name="staffs">
        {listStaffsById?.map(({ id, _id, fullName }:PERMISSION ) => (
          <Tag color="blue" style={{ padding: '3px 8px', fontSize: '13px', marginBottom: '5px' }} key={id || _id} >
            {fullName}
          </Tag>
        ))}
      </Form.Item>
 <Form.Item name="parentId" label="Nhóm">
  <Select
    open={false}
    options={listBoardGroup?.filter(({ _id }: any) => _id !== id).map((value: any) => ({ label: value.name, value: value._id ?? '' })) || []}
  ></Select>
</Form.Item>


      {isLoading ? (
        <Skeleton.Input active />
      ) : (
        <div style={{ marginTop: 20, maxHeight: 400, overflowY: 'auto' }}>
          <List
            header={<h5>Lịch sử chỉnh sửa</h5>}
            bordered
            dataSource={sortBy(get(boardById, 'historyLogs', []), ({ timestamp }) => -(new Date(timestamp)))}
            style={{ width: '100%' }}
            renderItem={(item) => (
              <List.Item>
                <div className="history-board-content" style={{ overflowY: 'auto' }}>
                  <CheckOutlined style={{ color: 'green', marginRight: 10 }} />{' '}
                  <Typography.Text mark>[{moment(get(item, 'timestamp')).format('HH:mm DD/MM/YYYY')}]</Typography.Text>{' '}
                  <strong style={{ marginRight: 8 }}>{get(item, 'username', '')}</strong> {get(item, 'message', '')}
                </div>
              </List.Item>
            )}
          />
        </div>
      )}
    </Form>
  );
};

export default BoardFormDetail;
