import React, { useEffect, useMemo } from 'react';
import { Button, Form, Input, Select, Spin } from 'antd';
import { useGetlistRankingById, useDeleteRanking, useUpdateRanking,useCreateRanking } from '../ranking.hook';
import {useGetManufacturerList} from '../../manufacturer/manufacturer.hook';
interface Props {
  id?: any;
  callBack?: () => void;
}

interface FieldType {
  id: string
  name: string
  note: string
  level: string
}
const { TextArea } = Input;
const RankingForm: React.FC<Props> = ({ id, callBack }) => {
    const query = useMemo(() => ({ limit: 10, page: 1 }), []);
    const [listManufacturer, isLoadingManufacturer] = useGetManufacturerList(query);
    console.log(listManufacturer,'listManufacturer');
  const [, updateRanking] = useUpdateRanking(callBack);
  const [, createRanking] = useCreateRanking(callBack);
  const [rankingConfigById, isLoading] = useGetlistRankingById(id);
  const [form] = Form.useForm();

  useEffect(() => {
    if (id&&rankingConfigById ) { 
      const {name,level}: FieldType = rankingConfigById;
      form.setFieldsValue({
        name,
        level,
      })
    }
  }, [id,rankingConfigById,form]);

  const onFinish = (values: FieldType) => {
     const data: FieldType = {
      ...values,
      // code:'DMT0001'
      // status:'',
      };
      if (id) {
        updateRanking({ ...data, id });
      }else {
        createRanking({ ...data });
        
      }
  };
  const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  return (
    <>
      <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 800 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item<FieldType> label="Tên hãng" name="name">
        {isLoadingManufacturer&&listManufacturer ? <Spin>Loading...</Spin>: <Select filterOption={filterOption} showSearch options={listManufacturer?.map((item: any) => ({ label: item.name, value: item.id }))}/>} 
        </Form.Item>
        <Form.Item<FieldType> label="Xếp hạng ranking" name="level">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 12 }}>
          <Button type="primary" htmlType="submit">
            {id ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default RankingForm;
