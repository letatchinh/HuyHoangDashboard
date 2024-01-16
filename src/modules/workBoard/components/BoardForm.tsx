import React, { useEffect, useMemo } from 'react';
import { Button, Col, Form, Input, Radio, Row, Select, Skeleton } from 'antd';
import { get, transform, xorBy } from 'lodash';
import {
  useCreateWorkBoard,
  useGetBoardById,
  useUpdateWorkBoard,
  useGetListBoard,
  useGetListManagersByIdBoard,
  useGetListStaffsByIdBoard,
  useGetListManagers,
  useGetListStaffs
} from '../workBoard.hook';
import {
  useGetListStatusConfig,
  useStatusConfigQueryParams,
} from '~/modules/statusConfig/statusConfig.hook';
import { DataTypeStatusConfig } from '~/modules/statusConfig/statusConfig.modal';
import { filterAcrossAccents } from '~/utils/helpers';
import DebounceSelect from '~/components/common/DebounceSelect';
import apis from '~/modules/statusConfig/statusConfig.api';

interface BoardFormProps {
  id?: string;
  handleCloseForm: () => void;
}

const BoardForm: React.FC<BoardFormProps> = ({ id, handleCloseForm }) => {
  const _id = useMemo(() => id, [id]);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [isSubmitLoading, createBoard] = useCreateWorkBoard();
  const [isSubmit, updateBoard] = useUpdateWorkBoard();
  const [boardById, isLoading] = useGetBoardById(id);
  const [query] = useStatusConfigQueryParams();
  const [listAllStatus] = useGetListStatusConfig(query);
  const [listManagers, isLoadingManager] = useGetListManagers();
  const [listStaffs, isLoadingStaffs] = useGetListStaffs();
  const [listBoardGroup, isLoadingGetListBoard] =useGetListBoard()
  const [listStaffsById, isLoadingStaffById] = useGetListStaffsByIdBoard(id);
  const [listManagersByBoard, isLoadingManagerByBoard] = useGetListManagersByIdBoard(id);
  const listStaffFilter = useMemo(() => xorBy(listStaffs,listManagersByBoard,(item:any)=>item._id), [ listStaffs,listManagersByBoard]);
  const initListStatusCreate:DataTypeStatusConfig | false = useMemo(() => {
    if (listAllStatus?.length) {
      return listAllStatus
        .filter((status: DataTypeStatusConfig) => status.isDefault)
        .map((status: DataTypeStatusConfig) => status._id);
    }
    return false;
  }, [listAllStatus]);
  
  useEffect(() => {
    if (!_id && initListStatusCreate) {
      form.setFieldsValue({ listStatus: initListStatusCreate });
    }
  }, [initListStatusCreate, _id, form]);

  useEffect(() => {
    if (_id) {
      if (boardById) {
        const { name, security, parentId, listStatusConfig } = boardById;
        const listStatusConfigId = listStatusConfig.map((status: any) => status._id);
        form.setFieldsValue({
          name,
          security: security ?? 'private',
          parentId,
          listStatus: listStatusConfigId,
        });
      }
    } else {
      form.resetFields();
    }
  }, [boardById, form, _id]);

  const onFinish = (values: any) => {
    values.parentId = values.parentId ?? false;
    if (id) {
      updateBoard({ ...values, id });
      handleCloseForm();
      form.resetFields();
    } else {
      createBoard(values);
      handleCloseForm();
      form.resetFields();
    }
  };

  const fetchOptions = async() => {
    const res = await apis.getAll();
    console.log(res)
    const options = get(res,'docs',[])?.map((item:any) => ({label : get(item,'name.vi'),value : get(item,'_id')}))
    return options
  }
  return (
    <Form
    form={form}
    name="basic"
    labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
    wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
    style={{ maxWidth: 700, }}
    labelAlign="left"
    onFinish={onFinish}
    autoComplete="off"
    onValuesChange={({security})=>{
      if(security==='public')
      form.setFieldsValue({staffs:[]})
    }}
  >
    <Form.Item
      label="Tên"
      name="name"
    >
      <Input />
    </Form.Item>
    <Form.Item name="security" label="Trạng thái" initialValue={'private'}>
      <Radio.Group >
        <Radio value="public">Công khai</Radio>
        <Radio value="private">Nội bộ</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item
        label="Người quản lý"
        name="managers"
      >
        {listManagers ? <Select
          mode="multiple"
          showSearch
          loading={isLoadingManager}
          // autoComplete="off"
          filterOption={filterAcrossAccents}
        >
          {listManagers?.map(({ id, _id, fullName } : any) => (
            <Option key={id || _id} value={id || _id}>
              {fullName}
            </Option>
          ))}
        </Select>
          : <Skeleton.Input active />}
      </Form.Item>

<Form.Item shouldUpdate={(pre,cur)=>pre.security!== cur.security} noStyle> 
        {()=><Form.Item
        label="Danh sách thành viên"
        name="staffs"
      >
        {listStaffs ? <Select
          mode="multiple"
          loading={isLoadingStaffs}
          showSearch
          // autoComplete="off"
          filterOption={filterAcrossAccents}
        >
          {listStaffFilter?.map(({ id, _id, fullName }) => (
            <Option key={id || _id} value={id || _id}>
              {fullName}
            </Option>
          ))}
        </Select>
          : <Skeleton.Input active />
        }
      </Form.Item>}
      </Form.Item>
    <Form.Item name={'parentId'} label={'Nhóm'}>
     {listBoardGroup ?<Select allowClear options={[...listBoardGroup?.filter(({path}:any)=>(!path.includes(_id)))].map((value)=>({label:value.name,value:value._id}))} ></Select> : null } 
    </Form.Item>
    <Form.Item shouldUpdate={(pre, cur) => pre.listStatus !== cur.listStatus} noStyle>
    {()=>(
            <Form.Item
            label="Cấu hình trạng thái"
            name="listStatus"
          >
              <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Vui lòng chọn trạng thái"
                  allowClear
                  showSearch
                  // autoComplete="off"
                  filterOption={filterAcrossAccents}
                >
                  {transform(
                    listAllStatus,
                    (result?:any, value?:any) => result.push(value),
                    []
                  )?.map((e:any) => (
                    <Select.Option
                      key={get(e, '_id', '')}
                      value={get(e, '_id', '')}
                      label={get(e, 'value', '')}
                    >
                      <p style={{ color: 'black' }}>{get(e, 'value')}</p>
                    </Select.Option>
                  ))}
                </Select>
            </Form.Item>
        )}
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 10, span: 18 }}>
      <Row style={{ width: '639px' }}>
        <Col span={4}>
          <Button htmlType="submit" type="primary"  >
            {id ? 'Cập nhật' : 'Thêm mới'}</Button>
        </Col>
      </Row>
    </Form.Item>
  </Form>
  );
};

export default BoardForm;
